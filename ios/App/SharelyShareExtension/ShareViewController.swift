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
import SwiftUI


class ShareViewController: SLComposeServiceViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        if FirebaseApp.app() == nil {
            FirebaseApp.configure()
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
        let db = Firestore.firestore()
        db.collection("sharedItems").addDocument(data: data) { error in
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
        switch typeIdentifier {
        case UTType.plainText.identifier:
            view = ShareExtensionView(contentType: .text(content as? String ?? ""), onSave: self.saveToFirestore)
        case UTType.image.identifier:
            view = ShareExtensionView(contentType: .image(content as? URL), onSave: self.saveToFirestore)
        case UTType.url.identifier:
            view = ShareExtensionView(contentType: .url(content as? URL), onSave: self.saveToFirestore)
        case UTType.movie.identifier:
            view = ShareExtensionView(contentType: .video(content as? URL), onSave: self.saveToFirestore)
        default:
            close()
            return
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
}
