
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
        // Option 1: Try auto-initialization (GCP environments like Cloud Functions, Cloud Run)
        try {
            console.log('Trying auto-initialization (for GCP environments)...');
            // This only works if GOOGLE_APPLICATION_CREDENTIALS is set or running in a GCP env
            admin.initializeApp();
            console.log('Firebase Admin SDK initialized (auto).');
            adminAppInstance = admin.app();
            return adminAppInstance;
        } catch (autoInitError: any) {
             // Don't log noise if it's just missing credentials, we'll try the next method
             if (autoInitError.code !== 'app/missing-credential' && autoInitError.code !== 'app/no-options') {
                console.warn('Firebase Admin SDK auto-initialization failed:', autoInitError.message);
             } else {
                 console.log('Auto-initialization skipped (no default credentials found or not in GCP).');
             }
        }

        // Option 2: Manual initialization via service account environment variables
        console.log('Trying service account initialization from environment variables...');
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        // Ensure private key newlines are handled correctly (replace literal \n with actual newlines)
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

        // Add detailed logging for missing variables
        let missingVars = [];
        if (!projectId) missingVars.push("FIREBASE_PROJECT_ID");
        if (!clientEmail) missingVars.push("FIREBASE_CLIENT_EMAIL");
        if (!privateKey) missingVars.push("FIREBASE_PRIVATE_KEY");

        if (missingVars.length > 0) {
             const errorMessage = `Firebase Admin SDK init Error: Required environment variables missing: ${missingVars.join(", ")}. Cannot initialize.`;
             console.error(errorMessage);
             initializationError = new Error(errorMessage); // Store the error
             throw initializationError;
        }


        if (projectId && clientEmail && privateKey) {
             try {
                console.log(`Initializing with Project ID: ${projectId}, Client Email: ${clientEmail.substring(0, 5)}...`);
                adminAppInstance = admin.initializeApp({ // Assign directly
                    credential: admin.credential.cert({
                        projectId,
                        clientEmail,
                        privateKey,
                    }),
                    // Optionally specify databaseURL and storageBucket if needed and not auto-detected
                    // databaseURL: `https://${projectId}.firebaseio.com`,
                    // storageBucket: `${projectId}.appspot.com`,
                });
                console.log('Firebase Admin SDK initialized (service account).');
                return adminAppInstance;
             } catch (saError: any) {
                // Don't throw for duplicate app, just use the existing one
                if (saError.code === 'app/duplicate-app') {
                     console.log('Firebase Admin SDK already initialized (caught duplicate app error), using existing app.');
                     adminAppInstance = admin.app(); // Ensure instance is set
                     return adminAppInstance;
                } else {
                     // Throw for other service account errors
                     console.error('Firebase Admin SDK initialization failed (service account):', saError);
                      initializationError = saError; // Store the error
                     throw saError; // Rethrow critical service account init errors
                }
             }

        } else {
            // This case should theoretically be caught by the missingVars check above
            const errorMessage = `Firebase Admin SDK initialization failed: Unknown issue with service account variables.`;
            console.error(errorMessage);
            initializationError = new Error(errorMessage); // Store the error
            throw initializationError;
        }

    } catch (error) {
        console.error("CRITICAL: Failed to initialize Firebase Admin SDK.", error);
        // Ensure subsequent calls don't retry indefinitely if there's a fundamental issue
        adminAppInstance = null; // Explicitly mark as failed/uninitialized
         if (!initializationError) { // Store the error if it wasn't stored already
             initializationError = error instanceof Error ? error : new Error(String(error));
         }
        // Re-throw the error to prevent the application from proceeding
        // without a functional Admin SDK if it's essential (like for middleware).
        throw initializationError;
    }
}

// Initialize and export services
// Use getters with error handling to ensure initialization is attempted on first access
// and to provide meaningful errors if initialization failed.

const getService = <T>(serviceFactory: (app: App) => T, serviceName: string): T => {
    try {
        const app = initializeAdminApp(); // Attempt initialization if not already done
        return serviceFactory(app);
    } catch (error) {
        console.error(`Failed to get Firebase Admin ${serviceName} instance:`, error);
        // Make the error message more specific about the root cause
        throw new Error(`Firebase Admin ${serviceName} service is unavailable due to initialization failure. Reason: ${error instanceof Error ? error.message : String(error)}`);
    }
};


// Export the service instances using the getter function
// This ensures initialization happens upon module load or first access,
// and errors are thrown immediately if initialization fails.
export const adminAuth = getService(app => app.auth(), 'Auth');
export const adminDb = getService(app => app.firestore(), 'Firestore');
export const adminStorage = getService(app => app.storage(), 'Storage');
