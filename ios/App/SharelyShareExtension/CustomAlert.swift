import SwiftUI
import UIKit

struct CustomAlert: UIViewControllerRepresentable {
    @Binding var isPresented: Bool
    @Binding var text: String
    var onConfirm: () -> Void
    @Binding var isFreeTagLimitExceeded: Bool

    func makeUIViewController(context: Context) -> UIViewController {
        return UIViewController()
    }

    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {
        guard isPresented else { return }

        let alertController: UIAlertController

        if isFreeTagLimitExceeded {
            alertController = UIAlertController(
                title: "Limit Exceeded",
                message: "Your free tag limit is exceeded.",
                preferredStyle: .alert
            )
            alertController.addAction(UIAlertAction(title: "OK", style: .default) { _ in
                isPresented = false
            })
        } else {
            alertController = UIAlertController(
                title: "Create New Tag",
                message: "Type the new tag name below",
                preferredStyle: .alert
            )

            alertController.addTextField { textField in
                textField.placeholder = "Enter tag name"
                textField.text = text
            }

            alertController.addAction(UIAlertAction(title: "Cancel", style: .cancel) { _ in
                isPresented = false
            })

            alertController.addAction(UIAlertAction(title: "Add", style: .default) { _ in
                if let inputText = alertController.textFields?.first?.text, !inputText.isEmpty {
                    text = inputText
                    onConfirm()
                }
                isPresented = false
            })
        }

        DispatchQueue.main.async {
            uiViewController.present(alertController, animated: true, completion: nil)
        }
    }
}
