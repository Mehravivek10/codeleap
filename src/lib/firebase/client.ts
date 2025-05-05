// src/lib/firebase/client.ts
'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { getStorage, connectStorageEmulator, FirebaseStorage } from 'firebase/storage';

// --- Environment Variable Check ---
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0 && typeof window !== 'undefined') {
  const errorMsg = `Firebase Client SDK Error: Missing required environment variables: ${missingEnvVars.join(', ')}. Please ensure these are set in your deployment environment (e.g., Vercel).`;
  console.error(errorMsg);
  // Optionally, throw an error or display a message to the user
  // For now, we log the error, and initialization might fail later.
  // Consider adding a visible error state in your app layout if this occurs.
}
// --- End Environment Variable Check ---


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let storage: FirebaseStorage;

// State to track emulator connection status
let emulatorsConnected = false;

// Check if window is defined (runs only in browser)
if (typeof window !== 'undefined') {
  // Initialize Firebase for Client Side Rendering (CSR) only if config seems valid
  if (missingEnvVars.length === 0) {
    try {
       app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
       auth = getAuth(app);
       firestore = getFirestore(app);
       storage = getStorage(app);
       console.log("Firebase Client SDK initialized successfully.");
    } catch (initError: any) {
         console.error("Firebase Client SDK initialization failed:", initError);
         // Assign placeholder objects to prevent downstream errors if initialization fails
         app = {} as FirebaseApp;
         auth = {} as Auth;
         firestore = {} as Firestore;
         storage = {} as FirebaseStorage;
    }


    // Connect to emulators if running in development environment (client-side)
    // Check if NEXT_PUBLIC_USE_EMULATORS is set, or default to NODE_ENV check
    // Ensure app was initialized before trying to connect emulators
    const useEmulators = (process.env.NEXT_PUBLIC_USE_EMULATORS === 'true' || process.env.NODE_ENV === 'development') && app?.name;

    if (useEmulators && !emulatorsConnected) {
        console.log("Connecting to Firebase Emulators (Client)...");
        try {
            // Connect Auth Emulator
            connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
            console.log('Auth Emulator connected (client) at http://localhost:9099');

            // Connect Firestore Emulator
            connectFirestoreEmulator(firestore, 'localhost', 8080);
            console.log('Firestore Emulator connected (client) at localhost:8080');

            // Connect Storage Emulator
            connectStorageEmulator(storage, "localhost", 9199);
            console.log('Storage Emulator connected (client) at localhost:9199');

            emulatorsConnected = true; // Mark as connected

        } catch (error: any) {
             // Log errors but don't necessarily block app load
             // Errors might occur if trying to connect again (e.g., during HMR)
             if (error.code?.includes('already-connected')) {
                 console.warn(`Firebase Emulators already connected (client): ${error.message}`);
                 emulatorsConnected = true; // Assume already connected if error indicates it
             } else {
                console.error(`Error connecting client to Firebase Emulators: ${error.message}.`);
             }
        }
    } else if (!useEmulators && app?.name) { // Check if app was initialized
         console.log("Connecting to production Firebase services (Client).");
    }
  } else {
      console.error("Firebase Client SDK: Skipping initialization due to missing environment variables.");
      // Assign placeholder objects if env vars are missing
      app = {} as FirebaseApp;
      auth = {} as Auth;
      firestore = {} as Firestore;
      storage = {} as FirebaseStorage;
  }

} else {
    // Handle Server-Side Rendering (SSR) or Server Components context if needed
    // Assign placeholder objects for server context
    console.log("Firebase Client SDK: Not initializing on server.");
    app = {} as FirebaseApp;
    auth = {} as Auth;
    firestore = {} as Firestore;
    storage = {} as FirebaseStorage;
}

// Export the initialized services (or placeholders)
export { app, firestore, auth, storage };
