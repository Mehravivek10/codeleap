// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin'; // Assuming admin SDK is correctly configured

// Explicitly set the runtime to Node.js as firebase-admin is not edge compatible
export const runtime = 'nodejs';

const PROTECTED_ROUTES_PREFIX = ['/profile', '/settings']; // Add routes that require authentication
const PUBLIC_ROUTES = ['/', '/problems', '/api/auth/session', '/not-found']; // Routes accessible without login
const PUBLIC_API_ROUTES_PREFIX = ['/api/auth/session']; // Public API routes

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session')?.value;

  console.log(`Middleware executing for path: ${pathname}`);

  // 1. Allow specific file types and Next.js internals early
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    /\.(ico|png|jpg|jpeg|svg|css|js|json|webmanifest|txt|map|woff2|woff)$/i.test(pathname)
  ) {
    console.log(`Middleware: Allowing static asset/internal request: ${pathname}`);
    return NextResponse.next();
  }

   // 2. Check if the route is a public API route
   const isPublicApiRoute = PUBLIC_API_ROUTES_PREFIX.some(prefix => pathname.startsWith(prefix));
   if (isPublicApiRoute) {
       console.log(`Middleware: Allowing public API route: ${pathname}`);
       return NextResponse.next();
   }

   // 3. Check if the route is explicitly public
   const isPublicRoute = PUBLIC_ROUTES.includes(pathname) || pathname.startsWith('/problems/');
   if (isPublicRoute) {
       console.log(`Middleware: Allowing public route: ${pathname}`);
       return NextResponse.next();
   }


  // 4. Handle protected routes
  const isProtectedRoute = PROTECTED_ROUTES_PREFIX.some(prefix => pathname.startsWith(prefix));

  if (isProtectedRoute) {
    if (!sessionCookie) {
      console.log('Middleware: No session cookie found for protected route. Redirecting to login.');
      const loginUrl = new URL('/', request.url);
      loginUrl.searchParams.set('auth', 'true'); // Trigger auth dialog
      loginUrl.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Verify the session cookie for protected routes
      // NOTE: This verifySessionCookie call might fail if admin SDK isn't initialized
      // Ensure src/lib/firebase/admin.ts initializes correctly in a Node.js environment.
      await adminAuth.verifySessionCookie(sessionCookie, true /** checkRevoked */);
      console.log('Middleware: Session valid for protected route. Allowing access.');
      return NextResponse.next();
    } catch (error: any) {
      console.error('Middleware: Session verification failed for protected route:', error.code || error.message);
      // Invalid or revoked session, clear cookie and redirect to login
      const loginUrl = new URL('/', request.url);
      loginUrl.searchParams.set('auth', 'true');
      loginUrl.searchParams.set('redirectedFrom', pathname);
      const redirectResponse = NextResponse.redirect(loginUrl);
      redirectResponse.cookies.set({
        name: 'session',
        value: '',
        maxAge: 0,
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });
      console.log('Middleware: Invalid session for protected route. Redirecting and clearing cookie.');
      return redirectResponse;
    }
  }

  // 5. Default behavior for any other route (should ideally not be reached if routes are categorized correctly)
  console.log(`Middleware: Path ${pathname} not explicitly public or protected. Allowing access (default).`);
  return NextResponse.next();
}

// Define which paths the middleware should run on.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/genkit (Genkit routes handled separately if needed)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Specific static file extensions
     */
    '/((?!api/genkit|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|json|webmanifest|txt|map|woff2|woff)$).*)',
  ],
};
