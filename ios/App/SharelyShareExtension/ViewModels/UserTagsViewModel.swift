import FirebaseFirestore
import Combine

class UserTagsViewModel: ObservableObject {
    @Published var tags: [UserTag] = []
    private var db = Firestore.firestore()
    private var userId: String

    init(userId: String) {
        self.userId = userId
        fetchTags()
    }

    func fetchTags(completion: (() -> Void)? = nil) {
        db.collection("tags")
            .whereField("userId", isEqualTo: userId)
            .order(by: "createdAt", descending: true) // ✅ Get newest tags first
            .getDocuments { (querySnapshot, error) in
                guard let documents = querySnapshot?.documents else {
                    print("❌ No documents found")
                    return
                }

                DispatchQueue.main.async {
                    self.tags = documents.map { docSnapshot -> UserTag in
                        let data = docSnapshot.data()
                        let name = data["name"] as? String ?? "Untitled"
                        let createdAt = (data["createdAt"] as? Timestamp)?.dateValue() ?? Date.distantPast
                        let id = docSnapshot.documentID
                        return UserTag(id: id, name: name, createdAt: createdAt)
                    }
                    print("✅ Tags updated:", self.tags.map { $0.name })
                    
                    completion?() // ✅ Callback to ensure tags are updated before selecting
                }
            }
    }


    /// 🔹 Ensure `createTag` Exists
    func createTag(name: String, completion: @escaping (Bool, String?) -> Void) {
        let newTagRef = db.collection("tags").document() // ✅ Generate Firestore ID
        let newTagId = newTagRef.documentID

        let tagData: [String: Any] = [
            "name": name,
            "userId": userId,
            "createdAt": FieldValue.serverTimestamp()
        ]

        newTagRef.setData(tagData) { error in
            if let error = error {
                print("❌ Error adding tag:", error)
                completion(false, nil)
            } else {
                print("✅ Tag added successfully:", name)
                completion(true, newTagId) // ✅ Return Firestore ID
            }
        }
    }

}
