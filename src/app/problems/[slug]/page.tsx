'use server';

import { cookies } from 'next/headers';
import { getAdminAuth } from '@/lib/firebase/admin';
import { notFound } from 'next/navigation';
import type { Problem } from '@/types/leetcode';
import { getProblemBySlug } from '@/services/leetcode';
import { ProblemPageClient } from './ProblemPageClient';

interface ProblemPageProps {
  params: {
    slug: string;
  };
}

export default async function ProblemPage({ params }: ProblemPageProps) {
  try {
    const { slug } = params;
    
    // Get cookies first - using await since cookies() returns a Promise in Next.js 14+
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    
    // Fetch problem data and verify session in parallel
    const [problem, userId] = await Promise.all([
      getProblemBySlug(slug),
      (async () => {
        try {
          if (sessionCookie) {
            const auth = getAdminAuth();
            const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
            return decodedClaims.uid;
          }
          return null;
        } catch (error) {
          console.error('Error verifying session:', error);
          return null;
        }
      })()
    ]);

    if (!problem) {
      notFound();
    }

    // Pass the problem and userId as serializable props to client component
    return <ProblemPageClient problem={problem} userId={userId} />;
  } catch (error) {
    console.error('Error in ProblemPage:', error);
    notFound();
  }
}
