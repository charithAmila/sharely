import SwiftUI

struct EmptyView: View {
    @Environment(\.openURL) var openURL // 👈 this is the SwiftUI-native way
    
    let close: () -> Void

    var body: some View {
        VStack {
            Spacer()

            VStack(spacing: 16) {
                Text("You are not logged in")
                    .font(.title2)
                    .fontWeight(.semibold)
                    .multilineTextAlignment(.center)

                Text("Please log in to continue.")
                    .font(.body)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)

                Button(action: {
                    if let url = URL(string: "sharely://login") {
                        openURL(url) // 👈 this opens your app if installed
                        // Add 2 seconds to close the share extension
                        DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                            close()
                        }
                        
                    }
                }) {
                    Text("Log In")
                        .fontWeight(.bold)
                        .padding()
                        .frame(maxWidth: .infinity)
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(10)
                }
                .padding(.top, 8)
            }
            .padding()
            .background(Color(.systemBackground).opacity(0.95))
            .cornerRadius(16)
            .shadow(radius: 10)
            .padding(.horizontal, 24)

            Spacer()
        }
        .background(Color.black.opacity(0.5).edgesIgnoringSafeArea(.all))
    }
}
