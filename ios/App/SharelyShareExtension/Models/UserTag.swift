import Foundation
import FirebaseFirestore // ✅ Correct import for Timestamp

struct UserTag: Identifiable {
    let id: String
    let name: String
    let createdAt: Date

    init(id: String, name: String, createdAt: Date = Date()) {
        self.id = id
        self.name = name
        self.createdAt = createdAt
    }

    init(document: DocumentSnapshot) {
        self.id = document.documentID
        self.name = document["name"] as? String ?? ""
        self.createdAt = (document["createdAt"] as? Timestamp)?.dateValue() ?? Date.distantPast // ✅ Uses correct Timestamp
    }
}
