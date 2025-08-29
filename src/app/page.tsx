// src/app/page.tsx
'use client'; // Convert to client component to use hooks for progress

import type { Problem } from '@/services/leetcode';
import { getProblems } from '@/services/leetcode';
import { ProblemList } from '@/components/problem-list';
import { Header } from '@/components/header';
import { UserProgress } from '@/components/user-progress';
import { Suspense, useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
<<<<<<< HEAD
import { Code } from 'lucide-react';
import { cookies } from 'next/headers';
import { getAdminAuth, getAdminDb } from '@/lib/firebase/admin';
import type { UserProblemStatus, UserProfile, ProblemStatusDetail } from '@/types';
import { format } from 'date-fns'; // Import date-fns functions
=======
import { Code, Trophy, Loader2 } from 'lucide-react';
import type { UserProblemStatus, UserProfile } from '@/types';
import { format } from 'date-fns';
>>>>>>> dcc129e (Updated codes and fixes few bugs)
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/client';

// Define the structure for chart data
interface MonthlyProgress {
  month: string;
  solved: number;
}

// Function to get difficulty class
const getDifficultyClass = (difficulty: string): string => {
    switch (difficulty.toLowerCase()) {
        case 'easy': return 'text-green-500 dark:text-green-400';
        case 'medium': return 'text-yellow-500 dark:text-yellow-400';
        case 'hard': return 'text-red-500 dark:text-red-400';
        default: return 'text-muted-foreground';
    }
};

// Function to transform UserProblemStatus into monthly chart data
const transformProgressToChartData = (progress: UserProblemStatus): MonthlyProgress[] => {
  const monthlyCounts: { [key: string]: number } = {}; // Key format: YYYY-MM

  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthKey = format(date, 'yyyy-MM');
    monthlyCounts[monthKey] = 0;
  }

  Object.entries(progress).forEach(([slug, data]) => {
      if (typeof data === 'object' && data !== null && 'status' in data && data.status === 'Solved' && data.solvedAt?.toDate) {
        const solvedDate = data.solvedAt.toDate();
        const monthKey = format(solvedDate, 'yyyy-MM');
        if (monthlyCounts[monthKey] !== undefined) {
            monthlyCounts[monthKey]++;
        }
      }
  });

  const chartData: MonthlyProgress[] = Object.entries(monthlyCounts)
    .map(([monthKey, solved]) => ({
      month: format(new Date(monthKey + '-01'), 'MMM'),
      solved,
    }))
    .sort((a, b) => {
        const monthA = new Date(Object.keys(monthlyCounts).find(key => format(new Date(key + '-01'), 'MMM') === a.month)! + '-01');
        const monthB = new Date(Object.keys(monthlyCounts).find(key => format(new Date(key + '-01'), 'MMM') === b.month)! + '-01');
        return monthA.getTime() - monthB.getTime();
    });

  return chartData;
};

// This is now a Client Component
export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [dailyChallenge, setDailyChallenge] = useState<Problem | null>(null);
  const [userProgress, setUserProgress] = useState<UserProblemStatus>({});
  const [progressChartData, setProgressChartData] = useState<MonthlyProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

<<<<<<< HEAD
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    if (sessionCookie) {
      const decodedToken = await getAdminAuth().verifySessionCookie(sessionCookie, true);
      const userId = decodedToken.uid;

      // Fetch user profile
      const userRecord = await getAdminAuth().getUser(userId);
      userProfile = {
        uid: userRecord.uid,
        email: userRecord.email || null,
        displayName: userRecord.displayName || null,
        photoURL: userRecord.photoURL || null,
      };

      // Fetch user progress
      const progressDoc = await getAdminDb().collection('userProgress').doc(userId).get();
      if (progressDoc.exists) {
        const data = progressDoc.data();
        // Ensure we are reading from the 'problems' map within the document
        userProgress = data?.problems || {};
        // Transform the progress data for the chart
        progressChartData = transformProgressToChartData(userProgress);
      } else {
        // Initialize chart data for a new user (last 6 months with 0 solves)
        progressChartData = transformProgressToChartData({});
=======
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const allProblems = await getProblems();
        setProblems(allProblems.slice(0, 10)); // Set subset for homepage

        // Determine daily challenge
        const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
        setDailyChallenge(allProblems[dayOfYear % allProblems.length]);

        // Fetch user progress if logged in
        if (user) {
          const progressDocRef = doc(firestore, 'userProgress', user.uid);
          const progressDocSnap = await getDoc(progressDocRef);
          if (progressDocSnap.exists()) {
            const data = progressDocSnap.data()?.problems || {};
            setUserProgress(data);
            setProgressChartData(transformProgressToChartData(data));
          } else {
             // If no progress doc, initialize empty
             setUserProgress({});
             setProgressChartData(transformProgressToChartData({}));
          }
        } else {
           // If logged out, reset progress and chart
           setUserProgress({});
           setProgressChartData(transformProgressToChartData({}));
        }
      } catch (error) {
        console.error("Error fetching data on homepage:", error);
         setUserProgress({});
         setProgressChartData(transformProgressToChartData({}));
      } finally {
        setIsLoading(false);
>>>>>>> dcc129e (Updated codes and fixes few bugs)
      }
    }
    fetchData();
  }, [user]); // Re-run effect when user logs in or out

  const displayName = user?.displayName?.split(' ')[0] || 'Coder';

  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Pane (2/3 width): Problems List */}
          <div className="md:col-span-2">
             <div className="flex justify-between items-center mb-4 border-b border-border/50 pb-2">
                  <h2 className="text-xl font-semibold text-primary">Problems</h2>
                  <Link href="/problems" className="text-sm text-primary hover:underline">
                      View All
                   </Link>
             </div>
            {isLoading || authLoading ? (
              <ProblemListSkeleton />
            ) : (
              <ProblemList problems={problems} userProgress={userProgress} />
            )}
          </div>

          {/* Right Pane (1/3 width): User Info / Welcome */}
          <div className="flex flex-col gap-6">
            <Card className="w-full shadow-md bg-card border border-border">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Code className="h-8 w-8" />
                </div>
                <CardTitle className="text-center text-2xl font-bold text-card-foreground">
                  {user ? `Welcome back, ${displayName}!` : 'Welcome to CodeLeap!'}
                </CardTitle>
                <CardDescription className="text-center mt-1 text-muted-foreground">
                   {user ? 'Ready to tackle a new challenge?' : 'Select a problem from the list to start coding.'}
                </CardDescription>
              </CardHeader>
               <CardContent>
                   <h3 className="text-lg font-semibold mb-4 text-card-foreground text-center">
                       {user ? 'Your Progress (Last 6 Months)' : 'Progress Overview (Last 6 Months)'}
                   </h3>
                   <UserProgress data={progressChartData} />
               </CardContent>
            </Card>
             {/* Daily Challenge Card */}
             {dailyChallenge && (
              <Card className="w-full shadow-md bg-card border border-border">
                   <CardHeader>
                       <div className="flex items-center justify-between">
                         <div>
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <Trophy className="text-yellow-400 h-5 w-5" />
                                Daily Challenge
                            </CardTitle>
                            <CardDescription>A new problem to solve every day. Keep your streak going!</CardDescription>
                         </div>
                       </div>
                   </CardHeader>
                   <CardContent>
                        <div className="flex flex-col space-y-2">
                             <p className="font-semibold text-primary">{dailyChallenge.title}</p>
                             <p className={cn("text-sm font-medium", getDifficultyClass(dailyChallenge.difficulty))}>{dailyChallenge.difficulty}</p>
                             <div className="flex flex-wrap gap-2 pt-1">
                                 {dailyChallenge.tags?.slice(0, 3).map(tag => (
                                    <span key={tag} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">{tag}</span>
                                 ))}
                             </div>
                        </div>
                       <Button size="sm" variant="outline" className="mt-4 w-full" asChild>
                          <Link href={`/problems/${dailyChallenge.slug}`}>View Problem</Link>
                       </Button>
                   </CardContent>
               </Card>
             )}
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}

// Skeleton loader for the problem list (remains unchanged)
function ProblemListSkeleton() {
  return (
    <div className="space-y-2 border rounded-lg p-4">
      {/* Skeleton Header */}
      <div className="flex justify-between items-center h-10 border-b">
         <Skeleton className="h-4 w-1/12" />
         <Skeleton className="h-4 w-5/12" />
         <Skeleton className="h-4 w-1/12" />
         <Skeleton className="h-4 w-1/12" />
         <Skeleton className="h-4 w-2/12" />
      </div>
       {/* Skeleton Rows */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex justify-between items-center h-12 border-b last:border-b-0">
           <Skeleton className="h-4 w-1/12" />
           <Skeleton className="h-4 w-5/12" />
           <Skeleton className="h-4 w-1/12" />
           <Skeleton className="h-4 w-1/12" />
           <Skeleton className="h-4 w-2/12" />
        </div>
      ))}
    </div>
  );
}
