// src/app/page.tsx
import type { Problem } from '@/services/leetcode';
import { getProblems } from '@/services/leetcode';
import { ProblemList } from '@/components/problem-list';
import { Header } from '@/components/header';
import { UserProgress } from '@/components/user-progress';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Code } from 'lucide-react';
import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import type { UserProblemStatus, UserProfile, ProblemStatusDetail } from '@/types';
import { format } from 'date-fns'; // Import date-fns functions
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Import Button
import { TooltipProvider } from '@/components/ui/tooltip'; // Add TooltipProvider

// Define the structure for chart data
interface MonthlyProgress {
  month: string;
  solved: number;
}

// Function to transform UserProblemStatus into monthly chart data
const transformProgressToChartData = (progress: UserProblemStatus): MonthlyProgress[] => {
  const monthlyCounts: { [key: string]: number } = {}; // Key format: YYYY-MM

  // Initialize counts for the last 6 months
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthKey = format(date, 'yyyy-MM');
    monthlyCounts[monthKey] = 0;
  }

  // Count solved problems per month based on submission timestamps
  Object.entries(progress).forEach(([slug, data]) => {
      // Check if data is the detailed object format
      if (typeof data === 'object' && data !== null && 'status' in data && data.status === 'Solved' && data.solvedAt?.toDate) {
        const solvedDate = data.solvedAt.toDate();
        const monthKey = format(solvedDate, 'yyyy-MM');
        if (monthlyCounts[monthKey] !== undefined) { // Only count if within the last 6 months window
            monthlyCounts[monthKey]++;
        }
      } else if (data === 'Solved') { // Handle legacy string format (less accurate)
         // console.warn(`Problem ${slug} is Solved but lacks timestamp for monthly tracking.`);
         // Optionally, could increment current month as fallback, but it's inaccurate
         // const currentMonthKey = format(today, 'yyyy-MM');
         // monthlyCounts[currentMonthKey]++;
      }
  });


  // Convert to the array format required by the chart
  const chartData: MonthlyProgress[] = Object.entries(monthlyCounts)
    .map(([monthKey, solved]) => ({
      month: format(new Date(monthKey + '-01'), 'MMM'), // Format to 'Jan', 'Feb', etc.
      solved,
    }))
    .sort((a, b) => {
        // Ensure correct month order if keys weren't perfectly sorted
        const monthA = new Date(Object.keys(monthlyCounts).find(key => format(new Date(key + '-01'), 'MMM') === a.month) + '-01');
        const monthB = new Date(Object.keys(monthlyCounts).find(key => format(new Date(key + '-01'), 'MMM') === b.month) + '-01');
        return monthA.getTime() - monthB.getTime();
    });


  return chartData;
};

// This remains a Server Component
export default async function Home() {
  let userProfile: UserProfile | null = null;
  let userProgress: UserProblemStatus = {};
  let progressChartData: MonthlyProgress[] = [];

  try {
    const sessionCookie = cookies().get('session')?.value;
    if (sessionCookie) {
      const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
      const userId = decodedToken.uid;

      // Fetch user profile
      const userRecord = await adminAuth.getUser(userId);
      userProfile = {
        uid: userRecord.uid,
        email: userRecord.email || null,
        displayName: userRecord.displayName || null,
        photoURL: userRecord.photoURL || null,
      };

      // Fetch user progress
      const progressDoc = await adminDb.collection('userProgress').doc(userId).get();
      if (progressDoc.exists) {
        const data = progressDoc.data();
        // Ensure we are reading from the 'problems' map within the document
        userProgress = data?.problems || {};
        // Transform the progress data for the chart
        progressChartData = transformProgressToChartData(userProgress);
      } else {
        // Initialize chart data for a new user (last 6 months with 0 solves)
        progressChartData = transformProgressToChartData({});
      }
    } else {
         // Initialize chart data for a logged-out user (last 6 months with 0 solves)
         progressChartData = transformProgressToChartData({});
    }
  } catch (error: any) {
    console.error("Error fetching user data on homepage:", error.code || error.message);
     // Initialize chart data on error (last 6 months with 0 solves)
     progressChartData = transformProgressToChartData({});
    // Handle error (e.g., invalid session cookie), maybe clear cookie?
    // For now, user remains null, and empty progress is used.
  }

  return (
    <TooltipProvider> {/* Wrap with TooltipProvider */}
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Pane (2/3 width): Problems List */}
          <div className="md:col-span-2">
             <div className="flex justify-between items-center mb-4 border-b pb-2">
                  <h2 className="text-xl font-semibold text-primary">Featured Problems</h2>
                  <Link href="/problems" className="text-sm text-primary hover:underline">
                      View All Problems
                   </Link>
             </div>
            <Suspense fallback={<ProblemListSkeleton />}>
               {/* Pass progress to loader */}
              <ProblemListLoader userProgress={userProgress} />
            </Suspense>
          </div>

          {/* Right Pane (1/3 width): User Info / Welcome */}
          <div className="flex flex-col gap-6">
            <Card className="w-full shadow-md bg-card border border-border">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Code className="h-8 w-8" />
                </div>
                <CardTitle className="text-center text-2xl font-bold text-card-foreground">
                  {userProfile ? `Welcome back, ${userProfile.displayName?.split(' ')[0] || 'Coder'}!` : 'Welcome to CodeLeap!'}
                </CardTitle>
                <CardDescription className="text-center mt-1 text-muted-foreground">
                   {userProfile ? 'Ready to tackle a new challenge?' : 'Select a problem from the list to start coding.'}
                </CardDescription>
              </CardHeader>
               {/* Always show the progress section, even if logged out (shows 0 solves) */}
               <CardContent>
                   <h3 className="text-lg font-semibold mb-4 text-card-foreground text-center">
                       {userProfile ? 'Your Progress (Last 6 Months)' : 'Progress Overview (Last 6 Months)'}
                   </h3>
                   {/* Pass fetched or default data to the chart */}
                   <UserProgress data={progressChartData} />
               </CardContent>
            </Card>
             {/* Add other widgets like "Daily Challenge", "Featured Content", etc. */}
              <Card className="w-full shadow-md bg-card border border-border">
                   <CardHeader>
                       <CardTitle className="text-lg font-semibold">Daily Challenge</CardTitle>
                       <CardDescription>Solve today's featured problem!</CardDescription>
                   </CardHeader>
                   <CardContent>
                       {/* TODO: Fetch and display daily challenge */}
                       <p className="text-sm text-muted-foreground">Daily challenge feature coming soon!</p>
                       {/* You could add a link to a random problem here */}
                       <Button size="sm" variant="outline" className="mt-3" asChild>
                          <Link href="/problems">Pick a Random Problem</Link>
                       </Button>
                   </CardContent>
               </Card>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}


// Separate async component to fetch problems (remains Server Component)
async function ProblemListLoader({ userProgress }: { userProgress: UserProblemStatus }) {
   // Fetch only a subset of problems for the homepage
  const allProblems = await getProblems();
  const problems = allProblems.slice(0, 10); // Show first 10 problems
  // Pass problems and progress directly to ProblemList.
  // ProblemList is now a Client Component, but receives server-fetched props.
  return <ProblemList problems={problems} userProgress={userProgress} />;
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
      {[...Array(5)].map((_, i) => ( // Reduced skeleton rows for homepage
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
