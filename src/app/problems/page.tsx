// src/app/problems/page.tsx
'use client'; // Convert to Client Component for state management

import { getProblems, type Problem } from '@/services/leetcode';
import { ProblemList } from '@/components/problem-list';
import { Header } from '@/components/header';
import { Suspense, useState, useEffect, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ListFilter, Loader2, Search } from 'lucide-react';
import type { UserProblemStatus, ProblemStatus, ProblemStatusDetail } from '@/types';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useAuth } from '@/context/auth-context'; // Use client-side auth context
import { firestore } from '@/lib/firebase/client'; // Use client-side firestore
import { doc, getDoc } from 'firebase/firestore';

// Define filter types
type DifficultyFilter = 'all' | 'easy' | 'medium' | 'hard';
type StatusFilter = 'all' | 'solved' | 'attempted' | 'todo';
type TagFilter = string; // 'all' or specific tag

// This is now a Client Component
export default function ProblemsPage() {
  const { user } = useAuth(); // Get user from client context
  const [problems, setProblems] = useState<Problem[]>([]);
  const [userProgress, setUserProgress] = useState<UserProblemStatus>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [tagFilter, setTagFilter] = useState<TagFilter>('all');
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // Fetch problems and user progress on component mount
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Fetch all problems
        const fetchedProblems = await getProblems();
        setProblems(fetchedProblems);

        // Extract unique tags
        const allTags = new Set<string>();
        fetchedProblems.forEach(p => p.tags?.forEach(tag => allTags.add(tag)));
        setAvailableTags(Array.from(allTags).sort());

        // Fetch user progress if logged in
        if (user) {
          const progressDocRef = doc(firestore, 'userProgress', user.uid);
          const progressDocSnap = await getDoc(progressDocRef);
          if (progressDocSnap.exists()) {
            const data = progressDocSnap.data();
            setUserProgress(data?.problems || {});
          } else {
            setUserProgress({}); // Set empty if no progress doc exists
          }
        } else {
          setUserProgress({}); // Clear progress if user logs out
        }
      } catch (error: any) {
        console.error("Error fetching data on problems page:", error.code || error.message);
        // Handle error appropriately, maybe show a toast message
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [user]); // Re-fetch data when user changes

  const getProblemStatus = (problemSlug: string): ProblemStatus | 'Todo' => {
    const statusData = userProgress[problemSlug];
    if (typeof statusData === 'object' && statusData !== null && 'status' in statusData) {
      return statusData.status;
    }
    if (statusData === 'Solved' || statusData === 'Attempted' || statusData === 'Todo') {
      return statusData;
    }
    return 'Todo';
  };

  // Memoized filtered problems
  const filteredProblems = useMemo(() => {
    return problems.filter(problem => {
      // Search term filter (case-insensitive)
      const titleMatch = problem.title.toLowerCase().includes(searchTerm.toLowerCase());
      const tagMatch = problem.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const searchMatch = searchTerm === '' || titleMatch || tagMatch;

      // Difficulty filter
      const difficultyMatch = difficultyFilter === 'all' || problem.difficulty.toLowerCase() === difficultyFilter;

      // Status filter
      const currentStatus = getProblemStatus(problem.slug);
      const statusMatch = statusFilter === 'all' || currentStatus.toLowerCase() === statusFilter;

      // Tag filter
      const tagFilterMatch = tagFilter === 'all' || problem.tags?.includes(tagFilter);

      return searchMatch && difficultyMatch && statusMatch && tagFilterMatch;
    });
  }, [problems, userProgress, searchTerm, difficultyFilter, statusFilter, tagFilter]);


  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-6 text-primary border-b pb-3">Problemset</h1>

          {/* Filtering and Search Controls */}
          <div className="mb-6 flex flex-wrap items-center gap-4 p-4 border rounded-lg bg-muted/30">
            <div className="relative flex-grow sm:flex-grow-0 sm:w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search problems by title or tag..."
                className="pl-9 h-9 w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap justify-start md:justify-end flex-grow">
              <Select value={difficultyFilter} onValueChange={(value) => setDifficultyFilter(value as DifficultyFilter)}>
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
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
                <SelectTrigger className="h-9 w-full sm:w-[140px] text-sm bg-background" disabled={!user}>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="solved">Solved</SelectItem>
                  <SelectItem value="attempted">Attempted</SelectItem>
                  <SelectItem value="todo">Todo</SelectItem>
                </SelectContent>
              </Select>
              <Select value={tagFilter} onValueChange={(value) => setTagFilter(value as TagFilter)}>
                <SelectTrigger className="h-9 w-full sm:w-[140px] text-sm bg-background">
                  <SelectValue placeholder="Tags" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {availableTags.map(tag => (
                     <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
               {/* Filter button could be added here if more complex filters are needed */}
            </div>
          </div>

          {/* Problem List Table */}
          {isLoading ? (
            <ProblemListSkeleton />
          ) : (
            <ProblemList problems={filteredProblems} userProgress={userProgress} />
          )}
        </main>
      </div>
    </TooltipProvider>
  );
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
