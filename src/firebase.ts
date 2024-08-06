// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { OAuthProvider, signInWithCredential, getAuth, UserCredential, indexedDBLocalPersistence, initializeAuth, signInWithCustomToken } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDs4DSPZfhBb85zA7GwU5hJZeYZ91cULSY",
  authDomain: "snap-link-424d4.firebaseapp.com",
  projectId: "snap-link-424d4",
  storageBucket: "snap-link-424d4.appspot.com",
  messagingSenderId: "427879207334",
  appId: "1:427879207334:web:5eba226e877e5c37afff67",
  measurementId: "G-W2E6WYRSVL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
    persistence: indexedDBLocalPersistence,
});

const appleSignIn = async (idToken:string): Promise<UserCredential> => {
    const provider = new OAuthProvider('apple.com');
    const credential = provider.credential({idToken})
    return await signInWithCredential(auth, credential)
}

const signInWithToken = async (token:string) => {
    signInWithCustomToken(auth,token)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
        console.log('+++ user',user);
        
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('Error message',errorMessage );
        
      });
}

export { app, db, auth, appleSignIn, signInWithToken}