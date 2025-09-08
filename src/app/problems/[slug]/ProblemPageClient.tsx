'use client';

import dynamic from 'next/dynamic';
import type { Problem } from '@/types/leetcode';

const ProblemClient = dynamic(
  () => import('./ProblemClient'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse">Loading problem...</div>
      </div>
    )
  }
);

interface ProblemPageClientProps {
  problem: Problem;
  userId: string | null;
}

export function ProblemPageClient({ problem, userId }: ProblemPageClientProps) {
  return <ProblemClient problem={problem} userId={userId} />;
}
