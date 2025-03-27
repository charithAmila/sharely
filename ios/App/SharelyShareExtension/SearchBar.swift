import SwiftUI

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
