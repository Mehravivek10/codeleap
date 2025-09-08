'use client';

import React from 'react';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import type { Problem, Example } from '@/types/leetcode';
import { CodeEditorClient } from '@/components/code-editor-client';

interface ProblemClientProps {
  problem: Problem;
  userId: string | null; // Can be null from the server
}

export default function ProblemClient({ problem, userId }: ProblemClientProps) {
  // Ensure we have a valid problem object
  if (!problem) {
    return <div>Problem not found</div>;
  }
  return (
    <div className="flex-1 p-4 md:p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{problem.title}</h1>
          <div className="prose dark:prose-invert">
            {problem.statement}
          </div>
          {problem.difficulty && (
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
              problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
              problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {problem.difficulty}
            </span>
          )}
          {problem.tags && problem.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {problem.tags.map((tag, i) => (
                <span key={i} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {problem.examples && problem.examples.length > 0 && (
            <div className="space-y-2 mt-6">
              <h3 className="font-semibold">Examples:</h3>
              {problem.examples.map((example, i) => (
                <Alert key={i} className="mt-2">
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Example {i + 1}</AlertTitle>
                  <div className="mt-2 bg-muted p-2 rounded text-sm font-mono">
                    <div>Input: {example.input}</div>
                    <div>Output: {example.output}</div>
                    {example.explanation && (
                      <div className="mt-1 text-muted-foreground">
                        Explanation: {example.explanation}
                      </div>
                    )}
                  </div>
                </Alert>
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <CodeEditorClient 
            problemSlug={problem.slug}
            code={`// Your solution for ${problem.title}`}
            userId={userId || undefined} // Convert null to undefined to match the expected type
            problemTitle={problem.title}
            problemStatement={problem.statement}
          />
        </div>
      </div>
    </div>
  );
}
