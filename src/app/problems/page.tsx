// src/app/problems/page.tsx
import { getProblems, type Problem } from '@/services/leetcode';
import { ProblemList } from '@/components/problem-list'; // ProblemList is now a client component
import { Header } from '@/components/header';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ListFilter, Search } from 'lucide-react';
import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import type { UserProblemStatus } from '@/types';
import { TooltipProvider } from '@/components/ui/tooltip'; // Import TooltipProvider

// This remains a Server Component for the main problems list page layout
export default async function ProblemsPage() {
  // Fetch user progress data server-side
  let userProgress: UserProblemStatus = {};
  try {
    const sessionCookie = cookies().get('session')?.value;
    if (sessionCookie) {
      const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
      const userId = decodedToken.uid;
      const progressDoc = await adminDb.collection('userProgress').doc(userId).get();
      if (progressDoc.exists) {
        const data = progressDoc.data();
        // Ensure we read from the 'problems' map within the document
        userProgress = data?.problems || {};
      }
    }
  } catch (error: any) {
    console.error("Error fetching user progress on problems page:", error.code || error.message);
    // Handle error appropriately, maybe show a message or default state
    // For now, userProgress remains empty, showing all problems as 'Todo'
  }

  // Return the JSX structure directly
  return (
    <TooltipProvider> {/* Wrap with TooltipProvider */}
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-6">
                <h1 className="text-2xl font-bold mb-6 text-primary border-b pb-3">Problemset</h1>

                {/* Filtering and Search Controls - These need client-side state */}
                {/* Wrap controls in a client component later for interactivity */}
                <div className="mb-6 flex flex-wrap items-center gap-4 p-4 border rounded-lg bg-muted/30">
                    <div className="relative flex-grow sm:flex-grow-0 sm:w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                        type="search"
                        placeholder="Search problems by title or tag..."
                        className="pl-9 h-9 w-full md:w-64"
                        // Client-side: Needs state and onChange
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap justify-start md:justify-end flex-grow">
                        <Select /* Client-side: Needs state and onValueChange */ >
                            <SelectTrigger className="h-9 w-full sm:w-[140px] text-sm bg-background">
                            <SelectValue placeholder="Difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="all">All Difficulties</SelectItem>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select /* Client-side: Needs state and onValueChange */ >
                            <SelectTrigger className="h-9 w-full sm:w-[140px] text-sm bg-background">
                            <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="solved">Solved</SelectItem>
                            <SelectItem value="attempted">Attempted</SelectItem>
                            <SelectItem value="todo">Todo</SelectItem>
                            </SelectContent>
                        </Select>
                            <Select /* Client-side: Needs state and onValueChange */ >
                            <SelectTrigger className="h-9 w-full sm:w-[140px] text-sm bg-background">
                            <SelectValue placeholder="Tags" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="all">All Tags</SelectItem>
                                {/* TODO: Populate tags dynamically */}
                            <SelectItem value="array">Array</SelectItem>
                            <SelectItem value="string">String</SelectItem>
                            <SelectItem value="hash-table">Hash Table</SelectItem>
                            <SelectItem value="dp">Dynamic Programming</SelectItem>
                            <SelectItem value="binary-search">Binary Search</SelectItem>
                            {/* Add more relevant tags */}
                            </SelectContent>
                        </Select>
                         {/* Comment removed, can add filter button here if needed */}
                    </div>
                </div>

                {/* Problem List Table */}
                {/* ProblemListLoader fetches data and passes it to ProblemList */}
                <Suspense fallback={<ProblemListSkeleton />}>
                <ProblemListLoader userProgress={userProgress} />
                </Suspense>
            </main>
        </div>
    </TooltipProvider>
  );
}

// Separate async component to fetch problems (Server Component)
async function ProblemListLoader({ userProgress }: { userProgress: UserProblemStatus }) {
  const problems = await getProblems();
  // Pass server-fetched problems and userProgress to the client component ProblemList.
  // Filtering/sorting based on *server-side* controls (like URL params) could happen here.
  // Client-side filtering will happen within ProblemList.
  return <ProblemList problems={problems} userProgress={userProgress} />;
}

// Skeleton loader for the problem list table
function ProblemListSkeleton() {
  return (
    <div className="space-y-2 border rounded-lg p-4">
      {/* Skeleton Header */}
      <div className="flex justify-between items-center h-10 border-b">
         <Skeleton className="h-4 w-[5%]" /> {/* Status */}
         <Skeleton className="h-4 w-[50%]" /> {/* Title */}
         <Skeleton className="h-4 w-[15%]" /> {/* Acceptance */}
         <Skeleton className="h-4 w-[15%]" /> {/* Difficulty */}
         <Skeleton className="h-4 w-[15%]" /> {/* Tags */}
      </div>
       {/* Skeleton Rows */}
      {[...Array(15)].map((_, i) => ( // Show more skeleton rows
        <div key={i} className="flex justify-between items-center h-12 border-b last:border-b-0">
           <Skeleton className="h-4 w-[5%]" />
           <Skeleton className="h-4 w-[50%]" />
           <Skeleton className="h-4 w-[15%]" />
           <Skeleton className="h-4 w-[15%]" />
           <Skeleton className="h-4 w-[15%]" />
        </div>
      ))}
    </div>
  );
}
