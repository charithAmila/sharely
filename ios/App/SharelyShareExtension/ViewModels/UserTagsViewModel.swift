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
        db.collection("users").document(userId).collection("tags").getDocuments { (querySnapshot, error) in
            guard let documents = querySnapshot?.documents else {
                print("No documents")
                self.tags = [UserTag(id: "untitled", name: "Untitled")]
                return
            }
            
            self.tags = documents.map { docSnapshot -> UserTag in
                let data = docSnapshot.data()
                let name = data["name"] as? String ?? "Untitled"
                return UserTag(id: docSnapshot.documentID, name: name)
            }
            
            if self.tags.isEmpty {
                self.tags = [UserTag(id: "untitled", name: "Untitled")]
            }
        }
    }
}
