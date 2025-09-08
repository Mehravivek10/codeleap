'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
// Define the CodeEditorProps interface
export interface CodeEditorProps {
  code?: string;
  onChange?: (value: string) => void;
  language?: string;
  theme?: string;
  userId?: string;
  problemTitle?: string;
  problemStatement?: string;
  problemSlug: string;
}

// Dynamically import the CodeEditor component with SSR disabled
const CodeEditor = dynamic<CodeEditorProps>(
  () => import('./code-editor').then((mod) => mod.CodeEditor),
  { 
    ssr: false,
    loading: () => (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-[500px] w-full">
        <div className="p-4 space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <div className="p-4 border-t">
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    )
  }
);

export function CodeEditorClient(props: CodeEditorProps) {
  return <CodeEditor {...props} />;
}
