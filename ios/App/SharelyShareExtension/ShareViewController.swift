//
//  ShareViewController.swift
//  SharelyShareExtension
//
//  Created by Charith Dissanayaka on 2024-08-01.
//

import UIKit
import Social
import UniformTypeIdentifiers
import FirebaseCore
import FirebaseFirestore
import FirebaseAuth
import SwiftUI

class ShareViewController: SLComposeServiceViewController {
    
    private var isUserAuthenticated = false
    private var userId: String?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        if FirebaseApp.app() == nil {
            FirebaseApp.configure()
            retrieveAuthStateAndReauthenticate()
        }
        
        // Ensure access to extensionItem and itemProvider
        guard
            let extensionItem = extensionContext?.inputItems.first as? NSExtensionItem,
            let itemProvider = extensionItem.attachments?.first else {
            close()
            return
        }
        
        // Handle different content types
        let contentTypes: [String: (NSItemProvider, @escaping (Any?) -> Void) -> Void] = [
            UTType.plainText.identifier: handleText,
            UTType.image.identifier: handleImage,
            UTType.url.identifier: handleURL,
            UTType.movie.identifier: handleVideo
        ]
        
        for (typeIdentifier, handler) in contentTypes {
            if itemProvider.hasItemConformingToTypeIdentifier(typeIdentifier) {
                itemProvider.loadItem(forTypeIdentifier: typeIdentifier, options: nil) { (item, error) in
                    if let error = error {
                        print("Error loading item of type \(typeIdentifier): \(error)")
                        self.close()
                        return
                    }
                    handler(itemProvider) { content in
                        DispatchQueue.main.async {
                            self.presentContent(typeIdentifier: typeIdentifier, content: content)
                        }
                    }
                }
                return
            }
        }
        
        close()
    }

    func close() {
        self.extensionContext?.completeRequest(returningItems: [], completionHandler: nil)
    }

    override func isContentValid() -> Bool {
        return true
    }
    
    private func saveToFirestore(data: [String: Any]) {
        var dataToSave = data
        if let userId = userId {
            dataToSave["userId"] = userId
        }

        dataToSave["createdAt"] = FieldValue.serverTimestamp()
        
        let db = Firestore.firestore()
        db.collection("sharedItems").addDocument(data: dataToSave) { error in
            if error != nil {
                self.close()
            } else {
                self.extensionContext?.completeRequest(returningItems: [], completionHandler: nil)
                self.close()
            }
        }
    }
    
    private func handleText(itemProvider: NSItemProvider, completion: @escaping (Any?) -> Void) {
        itemProvider.loadItem(forTypeIdentifier: UTType.plainText.identifier, options: nil) { (item, error) in
            if let error = error {
                print("Error loading text: \(error)")
                completion(nil)
            } else {
                completion(item as? String)
            }
        }
    }
    
    private func handleImage(itemProvider: NSItemProvider, completion: @escaping (Any?) -> Void) {
        itemProvider.loadItem(forTypeIdentifier: UTType.image.identifier, options: nil) { (item, error) in
            if let error = error {
                print("Error loading image: \(error)")
                completion(nil)
            } else {
                print("Loaded item type: \(type(of: item))")
                if let url = item as? URL {
                    completion(url)
                } else if let data = item as? Data {
                    completion(data) // You can convert Data to UIImage if needed
                } else if let image = item as? UIImage {
                    completion(image)
                } else {
                    print("Unexpected item type: \(String(describing: item))")
                    completion(nil)
                }
            }
        }
    }
    
    private func handleURL(itemProvider: NSItemProvider, completion: @escaping (Any?) -> Void) {
        itemProvider.loadItem(forTypeIdentifier: UTType.url.identifier, options: nil) { (item, error) in
            if let error = error {
                print("Error loading URL: \(error)")
                completion(nil)
            } else {
                completion(item as? URL)
            }
        }
    }
    
    private func handleVideo(itemProvider: NSItemProvider, completion: @escaping (Any?) -> Void) {
        itemProvider.loadItem(forTypeIdentifier: UTType.movie.identifier, options: nil) { (item, error) in
            if let error = error {
                print("Error loading video: \(error)")
                completion(nil)
            } else {
                print("Loaded item type: \(type(of: item))")
                if let url = item as? URL {
                    completion(url)
                } else if let data = item as? Data {
                    completion(data) // You can convert Data to URL or other media types
                } else {
                    print("Unexpected item type: \(String(describing: item))")
                    completion(nil)
                }
            }
        }
    }
    
    private func presentContent(typeIdentifier: String, content: Any?) {
        if self.userId == nil {
            self.userId = getAuthUidFromKeychain()
            self.isUserAuthenticated = true
        }
        
        var view: ShareExtensionView
        if self.isUserAuthenticated {
            switch typeIdentifier {
            case UTType.plainText.identifier:
                view = ShareExtensionView(contentType: .text(content as? String ?? ""), onSave: self.saveToFirestore, isUserAuthenticated: true, userId: self.userId ?? "")
            case UTType.image.identifier:
                view = ShareExtensionView(contentType: .image(content as? URL), onSave: self.saveToFirestore, isUserAuthenticated: true, userId: self.userId ?? "")
            case UTType.url.identifier:
                view = ShareExtensionView(contentType: .url(content as? URL), onSave: self.saveToFirestore, isUserAuthenticated: true, userId: self.userId ?? "")
            case UTType.movie.identifier:
                view = ShareExtensionView(contentType: .video(content as? URL), onSave: self.saveToFirestore, isUserAuthenticated: true, userId: self.userId ?? "")
            default:
                close()
                return
            }
        } else {
            view = ShareExtensionView(contentType: .text("User not authenticated"), onSave: self.saveToFirestore, isUserAuthenticated: false, userId: self.userId ?? "")
        }
        
        let contentView = UIHostingController(rootView: view)
        self.addChild(contentView)
        self.view.addSubview(contentView.view)
        
        // Set up constraints
        contentView.view.translatesAutoresizingMaskIntoConstraints = false
        contentView.view.topAnchor.constraint(equalTo: self.view.topAnchor).isActive = true
        contentView.view.bottomAnchor.constraint(equalTo: self.view.bottomAnchor).isActive = true
        contentView.view.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        contentView.view.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
    }
    
    func retrieveAuthStateAndReauthenticate() {
        // This moment token is user uid. I will implement proper authentication mechanism later
        guard let uid = getAuthUidFromKeychain() else {
            print("No auth token found")
            return
        }
        
        self.isUserAuthenticated = true
        self.userId = uid
    }
    
    func getAuthUidFromKeychain() -> String? {
        
        let key = "uid"
        
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecAttrAccessGroup as String: "group.io.sharely.app",
            kSecReturnData as String: kCFBooleanTrue!,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]

        var item: CFTypeRef?
        let status = SecItemCopyMatching(query as CFDictionary, &item)

        guard status == errSecSuccess else {
            print("Error fetching token from Keychain: \(status)")
            return nil
        }

        guard let data = item as? Data, let uid = String(data: data, encoding: .utf8) else {
            print("Error decoding token from Keychain data")
            return nil
        }
        
        return uid
    }
}

