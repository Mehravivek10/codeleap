'use client';

import { useState, useEffect } from 'react';
import { CodeEditor } from '@/components/code-editor';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { Problem } from '@/services/leetcode';

interface ProblemViewProps {
  problem: Problem;
  userId: string | null;
}

export function ProblemView({ problem, userId }: ProblemViewProps) {
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState('javascript');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    status: 'success' | 'error' | null;
    message: string;
  }>({ status: null, message: '' });

  const handleSubmit = async () => {
    if (!userId) {
      setSubmissionResult({
        status: 'error',
        message: 'You must be logged in to submit solutions.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Replace with your actual submission logic
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problemId: problem.slug,
          code,
          language,
          userId,
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setSubmissionResult({
          status: 'success',
          message: 'Solution submitted successfully!',
        });
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionResult({
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to submit solution',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen bg-background text-foreground">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex overflow-hidden">
            {/* Problem Description */}
            <div className="w-1/2 flex flex-col border-r">
              <ScrollArea className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-4">{problem.title}</h1>
                <div 
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: problem.statement || 'No content available' }}
                />
              </ScrollArea>
            </div>

            {/* Code Editor */}
            <div className="w-1/2 flex flex-col">
              <div className="p-2 border-b flex justify-between items-center">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-background border rounded px-2 py-1 text-sm"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
                <div className="space-x-2">
                  <Button variant="outline" size="sm">
                    Run Code
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={isSubmitting || !userId}
                    size="sm"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </Button>
                </div>
              </div>
              <div className="flex-1">
                <CodeEditor
                  code={code}
                  onChange={setCode}
                  language={language}
                  theme="vs-dark"
                  problemSlug={problem.slug}
                  problemTitle={problem.title}
                  problemStatement={problem.statement}
                  userId={userId || undefined}
                />
              </div>
            </div>
          </div>

          {/* Submission Result */}
          {submissionResult.status && (
            <div className="border-t p-4">
              <Alert variant={submissionResult.status === 'success' ? 'default' : 'destructive'}>
                <Terminal className="h-4 w-4" />
                <AlertTitle>
                  {submissionResult.status === 'success' ? 'Success' : 'Error'}
                </AlertTitle>
                <AlertDescription>
                  {submissionResult.message}
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
