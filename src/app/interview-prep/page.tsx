// src/app/interview-prep/page.tsx
import { Header } from '@/components/header';
import { getProblems, type Problem } from '@/services/leetcode';
import { ProblemList } from '@/components/problem-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardCheck } from 'lucide-react';
import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import type { UserProblemStatus } from '@/types';
import { TooltipProvider } from '@/components/ui/tooltip';

export default async function InterviewPrepPage() {
    const allProblems = await getProblems();
    // Filter for problems categorized for interviews
    const interviewProblems = allProblems.filter(p => p.category === 'Interview Prep');
    let userProgress: UserProblemStatus = {};

     try {
        const sessionCookie = (await cookies()).get('session')?.value;
        if (sessionCookie) {
            const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
            const userId = decodedToken.uid;
            const progressDoc = await adminDb.collection('userProgress').doc(userId).get();
            if (progressDoc.exists) {
                userProgress = progressDoc.data()?.problems || {};
            }
        }
    } catch (error) {
       console.log("Could not fetch user progress for interview prep page (user may be logged out).");
    }

    return (
        <TooltipProvider>
            <div className="flex flex-col min-h-screen bg-background text-foreground">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8">
                     <div className="mb-8 border-b pb-4">
                        <h1 className="text-4xl font-bold tracking-tight text-primary flex items-center gap-3">
                            <ClipboardCheck className="h-10 w-10" />
                            Interview Preparation
                        </h1>
                        <p className="mt-2 text-lg text-muted-foreground">
                            A curated list of essential problems to master for your technical interviews.
                        </p>
                    </div>

                    <ProblemList problems={interviewProblems} userProgress={userProgress} />
                </main>
            </div>
        </TooltipProvider>
    );
}
