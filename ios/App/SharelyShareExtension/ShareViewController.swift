import UIKit
import Social
import UniformTypeIdentifiers
import FirebaseCore
import FirebaseFirestore
import FirebaseStorage
import SwiftUI

class ShareViewController: SLComposeServiceViewController {

    private var isUserAuthenticated = false
    private var userId: String?
    private var pendingUploadFileURL: URL? // To hold image URL temporarily

    override func viewDidLoad() {
        super.viewDidLoad()
        resetExtensionState() // Clear state for a fresh start

        if FirebaseApp.app() == nil {
            FirebaseApp.configure() // Initialize Firebase if not already configured
            retrieveAuthStateAndReauthenticate() // Retrieve user authentication state
        }

        // Ensure access to extension items
        guard let extensionItems = extensionContext?.inputItems as? [NSExtensionItem] else {
            close() // Close if no input items
            return
        }

        // Process incoming content
        for extensionItem in extensionItems {
            for itemProvider in extensionItem.attachments ?? [] {
                handleIncomingContent(itemProvider: itemProvider) // Handle each attachment
                return
            }
        }

        close() // Close if no content was handled
    }

    private func resetExtensionState() {
        // Reset all states to ensure a clean session
        self.pendingUploadFileURL = nil
        self.userId = nil
        self.isUserAuthenticated = false
        self.view.subviews.forEach { $0.removeFromSuperview() } // Remove old views
    }

    func close() {
        // Complete the extension request
        self.extensionContext?.completeRequest(returningItems: [], completionHandler: nil)
    }

    override func isContentValid() -> Bool {
        return true // Always return true as no custom validation is required
    }

    private func uploadToFirebaseStorage(fileData: Data, fileName: String, contentType: String, completion: @escaping (Result<URL, Error>) -> Void) {
        // Upload file data to Firebase Storage
        let storageRef = Storage.storage().reference().child("uploads/\(fileName)")
        let metadata = StorageMetadata()
        metadata.contentType = contentType

        storageRef.putData(fileData, metadata: metadata) { _, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            storageRef.downloadURL { url, error in
                if let error = error {
                    completion(.failure(error))
                } else if let url = url {
                    completion(.success(url))
                }
            }
        }
    }

    private func handleIncomingContent(itemProvider: NSItemProvider) {
        // Define handlers for each content type
        let contentTypes: [String: (NSItemProvider, @escaping (Any?) -> Void) -> Void] = [
            UTType.plainText.identifier: handleText,
            UTType.image.identifier: handleImage,
            UTType.url.identifier: handleURL,
            UTType.movie.identifier: handleVideo
        ]

        for (typeIdentifier, handler) in contentTypes {
            if itemProvider.hasItemConformingToTypeIdentifier(typeIdentifier) {
                handler(itemProvider) { content in
                    DispatchQueue.main.async {
                        self.presentShareExtensionView(typeIdentifier: typeIdentifier, content: content) // Present UI
                    }
                }
                return
            }
        }
        close() // Close if no matching content type
    }

    private func handleText(itemProvider: NSItemProvider, completion: @escaping (Any?) -> Void) {
        // Handle plain text content
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
        // Handle image content
        itemProvider.loadItem(forTypeIdentifier: UTType.image.identifier, options: nil) { (item, error) in
            if let error = error {
                print("Error loading image: \(error)")
                completion(nil)
            } else if let url = item as? URL {
                self.pendingUploadFileURL = url // Store the file URL
                completion(url)
            } else if let imageData = item as? Data {
                let fileName = UUID().uuidString + ".jpg"
                self.uploadToFirebaseStorage(fileData: imageData, fileName: fileName, contentType: "image/jpeg") { result in
                    switch result {
                    case .success(let downloadURL):
                        completion(downloadURL)
                    case .failure(let error):
                        print("Error uploading image: \(error)")
                        completion(nil)
                    }
                }
            } else if let image = item as? UIImage {
                if let jpegData = image.jpegData(compressionQuality: 0.8) {
                    let fileName = UUID().uuidString + ".jpg"
                    self.uploadToFirebaseStorage(fileData: jpegData, fileName: fileName, contentType: "image/jpeg") { result in
                        switch result {
                        case .success(let downloadURL):
                            completion(downloadURL)
                        case .failure(let error):
                            print("Error uploading UIImage: \(error)")
                            completion(nil)
                        }
                    }
                } else {
                    print("Error converting UIImage to JPEG data")
                    completion(nil)
                }
            } else {
                print("Unexpected image type")
                completion(nil)
            }
        }
    }

    private func handleURL(itemProvider: NSItemProvider, completion: @escaping (Any?) -> Void) {
        // Handle URL content
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
        // Handle video content
        itemProvider.loadItem(forTypeIdentifier: UTType.movie.identifier, options: nil) { (item, error) in
            if let error = error {
                print("Error loading video: \(error)")
                completion(nil)
            } else if let url = item as? URL {
                do {
                    let data = try Data(contentsOf: url)
                    let fileName = UUID().uuidString + ".mp4"
                    self.uploadToFirebaseStorage(fileData: data, fileName: fileName, contentType: "video/mp4") { result in
                        switch result {
                        case .success(let downloadURL):
                            completion(downloadURL)
                        case .failure(let error):
                            print("Error uploading video: \(error)")
                            completion(nil)
                        }
                    }
                } catch {
                    print("Error loading video data: \(error)")
                    completion(nil)
                }
            } else {
                print("Unexpected item type")
                completion(nil)
            }
        }
    }

    private func presentShareExtensionView(typeIdentifier: String, content: Any?) {
        // Authenticate user if needed
        if self.userId == nil {
            self.userId = getAuthUidFromKeychain()
            self.isUserAuthenticated = true
        }

        guard let userId = userId else {
            print("User not authenticated")
            close()
            return
        }

        // Determine content type
        let contentType: ContentType
        switch typeIdentifier {
        case UTType.plainText.identifier:
            contentType = .text(content as? String ?? "")
        case UTType.image.identifier:
            if let fileURL = content as? URL {
                contentType = .image(fileURL)
            } else {
                contentType = .image(nil)
            }
        case UTType.url.identifier:
            contentType = .url(content as? URL)
        case UTType.movie.identifier:
            contentType = .video(content as? URL)
        default:
            close()
            return
        }

        // Present the ShareExtensionView
        let shareView = ShareExtensionView(
            contentType: contentType,
            onSave: { [weak self] data in
                self?.handleOnSave(data: data) // Handle save action
            },
            isUserAuthenticated: isUserAuthenticated,
            userId: userId
        )

        let hostingController = UIHostingController(rootView: shareView)
        addChild(hostingController)
        view.addSubview(hostingController.view)

        hostingController.view.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            hostingController.view.topAnchor.constraint(equalTo: view.topAnchor),
            hostingController.view.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            hostingController.view.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            hostingController.view.trailingAnchor.constraint(equalTo: view.trailingAnchor)
        ])
    }

    private func handleOnSave(data: [String: Any]) {
        // Save content to Firestore
        var updatedData = data
        if let fileURL = pendingUploadFileURL {
            do {
                let imageData = try Data(contentsOf: fileURL)
                let fileName = UUID().uuidString + ".jpg"
                uploadToFirebaseStorage(fileData: imageData, fileName: fileName, contentType: "image/jpeg") { result in
                    switch result {
                    case .success(let downloadURL):
                        updatedData["imageURL"] = downloadURL.absoluteString
                        self.saveToFirestore(data: updatedData)
                    case .failure(let error):
                        print("Error uploading image: \(error)")
                        self.close()
                    }
                }
            } catch {
                print("Error reading image data: \(error)")
                close()
            }
        } else {
            saveToFirestore(data: updatedData)
        }
    }

    private func saveToFirestore(data: [String: Any]) {
        // Save metadata to Firestore
        var dataToSave = data
        if let userId = userId {
            dataToSave["userId"] = userId
        }

        dataToSave["createdAt"] = FieldValue.serverTimestamp()

        let db = Firestore.firestore()
        db.collection("sharedItems").addDocument(data: dataToSave) { error in
            if let error = error {
                print("Error saving to Firestore: \(error)")
            }
            self.close()
        }
    }

    func retrieveAuthStateAndReauthenticate() {
        // Reauthenticate user using stored UID
        guard let uid = getAuthUidFromKeychain() else {
            print("No auth token found")
            return
        }
        self.isUserAuthenticated = true
        self.userId = uid
    }

    func getAuthUidFromKeychain() -> String? {
        // Retrieve UID from Keychain
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
