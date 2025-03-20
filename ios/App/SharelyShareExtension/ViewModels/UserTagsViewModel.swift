import Foundation
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
    
    func fetchTags() {
        db.collection("tags").whereField("userId", isEqualTo: userId).getDocuments { (querySnapshot, error) in
            guard let documents = querySnapshot?.documents else {
                print("No documents")
                self.tags = []
                return
            }
            
            self.tags = documents.map { docSnapshot -> UserTag in
                let data = docSnapshot.data()
                let name = data["name"] as? String ?? "Untitled"
                return UserTag(id: docSnapshot.documentID, name: name)
            }
        }
    }
    
    func createTag(name: String, completion: @escaping (Bool) -> Void) {
        let newTagRef = db.collection("tags").document()
        let tagData: [String: Any] = [
            "id": newTagRef.documentID,
            "name": name,
            "userId": userId
        ]
        
        newTagRef.setData(tagData) { error in
            if let error = error {
                print("Error adding tag: \(error)")
                completion(false)
            } else {
                print("Tag added successfully")
                self.fetchTags() // Refresh tag list
                completion(true)
            }
        }
    }
}
