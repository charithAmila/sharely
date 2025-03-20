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
    @State private var isFreeTagLimitExceeded = false
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
                        // 🔹 "Add New" Button
                        Button(action: {
                            checkMaxTagLimitBeforeShowingAlert()
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
                                onConfirm: addNewTag,
                                isFreeTagLimitExceeded: $isFreeTagLimitExceeded
                                // existingTags: viewModel.tags.map { $0.name }
                            )
                        )

                        // 🔹 Show the most recently created tags
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

    /// 🔹 Filters tags based on search text
    private var filteredTags: [UserTag] {
        if searchText.isEmpty {
            return viewModel.tags
        } else {
            return viewModel.tags.filter { $0.name.lowercased().contains(searchText.lowercased()) }
        }
    }

    /// 🔹 Checks tag limit before showing the alert
    private func checkMaxTagLimitBeforeShowingAlert() {
        let currentTagCount = viewModel.tags.count
        
        checkUserMaxTagLimitExceeded(currentTagCount: currentTagCount) { isExceeded in
            DispatchQueue.main.async {
                self.isFreeTagLimitExceeded = isExceeded
                self.showAlert = true
            }
        }
    }

    /// ✅ Determines if the user has exceeded the max tag limit
    private func checkUserMaxTagLimitExceeded(currentTagCount: Int, completion: @escaping (Bool) -> Void) {
        guard let userId = userId else {
            print("❌ User ID not found")
            completion(false)
            return
        }

        let userRef = Firestore.firestore().collection("users").document(userId)

        userRef.getDocument { (document, error) in
            if let error = error {
                print("❌ Error fetching user data: \(error)")
                completion(false)
                return
            }

            guard let document = document, document.exists, let userData = document.data() else {
                print("❌ No user data found")
                completion(false)
                return
            }

            let userType = userData["userType"] as? String ?? "FREE"

            if userType == "PRO" {
                completion(false)
                return
            }

            if let userMaxTagCount = userData["maxTagCount"] as? Int {
                completion(currentTagCount >= userMaxTagCount)
                return
            }

            let settingsRef = Firestore.firestore().collection("settings").document("v-1")

            settingsRef.getDocument { (settingsDocument, settingsError) in
                if let settingsError = settingsError {
                    print("❌ Error fetching settings data: \(settingsError)")
                    completion(false)
                    return
                }

                guard let settingsData = settingsDocument?.data(),
                      let defaultMaxTagCount = settingsData["maxTagCount"] as? Int else {
                    completion(currentTagCount >= 5)
                    return
                }

                completion(currentTagCount >= defaultMaxTagCount)
            }
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


    /// 🔹 Adds a new tag
    private func addNewTag() {
        guard !newTagName.isEmpty else { return }

        viewModel.createTag(name: newTagName) { success, newTagId in
            if success, let newTagId = newTagId {
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                    self.viewModel.fetchTags {
                        if let newTag = self.viewModel.tags.first(where: { $0.id == newTagId }) {
                            self.selectedTags.append(newTag)
                        }
                        self.newTagName = ""
                    }
                }
            }
        }
    }
}
