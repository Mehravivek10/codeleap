
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-context'; // Import AuthProvider
import { Suspense } from 'react'; // Import Suspense
import { Loader2 } from 'lucide-react'; // Import Loader for fallback

export const metadata: Metadata = {
  title: 'CodeLeap - LeetCode Clone',
  description: 'Practice coding problems, get hints, and track your progress. A LeetCode clone built with Next.js and AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      {/* Removed whitespace */}
      <body
        className={`antialiased font-sans`} // Font variables applied on html tag
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider> {/* Wrap content with AuthProvider */}
             <Suspense fallback={<RootLayoutLoadingFallback />}> {/* Wrap children with Suspense */}
               {children}
             </Suspense>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


// Simple loading fallback component for the root layout
function RootLayoutLoadingFallback() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="flex flex-col items-center space-y-3 p-6 rounded-lg">
                 <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 <p className="text-muted-foreground text-sm">Loading page...</p>
             </div>
      </div>
    );
}
