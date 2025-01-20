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
    private var pendingUploadImageData: Data? // Temporarily store image data for upload
    private var pendingFileExtension: String? // Store file extension dynamically
    private var pendingContentType: String? // Store the content type dynamically

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
        self.pendingUploadImageData = nil
        self.pendingFileExtension = nil
        self.pendingContentType = nil
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

    private func handleIncomingContent(itemProvider: NSItemProvider) {
        // Define handlers for each content type
        let contentTypes: [String: (NSItemProvider, @escaping (Any?) -> Void) -> Void] = [
            UTType.plainText.identifier: handleText,
            UTType.image.identifier: handleImage,
            UTType.url.identifier: handleURL,
            UTType.movie.identifier: handleVideo,
            UTType.pdf.identifier: handlePDF
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
        pendingContentType = "text"
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
        pendingContentType = "image"
        itemProvider.loadItem(forTypeIdentifier: UTType.image.identifier, options: nil) { (item, error) in
            if let error = error {
                print("Error loading image: \(error)")
                completion(nil)
            } else if let url = item as? URL {
                do {
                    let imageData = try Data(contentsOf: url)
                    self.pendingUploadImageData = imageData // Temporarily store image data
                    self.pendingFileExtension = "jpg" // Default extension for images
                } catch {
                    print("Error reading image data from URL: \(error)")
                }
                completion(nil)
            } else if let image = item as? UIImage {
                if let jpegData = image.jpegData(compressionQuality: 0.8) {
                    self.pendingUploadImageData = jpegData // Temporarily store UIImage data
                    self.pendingFileExtension = "jpg" // Default extension for images
                } else {
                    print("Error converting UIImage to JPEG data")
                }
                completion(nil)
            } else {
                print("Unexpected image type")
                completion(nil)
            }
        }
    }

    private func handleURL(itemProvider: NSItemProvider, completion: @escaping (Any?) -> Void) {
        // Handle URL content
        pendingContentType = "url"
        itemProvider.loadItem(forTypeIdentifier: UTType.url.identifier, options: nil) { (item, error) in
            if let error = error {
                print("Error loading URL: \(error)")
                completion(nil)
            } else if let url = item as? URL {
                completion(url)
            } else {
                print("Unexpected URL type")
                completion(nil)
            }
        }
    }

    private func handleVideo(itemProvider: NSItemProvider, completion: @escaping (Any?) -> Void) {
        // Handle video content
        pendingContentType = "video"
        itemProvider.loadItem(forTypeIdentifier: UTType.movie.identifier, options: nil) { (item, error) in
            if let error = error {
                print("Error loading video: \(error)")
                completion(nil)
            } else if let url = item as? URL {
                do {
                    let data = try Data(contentsOf: url)
                    self.pendingUploadImageData = data // Store video data
                    self.pendingFileExtension = "mp4" // Set file extension for videos
                } catch {
                    print("Error loading video data: \(error)")
                }
                completion(nil)
            } else {
                print("Unexpected item type")
                completion(nil)
            }
        }
    }

    private func handlePDF(itemProvider: NSItemProvider, completion: @escaping (Any?) -> Void) {
        // Handle PDF content
        pendingContentType = "pdf"
        itemProvider.loadItem(forTypeIdentifier: UTType.pdf.identifier, options: nil) { (item, error) in
            if let error = error {
                print("Error loading PDF: \(error)")
                completion(nil)
            } else if let url = item as? URL {
                do {
                    let data = try Data(contentsOf: url)
                    self.pendingUploadImageData = data // Store PDF data
                    self.pendingFileExtension = "pdf" // Set file extension for PDFs
                } catch {
                    print("Error reading PDF data: \(error)")
                }
                completion(nil)
            } else {
                print("Unexpected PDF type")
                completion(nil)
            }
        }
    }

    private func uploadToFirebaseStorage(fileData: Data, fileName: String, contentType: String, completion: @escaping (Result<URL, Error>) -> Void) {
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
            contentType = .image(nil) // Image upload will be triggered on share button press
        case UTType.url.identifier:
            contentType = .url(content as? URL)
        case UTType.movie.identifier:
            contentType = .video(nil) // Video upload will be triggered on share button press
        case UTType.pdf.identifier:
            contentType = .text("PDF File") // Represent PDF as text placeholder for now
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
        if let fileData = pendingUploadImageData, let fileExtension = pendingFileExtension {
            let fileName = UUID().uuidString + ".\(fileExtension)"
            uploadToFirebaseStorage(fileData: fileData, fileName: fileName, contentType: determineContentType(for: fileExtension)) { result in
                switch result {
                case .success(let downloadURL):
                    updatedData["fileURL"] = downloadURL.absoluteString
                    updatedData["contentType"] = self.pendingContentType ?? "unknown"
                    self.saveToFirestore(data: updatedData)
                case .failure(let error):
                    print("Error uploading file: \(error)")
                    self.close()
                }
            }
        } else {
            updatedData["contentType"] = self.pendingContentType ?? "unknown"
            saveToFirestore(data: updatedData)
        }
    }

    private func determineContentType(for fileExtension: String) -> String {
        switch fileExtension {
        case "jpg", "jpeg": return "image/jpeg"
        case "mp4": return "video/mp4"
        case "pdf": return "application/pdf"
        default: return "application/octet-stream"
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
