// src/lib/firebase/client.ts
'use client';

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore';
import { getStorage, connectStorageEmulator, type FirebaseStorage } from 'firebase/storage';
import { getAnalytics, type Analytics } from 'firebase/analytics'; // Import Analytics

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// --- Service Initialization ---
let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let storage: FirebaseStorage;
let analytics: Analytics | null = null; // Initialize analytics as null
let firebaseInitialized = false;

// This flag prevents connecting to emulators multiple times on hot reloads
let emulatorsConnected = false;

// --- Initialization Logic ---
// We only want to run this code in the browser
if (typeof window !== 'undefined') {
  // Check if all required environment variables are present
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    try {
      // Initialize Firebase app only once
      app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      
      auth = getAuth(app);
      firestore = getFirestore(app);
      storage = getStorage(app);
      // Conditionally initialize Analytics only if measurementId is available
      if (firebaseConfig.measurementId) {
        analytics = getAnalytics(app);
      }
      
      firebaseInitialized = true;
      console.log("Firebase Client SDK initialized successfully.");

      // Connect to emulators in development mode
      const useEmulators = process.env.NODE_ENV === 'development';
      if (useEmulators && !emulatorsConnected) {
        console.log("Connecting to Firebase Emulators (Client)...");
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
        connectFirestoreEmulator(firestore, 'localhost', 8080);
        connectStorageEmulator(storage, 'localhost', 9199);
        emulatorsConnected = true;
      }
    } catch (error) {
      console.error("Firebase Client SDK initialization failed:", error);
    }
  } else {
    console.error("Firebase Client SDK Error: Critical configuration missing. Please ensure Firebase environment variables are set.");
  }
}

// --- Exports ---
// We export the initialized services and a flag to check if initialization was successful.
export { app, auth, firestore, storage, analytics, firebaseInitialized };
