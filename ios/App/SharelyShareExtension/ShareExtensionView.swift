import SwiftUI
import FirebaseFirestore
import UIKit

enum ContentType {
    case text(String)
    case image(URL?)
    case url(URL?)
    case video(URL?)
}

struct ShareExtensionView: View {
    @State private var contentType: ContentType
    @ObservedObject var viewModel: UserTagsViewModel
    @State private var searchText = ""
    @State private var selectedTags: [UserTag] = []

    @State private var showAlert = false
    @State private var newTagName = ""

    var onSave: ([String: Any]) -> Void
    var isUserAuthenticated: Bool
    var userId: String?

    init(contentType: ContentType, onSave: @escaping ([String: Any]) -> Void, isUserAuthenticated: Bool, userId: String) {
        self.onSave = onSave
        self.isUserAuthenticated = isUserAuthenticated
        self.userId = userId
        self._contentType = State(initialValue: contentType)
        self.viewModel = UserTagsViewModel(userId: userId)
    }
    
    var body: some View {
        VStack {
            if !isUserAuthenticated {
                Text("User not authenticated")
                    .foregroundColor(.red)
                    .padding()
            } else {
                SearchBar(text: $searchText)

                ScrollView {
                    LazyVGrid(columns: [GridItem(.adaptive(minimum: 80))], spacing: 10) {
                        // 🔹 "Add New" Button as First Item
                        Button(action: {
                            showAlert.toggle()
                        }) {
                            VStack {
                                ZStack {
                                    Circle()
                                        .fill(Color.blue.opacity(0.8))
                                        .frame(width: 60, height: 60)

                                    Image(systemName: "plus")
                                        .font(.system(size: 24, weight: .bold))
                                        .foregroundColor(.white)
                                }
                                Text("Add New")
                                    .font(.caption)
                                    .foregroundColor(.primary)
                            }
                        }
                        .padding()
                        .background(
                            CustomAlert(
                                isPresented: $showAlert,
                                text: $newTagName,
                                onConfirm: addNewTag
                            )
                        )

                        // 🔹 Show the most recently created tag right after "Add New"
                        ForEach(filteredTags, id: \.id) { tag in
                            TagView(tag: tag, isSelected: selectedTags.contains(where: { $0.id == tag.id })) {
                                toggleTagSelection(tag)
                            }
                        }
                    }
                    .padding()
                }

                Button(action: saveContent) {
                    Text("Share")
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(8)
                }
                .padding()
            }
        }
        .padding()
        .onAppear {
            viewModel.fetchTags()
        }
    }

    /// 🔹 Keeps the recently created tag at the top after "Add New"
    private var recentlyCreatedTags: [UserTag] {
        return Array(viewModel.tags.prefix(1)).filter { tag in selectedTags.contains(where: { $0.id == tag.id }) }
    }

    /// 🔹 Filters tags based on search text
    private var filteredTags: [UserTag] {
        if searchText.isEmpty {
            return viewModel.tags
        } else {
            return viewModel.tags.filter { $0.name.lowercased().contains(searchText.lowercased()) }
        }
    }

    /// 🔹 Toggles selection state of a tag
    private func toggleTagSelection(_ tag: UserTag) {
        if let index = selectedTags.firstIndex(where: { $0.id == tag.id }) {
            selectedTags.remove(at: index)
        } else {
            selectedTags.append(tag)
        }
    }

    /// 🔹 Saves selected content and tags
    private func saveContent() {
        var data: [String: Any] = [:]

        switch contentType {
        case .text(let text):
            data["content"] = text
        case .image(let url):
            if let url = url { data["imagePath"] = url.path }
        case .url(let url):
            if let url = url { data["url"] = url.absoluteString }
        case .video(let url):
            if let url = url { data["videoPath"] = url.path }
        }

        data["tags"] = selectedTags.map { $0.id }
        onSave(data)
    }

    /// 🔹 Adds a new tag and selects it automatically
   private func addNewTag() {
        guard !newTagName.isEmpty else { return }

        viewModel.createTag(name: newTagName) { success, newTagId in
            if success, let newTagId = newTagId {
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                    self.viewModel.fetchTags {
                        // Ensure we fetch the latest tags before selecting
                        if let newTag = self.viewModel.tags.first(where: { $0.id == newTagId }) {
                            self.selectedTags.append(newTag) // ✅ Auto-select the new tag
                            print("✅ Auto-selected new tag:", newTag.name)
                        }
                        self.newTagName = ""
                    }
                }
            }
        }
    }
}

// ✅ Custom Search Bar
struct SearchBar: View {
    @Binding var text: String

    var body: some View {
        HStack {
            TextField("Search tags", text: $text)
                .padding(10)
                .background(Color(.systemGray6))
                .cornerRadius(8)
                .padding(.horizontal, 10)
                .frame(height: 40)
        }
        .padding(.top, 10)
    }
}


// ✅ Custom Alert using UIKit (works on iOS 14+)
struct CustomAlert: UIViewControllerRepresentable {
    @Binding var isPresented: Bool
    @Binding var text: String
    var onConfirm: () -> Void

    func makeUIViewController(context: Context) -> UIViewController {
        return UIViewController() // Acts as a bridge
    }

    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {
        guard isPresented else { return }

        let alertController = UIAlertController(title: "Create New Tag", message: "Type the new tag name below", preferredStyle: .alert)
        
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

        DispatchQueue.main.async {
            uiViewController.present(alertController, animated: true, completion: nil)
        }
    }
}

struct TagView: View {
    let tag: UserTag
    let isSelected: Bool
    let onTap: () -> Void

    var body: some View {
        VStack {
            ZStack {
                Circle()
                    .fill(isSelected ? Color.blue : Color.gray) // Keep size consistent
                    .frame(width: 60, height: 60) // ✅ Ensure fixed size
                
                Text(tag.name.prefix(1))
                    .foregroundColor(.white)
                    .font(.system(size: 24, weight: .bold))
            }
            .frame(width: 60, height: 60) // ✅ Prevent expansion
            .overlay(
                Circle()
                    .stroke(isSelected ? Color.white : Color.clear, lineWidth: 1) // ✅ Optional border for selection
            )

            Text(tag.name)
                .font(.caption)
                .foregroundColor(.primary)
                .lineLimit(1) // ✅ Prevents text from taking extra space
                .frame(width: 60) // ✅ Keeps text width constant
                .multilineTextAlignment(.center)
        }
        .padding(5) // ✅ Consistent padding to avoid layout shifts
        .onTapGesture {
            onTap()
        }
    }
}

