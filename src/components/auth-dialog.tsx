
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
// Import firebaseInitialized and the auth instance which might be null
import { auth as firebaseAuthClient, firebaseInitialized, analytics } from '@/lib/firebase/client';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
  type Auth, // Import Auth type for casting
} from 'firebase/auth';
import { logEvent } from 'firebase/analytics'; // Import logEvent
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Inline SVG for Google Icon
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18px" height="18px" className="mr-2">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C39.712,34.438,44,28.718,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
  </svg>
);

interface AuthDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ isOpen, onOpenChange }: AuthDialogProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  const showFirebaseConfigError = () => {
    toast({
      title: 'Setup Incomplete',
      description: 'Firebase is not configured correctly. Authentication is unavailable. Please check environment variables or contact support.',
      variant: 'destructive',
      duration: 10000,
    });
  };

  const handleAuthSuccess = (isNewUser = false, method = 'email') => {
    toast({ title: 'Success!', description: activeTab === 'login' ? 'Logged in successfully.' : 'Account created successfully.' });
    if (isNewUser && analytics) {
        logEvent(analytics, 'sign_up', { method });
        console.log(`Analytics: Logged 'sign_up' event with method: ${method}`);
    }
    onOpenChange(false);
    setEmail('');
    setPassword('');
    setDisplayName('');
    setResetEmail('');
  };

  const handleAuthError = (error: any, action: 'login' | 'signup' | 'google' | 'reset') => {
    console.error(`Error during ${action}:`, error);
    let description = 'An unexpected error occurred. Please try again.';
    if (error.code) {
        switch (error.code) {
            case 'auth/invalid-email':
            case 'auth/missing-email':
                description = action === 'reset' && error.code === 'auth/missing-email' ? 'Please enter the email for password reset.' : 'Please enter a valid email address.';
                break;
            case 'auth/user-not-found':
                 description = action === 'reset' ? 'No account found with this email for password reset.' : 'No account found with this email. Please sign up or check your email.';
                 break;
            case 'auth/wrong-password':
                 description = 'Invalid password. Please try again.';
                 break;
            case 'auth/email-already-in-use':
                description = 'This email is already associated with an account. Please log in.';
                break;
            case 'auth/weak-password':
                description = 'Password should be at least 6 characters long.';
                break;
            case 'auth/popup-closed-by-user':
                description = 'Google Sign-in cancelled by user.';
                break;
            case 'auth/cancelled-popup-request':
            case 'auth/popup-blocked':
                description = 'Google Sign-in popup blocked by browser. Please enable popups for this site.';
                break;
             case 'auth/network-request-failed':
                 description = 'Network error. Please check your internet connection and try again.';
                 break;
             case 'auth/requires-recent-login':
                 description = 'This operation is sensitive and requires recent authentication. Please log in again.';
                 break;
             default:
                 description = `Error: ${error.message || 'Unknown authentication error.'}`;
        }
    } else if (!firebaseInitialized) {
        description = 'Firebase is not configured correctly. Authentication is unavailable.';
    }
    toast({ title: `${action.charAt(0).toUpperCase() + action.slice(1)} Failed`, description, variant: 'destructive' });
  };

  const handleEmailPasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!firebaseInitialized || !firebaseAuthClient) {
      showFirebaseConfigError();
      return;
    }
    setIsLoading(true);
    try {
      if (activeTab === 'signup') {
        if (!displayName.trim()) {
             handleAuthError({ code: 'auth/missing-display-name', message: 'Please enter your name.' }, 'signup');
             setIsLoading(false);
             return;
        }
        const userCredential = await createUserWithEmailAndPassword(firebaseAuthClient as Auth, email, password);
        await updateProfile(userCredential.user, { displayName });
        await userCredential.user.reload();
        handleAuthSuccess(true, 'password'); // New user with email/password
      } else {
        await signInWithEmailAndPassword(firebaseAuthClient as Auth, email, password);
        handleAuthSuccess(); // Existing user
      }
    } catch (error) {
      handleAuthError(error, activeTab);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!firebaseInitialized || !firebaseAuthClient) {
      showFirebaseConfigError();
      return;
    }
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(firebaseAuthClient as Auth, provider);
      // Check if the user is new by looking at the creation time
      const metadata = result.user.metadata;
      const isNewUser = metadata.creationTime === metadata.lastSignInTime;
      handleAuthSuccess(isNewUser, 'google');
    } catch (error) {
      handleAuthError(error, 'google');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handlePasswordReset = async (event: React.FormEvent) => {
     event.preventDefault();
     if (!firebaseInitialized || !firebaseAuthClient) {
      showFirebaseConfigError();
      return;
    }
     if (!resetEmail.trim()) {
       handleAuthError({ code: 'auth/missing-email' }, 'reset');
       return;
     }
     setIsResetLoading(true);
     try {
       await sendPasswordResetEmail(firebaseAuthClient as Auth, resetEmail);
       toast({ title: 'Password Reset Email Sent', description: 'Check your inbox for instructions to reset your password.' });
       setResetEmail('');
     } catch (error) {
       handleAuthError(error, 'reset');
     } finally {
       setIsResetLoading(false);
     }
   };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        {!firebaseInitialized ? (
          <div>
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-bold">Authentication Unavailable</DialogTitle>
            </DialogHeader>
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Configuration Error</AlertTitle>
              <AlertDescription>
                The application is not configured correctly. Please check your project's environment variables and ensure they are set up for Firebase.
              </AlertDescription>
            </Alert>
            <DialogFooter className="mt-4">
              <Button onClick={() => onOpenChange(false)}>Close</Button>
            </DialogFooter>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')} className="w-full">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-bold">
                 {activeTab === 'login' ? 'Welcome Back!' : 'Create an Account'}
              </DialogTitle>
              <DialogDescription className="text-center">
                {activeTab === 'login' ? 'Log in to continue your coding journey.' : 'Join CodeLeap to start solving problems.'}
              </DialogDescription>
               <TabsList className="grid w-full grid-cols-2 mt-4">
                   <TabsTrigger value="login">Log In</TabsTrigger>
                   <TabsTrigger value="signup">Sign Up</TabsTrigger>
               </TabsList>
            </DialogHeader>

            <TabsContent value="login">
              <form onSubmit={handleEmailPasswordSubmit} className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                       <Label htmlFor="login-password">Password</Label>
                       <Dialog>
                           <DialogTrigger asChild>
                               <Button variant="link" type="button" className="p-0 h-auto text-xs text-primary">Forgot password?</Button>
                           </DialogTrigger>
                           <DialogContent className="sm:max-w-[400px]">
                               <DialogHeader>
                                   <DialogTitle>Reset Password</DialogTitle>
                                   <DialogDescription>
                                       Enter your email address and we'll send you a link to reset your password.
                                   </DialogDescription>
                               </DialogHeader>
                               <form onSubmit={handlePasswordReset} className="grid gap-4 py-4">
                                   <div className="grid gap-2">
                                       <Label htmlFor="reset-email">Email</Label>
                                       <Input
                                           id="reset-email"
                                           type="email"
                                           placeholder="m@example.com"
                                           required
                                           value={resetEmail}
                                           onChange={(e) => setResetEmail(e.target.value)}
                                           disabled={isResetLoading}
                                        />
                                    </div>
                                    <DialogFooter>
                                       <Button type="submit" disabled={isResetLoading}>
                                            {isResetLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Send Reset Link
                                       </Button>
                                    </DialogFooter>
                               </form>
                           </DialogContent>
                       </Dialog>
                   </div>
                  <Input
                    id="login-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full mt-2">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Log In
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleEmailPasswordSubmit} className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    placeholder="Your Name"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    required
                    placeholder="Must be at least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full mt-2">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </form>
            </TabsContent>

             <div className="relative my-4">
               <div className="absolute inset-0 flex items-center">
                 <span className="w-full border-t" />
               </div>
               <div className="relative flex justify-center text-xs uppercase">
                 <span className="bg-background px-2 text-muted-foreground">
                   Or continue with
                 </span>
               </div>
             </div>
             <div className="grid grid-cols-1 gap-2">
               <Button variant="outline" onClick={handleGoogleSignIn} disabled={isGoogleLoading}>
                  {isGoogleLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <GoogleIcon />
                  )}
                  Google
               </Button>
             </div>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
