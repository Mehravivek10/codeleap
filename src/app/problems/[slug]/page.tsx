
import type { Problem } from '@/services/leetcode';
import { getProblemBySlug, getProblems } from '@/services/leetcode';
import { CodeEditor } from '@/components/code-editor';
import { Header } from '@/components/header';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { notFound } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cookies } from 'next/headers'; // Import cookies
import { adminAuth } from '@/lib/firebase/admin'; // Import admin SDK
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert
import { Terminal } from "lucide-react"; // Import icon for Alert
import Link from 'next/link'; // Import Link
import { Button } from '@/components/ui/button'; // Import Button
import { TooltipProvider } from '@/components/ui/tooltip'; // Import TooltipProvider

interface ProblemPageProps {
  params: {
    slug: string;
  };
}

// This is a Server Component
export default async function ProblemPage({ params }: ProblemPageProps) {
  const { slug } = params;
  const problem = await getProblemBySlug(slug);
  let userId: string | null = null;

  if (!problem) {
    notFound(); // Show 404 if problem not found
  }

   // Check authentication status server-side
   try {
     const sessionCookie = cookies().get('session')?.value;
     if (sessionCookie) {
       const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
       userId = decodedToken.uid;
     }
   } catch (error) {
     console.log("Session verification failed on problem page (user not logged in or invalid session)");
     // User is not logged in or session is invalid, userId remains null
   }


  return (
    <TooltipProvider> {/* Wrap with TooltipProvider */}
        <div className="flex flex-col h-screen bg-background text-foreground">
        <Header />
        <main className="flex-grow split-screen overflow-hidden">
            {/* Left Pane: Problem Details */}
            <ScrollArea className="problem-pane border-r border-border">
            {/* Content from CodeEditor's header section moved here */}
            <div className="p-6">
                <h1 className="text-2xl font-semibold text-primary mb-1">{problem.title}</h1>
                <div className='flex items-center gap-2 mb-4'>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        problem.difficulty === 'Easy' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                        problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                        'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    }`}>
                    {problem.difficulty}
                    </span>
                    {/* Add other badges like acceptance rate, premium status if needed */}
                </div>
                <div className="prose dark:prose-invert max-w-none text-foreground/90">
                    {/* Render problem statement using Markdown or directly */}
                    {/* For now, basic rendering */}
                    <p className="whitespace-pre-wrap">{problem.statement}</p>
                    {/* TODO: Add Examples, Constraints, etc. here */}
                    {/* Example rendering */}
                    <h3 className="font-semibold mt-5 mb-2 text-foreground">Examples:</h3>
                    <pre className="bg-muted text-muted-foreground p-3 rounded text-sm">
                        <code>
                        Example 1: ... {'\n'}
                        Input: ... {'\n'}
                        Output: ...
                        </code>
                    </pre>
                    <h3 className="font-semibold mt-5 mb-2 text-foreground">Constraints:</h3>
                    <ul className="list-disc list-inside text-sm text-foreground/80">
                        <li>Constraint 1...</li>
                        <li>Constraint 2...</li>
                    </ul>

                </div>
            </div>
            </ScrollArea>

            {/* Right Pane: Code Editor or Login Prompt */}
            <div className="editor-pane p-0"> {/* Remove padding */}
            {userId ? (
                // User is logged in, show the editor
                <CodeEditor
                userId={userId} // Pass userId to editor
                problemTitle={problem.title}
                problemStatement={problem.statement}
                problemSlug={problem.slug}
                />
            ) : (
                // User is not logged in, show a prompt
                <div className="flex flex-col items-center justify-center h-full p-6 bg-muted/30">
                    <Alert className="max-w-md text-center border-primary/30 bg-background">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle className="font-semibold">Login Required</AlertTitle>
                        <AlertDescription className="text-muted-foreground">
                            Please log in or sign up to write and submit your solution.
                        </AlertDescription>
                        <div className="mt-4">
                            {/* Ideally, trigger the AuthDialog from Header instead of linking */}
                            <Button size="sm" asChild>
                                {/* This link might not work well if AuthDialog is the preferred method */}
                                <Link href="/?auth=true">Login / Sign Up</Link>
                            </Button>
                        </div>
                    </Alert>
                </div>
            )}
            </div>
        </main>
        </div>
    </TooltipProvider>
  );
}


// Optional: Generate static paths if you want to pre-render problem pages
export async function generateStaticParams() {
  const problems = await getProblems();
  return problems.map((problem) => ({
    slug: problem.slug,
  }));
}

// Optional: Metadata for the page
export async function generateMetadata({ params }: ProblemPageProps) {
  const problem = await getProblemBySlug(params.slug);
  return {
    title: `${problem?.title || 'Problem'} | CodeLeap`,
    description: `Solve the ${problem?.title || 'coding problem'} on CodeLeap. Difficulty: ${problem?.difficulty || ''}.`,
  };
}
