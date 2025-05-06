'use client'; // ProblemList remains a client component

import Link from 'next/link';
import type { Problem } from '@/services/leetcode';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { CheckCircle2, Pencil, Minus } from 'lucide-react'; // Use Minus for Todo
import type { UserProblemStatus, ProblemStatus, ProblemStatusDetail } from '@/types'; // Import types
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"; // Import Tooltip components

interface ProblemListProps {
  problems: Problem[];
  userProgress: UserProblemStatus; // Receive pre-fetched or client-fetched user progress
}

export function ProblemList({ problems, userProgress }: ProblemListProps) {

  const getDifficultyClass = (difficulty: string): string => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'text-green-600 dark:text-green-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'hard':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-muted-foreground';
    }
  };

   // Get status from userProgress prop
   const getProblemStatusData = (problemSlug: string): ProblemStatus | 'Todo' => {
        const statusData = userProgress[problemSlug];
         // Check if statusData is an object with a 'status' property or just the status string
         if (typeof statusData === 'object' && statusData !== null && 'status' in statusData) {
             return statusData.status; // Extract status if it's an object like { status: 'Solved', solvedAt: ... }
         }
         // Explicitly check for legacy status strings
         if (statusData === 'Solved' || statusData === 'Attempted' || statusData === 'Todo') {
             return statusData;
         }
         return 'Todo'; // Default to 'Todo' if data is missing or in unexpected format
   };

  return (
    <div className="relative w-full overflow-x-auto border rounded-lg shadow-sm"> {/* Added shadow */}
       <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50"> {/* Subtle header background */}
              <TableHead className="w-[5%] pl-3 text-center">Status</TableHead> {/* Added pl-3 */}
              <TableHead className="w-[50%] px-3">Title</TableHead> {/* Added padding */}
              <TableHead className="w-[15%] text-center px-3">Acceptance</TableHead> {/* Added padding */}
              <TableHead className="w-[15%] text-center px-3">Difficulty</TableHead> {/* Added padding */}
               <TableHead className="w-[15%] text-center pr-3">Tags</TableHead> {/* Added pr-3 */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {problems.map((problem) => {
                const status = getProblemStatusData(problem.slug);
                return (
                  <TableRow
                    key={problem.slug}
                    className={cn(
                      'hover:bg-muted/40 transition-colors duration-150'
                    )}
                  >
                    <TableCell className="pl-3 text-center py-2.5"> {/* Adjusted padding */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                           <span className="inline-flex items-center justify-center">
                             {status === 'Solved' ? (
                               <CheckCircle2 className="h-4 w-4 text-green-500" />
                             ) : status === 'Attempted' ? (
                               <Pencil className="h-4 w-4 text-yellow-500" />
                             ) : (
                               <Minus className="h-4 w-4 text-muted-foreground/50" /> // Use Minus icon for Todo
                             )}
                           </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{status}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="font-medium py-2.5 px-3"> {/* Adjusted padding */}
                      <Link
                        href={`/problems/${problem.slug}`}
                        className="hover:text-primary hover:underline transition-colors decoration-primary/50 underline-offset-2"
                        prefetch={false} // Keep prefetch off unless necessary
                      >
                        {problem.title}
                      </Link>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground text-xs py-2.5 px-3"> {/* Adjusted padding */}
                      {problem.acceptance || 'N/A'}
                    </TableCell>
                    <TableCell className={cn("text-center text-xs font-medium py-2.5 px-3", getDifficultyClass(problem.difficulty))}> {/* Adjusted padding */}
                      {problem.difficulty}
                    </TableCell>
                    <TableCell className="text-center text-xs py-2.5 pr-3"> {/* Adjusted padding */}
                      {problem.tags && problem.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1 justify-center">
                          {problem.tags.slice(0, 2).map(tag => ( // Show max 2 tags
                            <Tooltip key={tag}>
                               <TooltipTrigger asChild>
                                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 cursor-pointer hover:bg-muted">{tag}</Badge>
                               </TooltipTrigger>
                               <TooltipContent side="top">
                                 <p>Tag: {tag}</p>
                               </TooltipContent>
                            </Tooltip>
                          ))}
                          {problem.tags.length > 2 && (
                             <Tooltip>
                               <TooltipTrigger asChild>
                                   <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 cursor-default">...</Badge>
                               </TooltipTrigger>
                               <TooltipContent side="top">
                                 <p>More tags...</p>
                               </TooltipContent>
                             </Tooltip>
                          )}
                        </div>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                  </TableRow>
                );
            })}
            {/* Add empty state if problems array is empty */}
            {problems.length === 0 && (
                 <TableRow>
                     <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                         No problems found matching your criteria.
                     </TableCell>
                 </TableRow>
             )}
          </TableBody>
        </Table>
    </div>
  );
}
