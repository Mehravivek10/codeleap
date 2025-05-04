
// src/app/api/auth/session/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';

export const runtime = 'nodejs'; // Necessary for firebase-admin

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const idToken = body.idToken?.toString();

    if (!idToken) {
      return NextResponse.json({ error: 'ID token is required.' }, { status: 400 });
    }

    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    // Create the session cookie. This will also verify the ID token.
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    // Set cookie policy for session cookie.
    const options = {
      name: 'session',
      value: sessionCookie,
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      path: '/',
    };

    // Create a response and set the session cookie.
    const response = NextResponse.json({ status: 'success' }, { status: 200 });
    response.cookies.set(options);

    return response;

  } catch (error: any) {
    console.error('Error creating session cookie:', error);
    return NextResponse.json({ error: `Error creating session cookie: ${error.message}` }, { status: 401 });
  }
}

export async function DELETE(request: NextRequest) {
   try {
     const sessionCookie = request.cookies.get('session')?.value;
     if (!sessionCookie) {
       return NextResponse.json({ status: 'No session cookie found.' }, { status: 200 });
     }

     // Verify the session cookie. In this case an additional check is added to detect
     // if the user's Firebase session was revoked, user deleted/disabled, etc.
     const decodedClaims = await adminAuth.verifySessionCookie(
       sessionCookie,
       true /** checkRevoked */
     );

     // Revoke the refresh tokens associated with the session cookie for enhanced security.
     await adminAuth.revokeRefreshTokens(decodedClaims.sub);

     // Clear the session cookie by setting its maxAge to 0.
     const response = NextResponse.json({ status: 'success' }, { status: 200 });
     response.cookies.set({
       name: 'session',
       value: '',
       maxAge: 0,
       httpOnly: true,
       secure: process.env.NODE_ENV === 'production',
       path: '/',
     });
     return response;

   } catch (error: any) {
     console.error('Error clearing session cookie:', error);
      // Clear the potentially invalid cookie anyway
     const response = NextResponse.json({ error: `Error clearing session: ${error.message}` }, { status: 401 });
      response.cookies.set({
       name: 'session',
       value: '',
       maxAge: 0,
       httpOnly: true,
       secure: process.env.NODE_ENV === 'production',
       path: '/',
     });
     return response;
   }
}
