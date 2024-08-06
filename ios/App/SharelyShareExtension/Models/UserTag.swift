import Foundation
import FirebaseFirestoreInternal

struct UserTag: Identifiable {
    let id: String
       let name: String
       
       init(id: String, name: String) {
           self.id = id
           self.name = name
       }
       
       init(document: DocumentSnapshot) {
           self.id = document.documentID
           self.name = document["name"] as? String ?? ""
       }
}
