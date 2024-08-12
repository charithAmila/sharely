import { db } from "../firebase";
import {
  DocumentData,
  DocumentSnapshot,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
export class FirebaseAbstract {
  private collection: string;
  constructor(collection: string) {
    this.collection = collection;
  }

  public create(data: any) {
    try {
      return addDoc(collection(db, this.collection), {
        ...data,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.log(error);
      throw new Error("Error creating document");
    }
  }

  public async update(data: any) {
    try {
      const document = doc(db, this.collection, data.id);
      return await updateDoc(document, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      throw new Error("Error updating document");
    }
  }

  /**
   * Delete a document
   * @param documentId String
   * @returns void
   */
  public async delete(documentId: string): Promise<void> {
    try {
      const document = doc(db, this.collection, documentId);
      return await deleteDoc(document);
    } catch (error) {
      throw new Error("Error deleting document");
    }
  }

  /**
   * Get all documents
   * @returns Array
   */
  public async all() {
    try {      
      const documents = collection(db, this.collection);
      return this.querySnapshotToArray(await getDocs(documents));
    } catch (error) {
      console.log('error', error);
      
      throw new Error("Error fetching documents");
    }
  }

  public async findByDocument(documentId: string): Promise<DocumentSnapshot<DocumentData> | null> {
    try {
      const document = doc(db, this.collection, documentId);
      const docSnap: DocumentSnapshot<DocumentData> = await getDoc(document);
      if (docSnap.exists()) {
        return docSnap;
      }
      return null;
    } catch (error) {
      throw new Error("Error fetching document");
    }
  }

  public async findByField(field: string, value: string) {
    try {
      const _query = query(collection(db, this.collection), where(field, "==", value));
      const querySnapshot = await getDocs(_query);
      return this.querySnapshotToArray(querySnapshot);
    } catch (error) {
      throw new Error("Error fetching document");
    }
  }

  /**
   * Set a document
   * @param documentId String
   * @param data any
   */
  public async setDoc(documentId: string, data: any) {
    try {
      const document = doc(db, this.collection, documentId);
      return await setDoc(document, data);
    } catch (error) {
      throw new Error("Error setting document");
    }
  }

  public async onDocumentChange(userId: string ,callback: any) {
    const q = query(collection(db, this.collection), where("userId", "==", userId), orderBy("createdAt", "desc"));
    return onSnapshot(q, (querySnapshot) => {
      const dataArray = this.querySnapshotToArray(querySnapshot);
      callback(dataArray);
    });
  }

  private querySnapshotToArray(querySnapshot: any) {
    const dataArray: any[] = [];
    querySnapshot.forEach((doc: any) => {
      
      const { createdAt, updatedAt } = doc.data();
   
      dataArray.push({
        ...doc.data(),
        createdAt: !createdAt ? null : createdAt?.toDate().toString(),
        updatedAt: !updatedAt ? null : updatedAt?.toDate().toString(),
        id: doc.id,
      });
    });
    return dataArray;
  }
}