import SwiftUI
import UIKit

struct CustomAlert: UIViewControllerRepresentable {
    @Binding var isPresented: Bool
    @Binding var text: String
    var onConfirm: () -> Void
    @Binding var isFreeTagLimitExceeded: Bool
    var existingTags: [String]  // Pass list of existing tag names

    func makeUIViewController(context: Context) -> UIViewController {
        return UIViewController()
    }

    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {
        guard isPresented else { return }

        let alertController: UIAlertController

        if isFreeTagLimitExceeded {
            // 🔴 Prevents tag creation if the limit is exceeded
            alertController = UIAlertController(
                title: "Limit Exceeded",
                message: "Your free tag limit has been reached.",
                preferredStyle: .alert
            )
            alertController.addAction(UIAlertAction(title: "OK", style: .default) { _ in
                isPresented = false
            })
        } else {
            alertController = UIAlertController(
                title: "Create New Tag",
                message: nil, // No message initially
                preferredStyle: .alert
            )

            alertController.addTextField { textField in
                textField.placeholder = "Enter tag name"
                textField.text = text
                textField.addTarget(context.coordinator, action: #selector(Coordinator.textChanged(_:)), for: .editingChanged)
            }

            let cancelAction = UIAlertAction(title: "Cancel", style: .cancel) { _ in
                isPresented = false
            }
            alertController.addAction(cancelAction)

            let addAction = UIAlertAction(title: "Add", style: .default) { _ in
                if let inputText = alertController.textFields?.first?.text?.trimmingCharacters(in: .whitespacesAndNewlines),
                   !inputText.isEmpty {
                    text = inputText
                    onConfirm()
                }
                isPresented = false
            }
            addAction.isEnabled = false
            alertController.addAction(addAction)

            context.coordinator.alertController = alertController
            context.coordinator.existingTags = existingTags // ✅ Update Coordinator's copy
        }

        DispatchQueue.main.async {
            uiViewController.present(alertController, animated: true, completion: nil)
        }
    }

    func makeCoordinator() -> Coordinator {
        return Coordinator(self)
    }

    class Coordinator: NSObject {
        var parent: CustomAlert
        weak var alertController: UIAlertController?
        var existingTags: [String] = [] // ✅ Store a copy of existing tags

        init(_ parent: CustomAlert) {
            self.parent = parent
        }

        @objc func textChanged(_ textField: UITextField) {
            let inputText = textField.text?.trimmingCharacters(in: .whitespacesAndNewlines).lowercased() ?? ""
            let addAction = alertController?.actions.last // Get the "Add" button

            // 🔹 Fetch the latest existingTags (Previously, this was empty)
            let existingTagSet = Set(existingTags.map { $0.trimmingCharacters(in: .whitespacesAndNewlines).lowercased() })

            if inputText.isEmpty {
                alertController?.message = "Type the new tag name below"
                addAction?.isEnabled = false
            } else if existingTagSet.contains(inputText) {
                alertController?.message = "❌ This tag name already exists"
                addAction?.isEnabled = false
            } else {
                alertController?.message = "✅ Tag name is available"
                addAction?.isEnabled = true
            }
        }
    }
}
