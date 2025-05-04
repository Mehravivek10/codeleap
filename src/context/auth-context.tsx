'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase/client'; // Ensure this imports the CLIENT SDK instance
import { Skeleton } from '@/components/ui/skeleton'; // Keep skeleton for loading UI
import { Loader2 } from 'lucide-react'; // Use Loader2 for a better visual

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

// Function to handle session logic (create or clear session cookie)
async function handleSession(user: User | null) {
    const apiUrl = '/api/auth/session'; // Centralize API route
    try {
        if (user) {
            console.log("Auth Context: Attempting to create/refresh session cookie...");
            const idToken = await user.getIdToken(true); // Force refresh for latest claims
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken }),
            });
            if (!response.ok) {
                const errorData = await response.text(); // Read error response
                throw new Error(`API responded with status ${response.status}: ${errorData}`);
            }
            const result = await response.json();
            console.log('Auth Context: Session cookie created/refreshed:', result.status);
        } else {
            console.log("Auth Context: Attempting to clear session cookie...");
            const response = await fetch(apiUrl, { method: 'DELETE' });
             if (!response.ok) {
                 const errorData = await response.text(); // Read error response
                throw new Error(`API responded with status ${response.status}: ${errorData}`);
            }
            const result = await response.json();
            console.log('Auth Context: Session cookie cleared:', result.status);
        }
    } catch (error) {
        console.error('Auth Context: Error handling session cookie:', error);
        // Consider more specific error handling or user notification if needed
        // Avoid signing out the user here unless absolutely necessary, as it might disrupt UX.
    }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const initialLoadDone = useRef(false); // Track initial auth check completion
  const sessionHandlingInProgress = useRef(false); // Prevent concurrent session calls

  useEffect(() => {
    // Ensure Firebase client auth is initialized before subscribing
    if (!auth) {
        console.error("Firebase auth instance not available in AuthProvider.");
        setLoading(false); // Stop loading if auth is missing
        return;
    }

    console.log("AuthProvider: Subscribing to auth state changes...");
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("Auth State Changed: UID:", firebaseUser?.uid ?? 'null', "Initial Load:", initialLoadDone.current);
      setUser(firebaseUser); // Update user state immediately

      // Prevent multiple session calls if auth state changes rapidly
      if (sessionHandlingInProgress.current) {
          console.log("Auth Context: Session handling already in progress, skipping.");
          return;
      }
      sessionHandlingInProgress.current = true;

      try {
            await handleSession(firebaseUser);
      } finally {
            sessionHandlingInProgress.current = false;
            // Mark loading as complete only after the first auth check and session handling attempt
            if (!initialLoadDone.current) {
                setLoading(false);
                initialLoadDone.current = true;
                console.log("AuthProvider: Initial load complete.");
            }
      }


    }, (error) => {
         // Handle errors during subscription (rare)
         console.error("Error in onAuthStateChanged listener:", error);
         setLoading(false); // Ensure loading stops even on listener error
         initialLoadDone.current = true; // Mark initial load as done even on error
    });

    // Cleanup subscription on unmount
    return () => {
        console.log("AuthProvider: Unsubscribing from Auth State Changes.");
        unsubscribe();
    };
  }, []); // Empty dependency array ensures this runs only once on mount


  if (loading) {
    // Show a more centered and informative loading state
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="flex flex-col items-center space-y-3 p-6 rounded-lg">
                 <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 <p className="text-muted-foreground text-sm">Loading user session...</p>
             </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
