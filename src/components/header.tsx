
'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Code, LogOut, User as UserIcon, Settings, Compass } from 'lucide-react'; // Using Code icon for logo, added Compass for Explore
import { useAuth } from '@/context/auth-context'; // Import useAuth hook
import { auth } from '@/lib/firebase/client'; // Import Firebase auth instance
import { signOut } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AuthDialog } from './auth-dialog'; // Import the AuthDialog component
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation'; // Import hooks
import { Skeleton } from '@/components/ui/skeleton'; // For loading state
import { cn } from '@/lib/utils'; // For conditional class names

export function Header() {
  const { user, loading } = useAuth();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter(); // Initialize useRouter
  const pathname = usePathname(); // Get current pathname

  // Effect to check for 'auth=true' in URL and open dialog
  useEffect(() => {
    if (searchParams.get('auth') === 'true') {
      setIsAuthDialogOpen(true);
       // Optional: Remove the query param after opening the dialog
       const currentPath = window.location.pathname;
       router.replace(currentPath, undefined); // Removes query params without scroll
    }
  }, [searchParams, router]); // Add router to dependency array

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Optional: Show success message or redirect
      console.log("User signed out successfully.");
      // No need to manually clear cookie here, auth context handles it via API
    } catch (error) {
      console.error('Error signing out:', error);
      // Optional: Show error message
    }
  };

  const getInitials = (displayName: string | null | undefined): string => {
    if (!displayName) return '?';
    const names = displayName.split(' ');
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <Code className="h-6 w-6 mr-2 text-primary" />
           <Link href="/" className="mr-6 flex items-center space-x-2">
             <span className="font-bold sm:inline-block text-lg text-primary">
               CodeLeap
             </span>
           </Link>
        </div>
         {/* Navigation Links */}
         <nav className="flex items-center gap-4 text-sm lg:gap-6">
           <Link
             href="/problems"
             className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/problems" ? "text-foreground" : "text-foreground/60"
             )}
           >
             Problems
           </Link>
           <Link
             href="/explore"
             className={cn(
                "transition-colors hover:text-foreground/80",
                 pathname === "/explore" ? "text-foreground" : "text-foreground/60"
             )}
           >
             <Compass className="mr-1 h-4 w-4 inline-block sm:mr-0 sm:hidden" /> {/* Icon for mobile */}
             <span className="hidden sm:inline-block">Explore</span> {/* Text for desktop */}
           </Link>
           {/* Add more links like Contests, Discuss, etc. */}
         </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {loading ? (
            // Skeleton loaders for buttons while loading
            <>
              <Skeleton className="h-9 w-20 rounded-md bg-muted" />
              <Skeleton className="h-9 w-9 rounded-full bg-muted" />
            </>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                     <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                     <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <>
               <Button variant="outline" size="sm" onClick={() => setIsAuthDialogOpen(true)}>Log In</Button>
               <Button variant="default" size="sm" onClick={() => setIsAuthDialogOpen(true)}>Sign Up</Button>
             </>
          )}
          <ThemeToggle />
        </div>
      </div>
       {/* Render AuthDialog conditionally */}
       <AuthDialog isOpen={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
    </header>
  );
}
