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
                    if error != nil {
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
            completion(item as? String)
        }
    }
    
    private func handleImage(itemProvider: NSItemProvider, completion: @escaping (Any?) -> Void) {
        itemProvider.loadItem(forTypeIdentifier: UTType.image.identifier, options: nil) { (item, error) in
            if let url = item as? URL {
                completion(url)
            } else {
                completion(nil)
            }
        }
    }
    
    private func handleURL(itemProvider: NSItemProvider, completion: @escaping (Any?) -> Void) {
        itemProvider.loadItem(forTypeIdentifier: UTType.url.identifier, options: nil) { (item, error) in
            completion(item as? URL)
        }
    }
    
    private func handleVideo(itemProvider: NSItemProvider, completion: @escaping (Any?) -> Void) {
        itemProvider.loadItem(forTypeIdentifier: UTType.movie.identifier, options: nil) { (item, error) in
            if let url = item as? URL {
                completion(url)
            } else {
                completion(nil)
            }
        }
    }
    
    private func presentContent(typeIdentifier: String, content: Any?) {
        var view: ShareExtensionView
        if isUserAuthenticated {
            switch typeIdentifier {
            case UTType.plainText.identifier:
                view = ShareExtensionView(contentType: .text(content as? String ?? ""), onSave: self.saveToFirestore, isUserAuthenticated: true)
            case UTType.image.identifier:
                view = ShareExtensionView(contentType: .image(content as? URL), onSave: self.saveToFirestore, isUserAuthenticated: true)
            case UTType.url.identifier:
                view = ShareExtensionView(contentType: .url(content as? URL), onSave: self.saveToFirestore, isUserAuthenticated: true)
            case UTType.movie.identifier:
                view = ShareExtensionView(contentType: .video(content as? URL), onSave: self.saveToFirestore, isUserAuthenticated: true)
            default:
                close()
                return
            }
        } else {
            view = ShareExtensionView(contentType: .text("User not authenticated"), onSave: self.saveToFirestore, isUserAuthenticated: false)
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
        guard let token = getAuthTokenFromKeychain() else {
            print("No auth token found")
            return
        }

        print("Token for re-authentication: \(token)")

        Auth.auth().signIn(withCustomToken: token) { (authResult, error) in
            if let error = error {
                print("Error re-authenticating: \(error)")
                self.isUserAuthenticated = false
                return
            }
            self.isUserAuthenticated = true
            self.userId = authResult?.user.uid
            print("Successfully re-authenticated")
        }
    }
    
    func getAuthTokenFromKeychain() -> String? {
        
        let key = "firebaseAuthToken"
        
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

        guard let data = item as? Data, let token = String(data: data, encoding: .utf8) else {
            print("Error decoding token from Keychain data")
            return nil
        }
        
        return token
    }
}
