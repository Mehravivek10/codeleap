
// src/lib/firebase/admin.ts
import * as admin from 'firebase-admin';
import type { App } from 'firebase-admin/app'; // Import App type

// Store the app instance globally within this module
let adminAppInstance: App | null = null;
let initializationError: Error | null = null; // Store initialization error

function initializeAdminApp(): App {
    // If already initialized successfully, return the instance
    if (adminAppInstance) {
        return adminAppInstance;
    }

    // If initialization previously failed, throw the stored error
    if (initializationError) {
        console.error("Firebase Admin SDK previously failed to initialize.");
        throw initializationError;
    }

    // Check if default app exists (covers cases where it might be initialized elsewhere or duplicated)
    if (admin.apps.length > 0) {
        console.log('Firebase Admin SDK default app already exists. Using existing app.');
        adminAppInstance = admin.app(); // Get the existing default app
        return adminAppInstance;
    }

    // Attempt initialization
    console.log('Attempting Firebase Admin SDK initialization...');
    try {
        // Option 1: Manual initialization via service account environment variables
        console.log('Trying service account initialization from environment variables...');
        const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

        if (projectId && clientEmail && privateKey) {
             try {
                console.log(`Initializing with Project ID: ${projectId}, Client Email: ${clientEmail.substring(0, 5)}...`);
                adminAppInstance = admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId,
                        clientEmail,
                        privateKey,
                    }),
                });
                console.log('Firebase Admin SDK initialized (service account).');
                return adminAppInstance;
             } catch (saError: any) {
                if (saError.code === 'app/duplicate-app') {
                     console.log('Firebase Admin SDK already initialized (caught duplicate app error), using existing app.');
                     adminAppInstance = admin.app();
                     return adminAppInstance;
                } else {
                     console.error('Firebase Admin SDK initialization failed (service account):', saError);
                      initializationError = saError;
                     throw saError;
                }
             }
        }

        // Option 2: Try auto-initialization (GCP environments like Cloud Functions, Cloud Run)
        console.log('Service account variables not found. Trying auto-initialization (for GCP environments)...');
        try {
            // This only works if GOOGLE_APPLICATION_CREDENTIALS is set or running in a GCP env
            admin.initializeApp();
            console.log('Firebase Admin SDK initialized (auto).');
            adminAppInstance = admin.app();
            return adminAppInstance;
        } catch (autoInitError: any) {
             const errorMessage = "Firebase Admin SDK could not be initialized. Neither service account variables nor GCP auto-detection worked.";
             console.error(errorMessage, autoInitError.message);
             initializationError = new Error(errorMessage);
             throw initializationError;
        }

    } catch (error) {
        console.error("CRITICAL: Failed to initialize Firebase Admin SDK.", error);
        adminAppInstance = null;
         if (!initializationError) {
             initializationError = error instanceof Error ? error : new Error(String(error));
         }
        throw initializationError;
    }
}

// Initialize and export services
const getService = <T>(serviceFactory: (app: App) => T, serviceName: string): T => {
    try {
        const app = initializeAdminApp();
        return serviceFactory(app);
    } catch (error) {
        console.error(`Failed to get Firebase Admin ${serviceName} instance:`, error);
        throw new Error(`Firebase Admin ${serviceName} service is unavailable due to initialization failure. Reason: ${error instanceof Error ? error.message : String(error)}`);
    }
};

<<<<<<< HEAD

// Export the service instances using the getter function
// This ensures initialization happens upon module load or first access,
// and errors are thrown immediately if initialization fails.
export const getAdminAuth = () => getService(() => admin.auth(), 'Auth');
export const getAdminDb = () => getService(() => admin.firestore(), 'Firestore');
export const getAdminStorage = () => getService(() => admin.storage(), 'Storage');
=======
export const adminAuth = getService(app => app.auth(), 'Auth');
export const adminDb = getService(app => app.firestore(), 'Firestore');
export const adminStorage = getService(app => app.storage(), 'Storage');
>>>>>>> dcc129e (Updated codes and fixes few bugs)
