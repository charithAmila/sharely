import SwiftUI

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
            .frame(width: 60, height: 60)
            .overlay(
                Circle()
                    .stroke(isSelected ? Color.white : Color.clear, lineWidth: 1)
            )

            Text(tag.name)
                .font(.caption)
                .foregroundColor(.primary)
                .lineLimit(1)
                .frame(width: 60)
                .multilineTextAlignment(.center)
        }
        .padding(5)
        .onTapGesture {
            onTap()
        }
    }
}
