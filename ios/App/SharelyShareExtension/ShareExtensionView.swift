import SwiftUI

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
                        ForEach(filteredTags, id: \.id) { tag in
                            TagView(tag: tag, isSelected: selectedTags.contains(where: { $0.id == tag.id })) {
                                if selectedTags.contains(where: { $0.id == tag.id }) {
                                    selectedTags.removeAll(where: { $0.id == tag.id })
                                } else {
                                    selectedTags.append(tag)
                                }
                            }
                        }
                    }
                    .padding()
                }
                
                Button(action: {
                    var data: [String: Any] = [:]
                    switch self.contentType {
                        case .text(let text):
                            data["content"] = text
                        case .image(let url):
                            if let url = url {
                                data["imagePath"] = url.path
                            }
                        case .url(let url):
                            if let url = url {
                                data["url"] = url.absoluteString
                            }
                        case .video(let url):
                            if let url = url {
                                data["videoPath"] = url.path
                            }
                    }
                    data["tags"] = selectedTags.map { ["name": $0.name, "id": $0.id] }
                    self.onSave(data)
                }) {
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
    
    struct TagView: View {
        let tag: UserTag
        let isSelected: Bool
        let onTap: () -> Void
        
        var body: some View {
            VStack {
                ZStack {
                    Circle()
                        .fill(isSelected ? Color.blue : Color.gray)
                        .frame(width: 60, height: 60)
                    
                    Text(tag.name.prefix(1))
                        .foregroundColor(.white)
                        .font(.system(size: 24, weight: .bold))
                }
                Text(tag.name)
                    .font(.caption)
                    .foregroundColor(.primary)
            }
            .padding()
            .onTapGesture {
                onTap()
            }
        }
    }

    struct SearchBar: View {
        @Binding var text: String

        var body: some View {
            HStack {
                CustomTextField(text: $text, placeholder: "Search tags")
                    .padding(7)
                    .background(Color(.systemGray6))
                    .cornerRadius(8)
                    .padding(.horizontal, 10)
                    .frame(height: 40) // Set a specific height
            }
            .padding(.top, 10)
        }
    }

    struct CustomTextField: UIViewRepresentable {
        @Binding var text: String
        var placeholder: String

        class Coordinator: NSObject, UITextFieldDelegate {
            @Binding var text: String

            init(text: Binding<String>) {
                _text = text
            }

            func textFieldDidChangeSelection(_ textField: UITextField) {
                text = textField.text ?? ""
            }
        }

        func makeCoordinator() -> Coordinator {
            return Coordinator(text: $text)
        }

        func makeUIView(context: Context) -> UITextField {
            let textField = UITextField()
            textField.placeholder = placeholder
            textField.delegate = context.coordinator
            textField.returnKeyType = .done
            
            // Set the size constraints
            textField.translatesAutoresizingMaskIntoConstraints = false
            NSLayoutConstraint.activate([
                textField.heightAnchor.constraint(equalToConstant: 40) // Set a specific height
            ])
            
            return textField
        }

        func updateUIView(_ uiView: UITextField, context: Context) {
            uiView.text = text
        }
    }
    
    var filteredTags: [UserTag] {
        if searchText.isEmpty {
            return viewModel.tags
        } else {
            return viewModel.tags.filter { $0.name.lowercased().contains(searchText.lowercased()) }
        }
    }
}
