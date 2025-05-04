// src/lib/firebase/client.ts
'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { getStorage, connectStorageEmulator, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let storage: FirebaseStorage;

// State to track emulator connection status
let emulatorsConnected = false;

// Check if window is defined (runs only in browser)
if (typeof window !== 'undefined') {
    // Initialize Firebase for Client Side Rendering (CSR)
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    firestore = getFirestore(app);
    storage = getStorage(app);

    // Connect to emulators if running in development environment (client-side)
    // Check if NEXT_PUBLIC_USE_EMULATORS is set, or default to NODE_ENV check
    const useEmulators = process.env.NEXT_PUBLIC_USE_EMULATORS === 'true' || process.env.NODE_ENV === 'development';

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
    } else if (!useEmulators) {
         console.log("Connecting to production Firebase services (Client).");
    }

} else {
    // Handle Server-Side Rendering (SSR) or Server Components context if needed
    // Typically, admin SDK is used server-side (see admin.ts), client SDK less common here.
    // If client SDK is needed server-side, initialize similarly but be mindful of context.
    // For this app, we primarily use client SDK on the client.
    console.log("Firebase Client SDK: Not initializing on server.");
    // Provide mock or placeholder instances if absolutely necessary for server components
    // These will likely throw errors if used, which is intended server-side.
    app = {} as FirebaseApp;
    auth = {} as Auth;
    firestore = {} as Firestore;
    storage = {} as FirebaseStorage;
}

// Export the initialized services (or placeholders for server context)
export { app, firestore, auth, storage };
