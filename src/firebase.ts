// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  OAuthProvider,
  signInWithCredential,
  indexedDBLocalPersistence,
  initializeAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  deleteUser,
} from "firebase/auth";
import { FirebaseAnalytics } from "@capacitor-community/firebase-analytics";
import { Capacitor } from "@capacitor/core";

// Import environment variables
import {
  FIREBASE_API_KEY,
  FIREBASE_APP_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_MEASUREMENT_ID,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
} from "./utils/env";

// Firebase configuration
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: indexedDBLocalPersistence,
});

// Initialize Firebase Analytics if running on a native device
const initFirebaseAnalytics = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      await FirebaseAnalytics.initializeFirebase({
        ...firebaseConfig,
      });
      console.log("🔥 Firebase Analytics Initialized");
    } catch (error) {
      console.error("❌ Error initializing Firebase Analytics:", error);
    }
  } else {
    console.log("ℹ️ Firebase Analytics is only available on native platforms.");
  }
};

// Call the function to initialize Firebase Analytics
initFirebaseAnalytics();

export {
  app,
  db,
  auth,
  OAuthProvider,
  signInWithCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  deleteUser,
};
