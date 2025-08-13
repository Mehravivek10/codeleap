// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_ROUTES_PREFIX = ['/profile', '/settings']; // Add routes that require authentication
const PUBLIC_ROUTES = ['/', '/problems', '/api/auth/session', '/not-found']; // Routes accessible without login
const PUBLIC_API_ROUTES_PREFIX = ['/api/auth/session']; // Public API routes

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session')?.value;

  // 1. Allow specific file types and Next.js internals early
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    /\.(ico|png|jpg|jpeg|svg|css|js|json|webmanifest|txt|map|woff2|woff)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  // 2. Allow public API routes
  const isPublicApiRoute = PUBLIC_API_ROUTES_PREFIX.some(prefix => pathname.startsWith(prefix));
  if (isPublicApiRoute) {
    return NextResponse.next();
  }

  // 3. Allow explicitly public routes and problem details
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname) || pathname.startsWith('/problems/');
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // 4. Lightweight protection for protected routes using cookie presence only
  const isProtectedRoute = PROTECTED_ROUTES_PREFIX.some(prefix => pathname.startsWith(prefix));
  if (isProtectedRoute) {
    if (!sessionCookie) {
      const loginUrl = new URL('/', request.url);
      loginUrl.searchParams.set('auth', 'true'); // Trigger auth dialog
      loginUrl.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 5. Default allow
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api/genkit|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|json|webmanifest|txt|map|woff2|woff)$).*)',
  ],
};
