//
//  ShareExtensionView.swift
//  SharelyShareExtension
//
//  Created by Charith Dissanayaka on 2024-08-02.
//

import SwiftUI

enum ContentType {
    case text(String)
    case image(URL?)
    case url(URL?)
    case video(URL?)
}

struct ShareExtensionView: View {
    @State private var contentType: ContentType
    var onSave: ([String: Any]) -> Void
    var isUserAuthenticated: Bool
    
    init(contentType: ContentType, onSave: @escaping ([String: Any]) -> Void, isUserAuthenticated: Bool) {
        self._contentType = State(initialValue: contentType)
        self.onSave = onSave
        self.isUserAuthenticated = isUserAuthenticated
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            if !isUserAuthenticated {
                Text("User not authenticated")
                    .foregroundColor(.red)
                    .padding()
            }
            
            switch contentType {
            case .text(let text):
                TextField("Enter text here...", text: Binding(get: { text }, set: { self.contentType = .text($0) }))
                    .textFieldStyle(RoundedBorderTextFieldStyle())
            case .image(let url):
                if let url = url, let image = UIImage(contentsOfFile: url.path) {
                    Image(uiImage: image)
                        .resizable()
                        .scaledToFit()
                        .frame(height: 200)
                        .cornerRadius(10)
                        .padding(.top, 16)
                }
            case .url(let url):
                if let url = url {
                    if url.isImageURL {
                        if let imageData = try? Data(contentsOf: url), let image = UIImage(data: imageData) {
                            Image(uiImage: image)
                                .resizable()
                                .scaledToFit()
                                .frame(height: 200)
                                .cornerRadius(10)
                                .padding(.top, 16)
                        }
                    } else {
                        Text("URL: \(url.absoluteString)")
                            .font(.subheadline)
                            .padding(.top, 16)
                    }
                }
            case .video(let url):
                if let url = url {
                    Text("Video: \(url.lastPathComponent)")
                        .font(.subheadline)
                        .padding(.top, 16)
                }
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
                self.onSave(data)
            }) {
                Text("Save")
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(8)
            }
        }
        .padding()
    }
}

extension URL {
    var isImageURL: Bool {
        let imageExtensions = ["jpg", "jpeg", "png", "gif"]
        return imageExtensions.contains(self.pathExtension.lowercased())
    }
}

struct ShareExtensionView_Previews: PreviewProvider {
    static var previews: some View {
        ShareExtensionView(contentType: .text("example content"), onSave: { _ in }, isUserAuthenticated: true)
    }
}

//#Preview {
//    ShareExtensionView(contentType: <#ContentType#>, onSave: <#([String : Any]) -> Void#>, isUserAuthenticated: <#Bool#>)
//}
