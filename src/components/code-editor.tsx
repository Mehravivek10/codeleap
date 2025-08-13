'use client';

import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { generateProblemHints, type GenerateProblemHintsInput } from '@/ai/flows/generate-problem-hints';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Lightbulb, Loader2, Play, Settings, Upload, History } from 'lucide-react'; // Added History
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { firestore } from '@/lib/firebase/client'; // Import Firestore client instance
import { collection, addDoc, Timestamp, doc, setDoc, updateDoc, increment, getDoc, query, where, orderBy, limit, getDocs } from 'firebase/firestore'; // Import Firestore functions
import type { ProblemStatus, ProblemStatusDetail, Submission } from '@/types'; // Import types
import { ScrollArea } from '@/components/ui/scroll-area'; // For potential future output scrolling
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog" // For Submission History
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'; // Import Tooltip
import { formatDistanceToNow } from 'date-fns'; // For Submission History
import Editor from '@monaco-editor/react';


interface CodeEditorProps {
  userId: string; // Added userId prop
  problemTitle: string;
  problemStatement: string; // Keep statement for hint generation context
  problemSlug: string;
}

// Mock function to simulate code execution (replace with actual execution logic)
async function mockExecuteCode(code: string, language: string, problemSlug: string): Promise<Omit<Submission, 'id' | 'userId' | 'problemTitle' | 'submittedAt'>> {
    console.log(`Executing code for ${problemSlug} in ${language}`);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate execution time

    // Mock results - adjust probabilities and details as needed
    const rand = Math.random();
    let status: Submission['status'] = 'Pending';
    let runtime = null;
    let memory = null;
    let output = null;
    let error = null;
    let testCasesPassed = null;
    let totalTestCases = 5; // Example total

    if (rand < 0.6) { // 60% chance of Accepted
        status = 'Accepted';
        runtime = Math.floor(Math.random() * 500) + 50; // 50-550 ms
        memory = Math.floor(Math.random() * 10000) + 5000; // 5000-15000 KB
        testCasesPassed = totalTestCases;
        output = `All ${totalTestCases} test cases passed.`;
    } else if (rand < 0.85) { // 25% chance of Wrong Answer
        status = 'Wrong Answer';
        runtime = Math.floor(Math.random() * 400) + 40;
        memory = Math.floor(Math.random() * 9000) + 4000;
        testCasesPassed = Math.floor(Math.random() * totalTestCases);
        output = `Test case ${testCasesPassed + 1} failed.\nExpected: [...], Got: [...]`;
        error = `AssertionError: Expected output did not match at line X.`;
    } else { // 15% chance of Runtime Error / TLE
        status = Math.random() > 0.5 ? 'Runtime Error' : 'Time Limit Exceeded';
        runtime = status === 'Time Limit Exceeded' ? 2000 : Math.floor(Math.random() * 300) + 30;
        memory = Math.floor(Math.random() * 8000) + 3000;
        testCasesPassed = Math.floor(Math.random() * (totalTestCases -1)); // Fail before finishing
        output = `Execution failed on test case ${testCasesPassed + 1}.`;
        error = status === 'Time Limit Exceeded' ? 'Time Limit Exceeded on test case X' : 'Runtime Error: Division by zero on line Y';
    }


    return {
        language,
        code, // Include submitted code
        status,
        runtime,
        memory,
        output,
        error,
        testCasesPassed,
        totalTestCases,
        problemSlug, // Include slug for reference
    };
}


export function CodeEditor({ userId, problemTitle, problemStatement, problemSlug }: CodeEditorProps) {
  const { toast } = useToast();
  const [isLoadingHint, setIsLoadingHint] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState<string>('Console Output / Test Results will appear here...');
  const [outputType, setOutputType] = useState<'info' | 'success' | 'error' | 'warning'>('info'); // Added 'warning'

  // Function to update user progress in Firestore, now storing more details
  const updateUserProgress = async (newStatus: ProblemStatus) => {
      if (!userId) return;
      const progressRef = doc(firestore, 'userProgress', userId);
      const fieldPath = `problems.${problemSlug}`; // Path to the specific problem's status object

      try {
           // Fetch current progress to avoid overwriting timestamps unnecessarily
           const currentProgressSnap = await getDoc(progressRef);
           const currentData = currentProgressSnap.data()?.problems?.[problemSlug] as ProblemStatusDetail | ProblemStatus | undefined;
           const currentStatus = typeof currentData === 'object' ? currentData?.status : currentData;

           const newStatusDetail: ProblemStatusDetail = {
                status: newStatus,
                // Preserve existing solvedAt timestamp if already solved
                solvedAt: (newStatus === 'Solved' ? Timestamp.now() : (currentStatus === 'Solved' && typeof currentData === 'object' ? currentData.solvedAt : null)),
                lastAttemptedAt: Timestamp.now(), // Always update last attempted time
           };

           // Only update if the status is changing or it's the first time setting it
           if (typeof currentData === 'undefined' || newStatus !== currentStatus || newStatus === 'Attempted') {
                await setDoc(progressRef, {
                     problems: {
                        [problemSlug]: newStatusDetail
                     }
                }, { merge: true }); // merge: true is crucial here
                console.log(`User progress updated for ${problemSlug}:`, newStatusDetail);
           }

      } catch (error) {
          console.error("Error updating user progress:", error);
          toast({
                title: 'Error Saving Progress',
                description: 'Could not update your progress status.',
                variant: 'destructive',
          });
      }
  };


  const handleSubmit = async () => {
    if (!userId) {
        toast({ title: 'Login Required', description: 'Please log in to submit your solution.', variant: 'destructive' });
        return;
    }
    if (code.trim() === '') {
         toast({ title: 'Empty Code', description: 'Cannot submit empty code.', variant: 'destructive' });
         return;
     }

    setIsSubmitting(true);
    setOutput(`Submitting solution in ${language}...`);
    setOutputType('info');

    try {
        // --- Execute Code (Replace mock with real execution) ---
        const executionResult = await mockExecuteCode(code, language, problemSlug);
        // --- End Execution Logic ---

        const submissionData: Omit<Submission, 'id' | 'submittedAt'> & { submittedAt: Timestamp } = {
            userId: userId,
            problemSlug: problemSlug,
            problemTitle: problemTitle,
            language: executionResult.language,
            code: executionResult.code, // Storing code - consider implications
            status: executionResult.status,
            submittedAt: Timestamp.now(), // Use server timestamp equivalent on client
            runtime: executionResult.runtime,
            memory: executionResult.memory,
            output: executionResult.output,
            error: executionResult.error,
            testCasesPassed: executionResult.testCasesPassed,
            totalTestCases: executionResult.totalTestCases,
        };

        // 1. Save submission details to Firestore
        const submissionsCollection = collection(firestore, 'submissions');
        const submissionRef = await addDoc(submissionsCollection, submissionData);
        console.log("Submission saved with ID:", submissionRef.id);

        // 2. Update user progress based on the result
        let newProblemStatus: ProblemStatus = 'Attempted';
        if (executionResult.status === 'Accepted') {
            newProblemStatus = 'Solved';
        }
        await updateUserProgress(newProblemStatus);

        // 3. Show feedback to user
        const isSuccess = executionResult.status === 'Accepted';
        toast({
            title: `Submission ${executionResult.status}`,
            description: isSuccess ? `Your solution for ${problemTitle} was accepted!` : `Submission failed. ${executionResult.error || ''}`,
            variant: isSuccess ? 'default' : 'destructive',
            duration: isSuccess ? 5000 : 7000,
        });

        // Update output panel
         let outputText = `Status: ${executionResult.status}\n`;
         if (executionResult.runtime !== null) outputText += `Runtime: ${executionResult.runtime} ms\n`;
         if (executionResult.memory !== null) outputText += `Memory: ${executionResult.memory} KB\n`;
         if (executionResult.testCasesPassed !== null && executionResult.totalTestCases !== null) {
             outputText += `Test Cases: ${executionResult.testCasesPassed} / ${executionResult.totalTestCases} passed\n`;
         }
         if (executionResult.output) outputText += `\nOutput:\n${executionResult.output}\n`;
         if (executionResult.error) outputText += `\nError:\n${executionResult.error}\n`;

        setOutput(outputText);
        setOutputType(isSuccess ? 'success' : 'error');

    } catch (error) {
        console.error('Error during submission process:', error);
        toast({
            title: 'Submission Error',
            description: 'An unexpected error occurred during submission. Please try again.',
            variant: 'destructive',
        });
         setOutput('Error during submission.');
         setOutputType('error');
    } finally {
        setIsSubmitting(false);
    }
  };


  const handleRunCode = async () => {
     if (!userId) {
         toast({ title: 'Login Required', description: 'Please log in to run code.', variant: 'destructive' });
         return;
     }
      if (code.trim() === '') {
          toast({ title: 'Empty Code', description: 'Cannot run empty code.', variant: 'destructive' });
          return;
      }

     setIsRunning(true);
     setOutput(`Running code with test cases for ${problemTitle}...`);
     setOutputType('info');

     try {
         // --- Execute Code against sample test cases (Replace mock) ---
         // Typically, "Run" uses simpler, predefined test cases compared to "Submit"
         const executionResult = await mockExecuteCode(code, language, problemSlug); // Use same mock for simplicity
         // --- End Execution Logic ---

         // Update user progress to 'Attempted' only if not already 'Solved'
         // Fetch current status first to check if already solved
         const progressRef = doc(firestore, 'userProgress', userId);
         const currentProgressSnap = await getDoc(progressRef);
         const currentStatus = currentProgressSnap.data()?.problems?.[problemSlug]?.status;

         if (currentStatus !== 'Solved') {
             await updateUserProgress('Attempted');
         }


          // Update output panel (similar to submit, but might show different test cases)
          let outputText = `Run Result: ${executionResult.status}\n`;
          if (executionResult.runtime !== null) outputText += `Runtime: ${executionResult.runtime} ms\n`;
          if (executionResult.memory !== null) outputText += `Memory: ${executionResult.memory} KB\n`;
          // Usually "Run" might not show detailed pass/fail counts like submit
          if (executionResult.output) outputText += `\nConsole Output:\n${executionResult.output}\n`;
          if (executionResult.error) outputText += `\nError:\n${executionResult.error}\n`;

          setOutput(outputText);
          setOutputType(executionResult.status === 'Accepted' ? 'success' : executionResult.status.includes('Error') || executionResult.status.includes('Wrong') ? 'error' : 'info');


     } catch (error) {
         console.error('Error running code:', error);
         toast({
             title: 'Run Error',
             description: 'Could not run code against test cases.',
             variant: 'destructive',
         });
          setOutput('Error running code.');
          setOutputType('error');
     } finally {
         setIsRunning(false);
     }
  };

  const handleGetHint = async () => {
    setIsLoadingHint(true);
    setOutput('Generating AI hint...');
    setOutputType('info');
    try {
      const input: GenerateProblemHintsInput = {
        problemTitle: problemTitle,
        problemStatement: problemStatement, // Provide context
      };
      const result = await generateProblemHints(input);
      toast({
        title: '💡 Hint',
        description: result.hint,
        variant: 'default', // Use default style for hints
        duration: 8000, // Give more time to read hint
      });
       setOutput(`Hint: ${result.hint}`);
       setOutputType('info');
    } catch (error) {
      console.error('Error getting hint:', error);
      toast({
        title: 'Hint Error',
        description: 'Could not generate hint. The AI might be busy or unavailable.',
        variant: 'destructive',
      });
      setOutput('Error generating hint.');
      setOutputType('error');
    } finally {
      setIsLoadingHint(false);
    }
  };


  return (
    <Card className="flex flex-col h-full shadow-none border-none rounded-none overflow-hidden bg-card">
      {/* Editor Actions Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/40">
            <div className="flex items-center gap-2">
                 <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="h-8 w-[130px] text-xs focus:ring-1 focus:ring-offset-0 border-border bg-background focus:ring-ring">
                        <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="cpp">C++</SelectItem>
                        <SelectItem value="go">Go</SelectItem>
                        <SelectItem value="rust">Rust</SelectItem>
                         <SelectItem value="typescript">TypeScript</SelectItem>
                    </SelectContent>
                </Select>
                <Tooltip>
                    <TooltipTrigger asChild>
                         <Button
                             variant="ghost"
                             size="icon"
                             onClick={handleGetHint}
                             disabled={isLoadingHint || isSubmitting || isRunning}
                             aria-label="Get AI Hint"
                             className="h-8 w-8 text-muted-foreground hover:text-accent hover:bg-accent/10"
                          >
                             {isLoadingHint ? (
                             <Loader2 className="h-4 w-4 animate-spin" />
                             ) : (
                             <Lightbulb className="h-4 w-4" />
                             )}
                         </Button>
                     </TooltipTrigger>
                     <TooltipContent side="bottom">
                         <p>Get AI Hint</p>
                     </TooltipContent>
                </Tooltip>
                 {/* Submission History Button */}
                 <Dialog>
                     <DialogTrigger asChild>
                         <Tooltip>
                             <TooltipTrigger asChild>
                                 <Button
                                     variant="ghost"
                                     size="icon"
                                     disabled={isSubmitting || isRunning}
                                     aria-label="View Submission History"
                                     className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                 >
                                     <History className="h-4 w-4" />
                                 </Button>
                             </TooltipTrigger>
                             <TooltipContent side="bottom">
                                 <p>Submission History</p>
                             </TooltipContent>
                         </Tooltip>
                     </DialogTrigger>
                     <DialogContent className="max-w-3xl">
                         <DialogHeader>
                             <DialogTitle>Submission History: {problemTitle}</DialogTitle>
                             <DialogDescription>
                                 Your past submissions for this problem.
                             </DialogDescription>
                         </DialogHeader>
                         <div className="mt-4 max-h-[60vh] overflow-y-auto">
                              <SubmissionHistory userId={userId} problemSlug={problemSlug} />
                         </div>
                     </DialogContent>
                 </Dialog>

            </div>
             <div className="flex items-center gap-2">
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRunCode}
                      disabled={isSubmitting || isRunning || code.trim() === ''}
                      className="h-8 text-sm"
                  >
                       {isRunning ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Play className="mr-1.5 h-4 w-4" />}
                       Run
                   </Button>
                 <Button
                    variant="secondary" // Changed variant for visual distinction
                    size="sm"
                    onClick={handleSubmit}
                    disabled={isSubmitting || isRunning || code.trim() === ''}
                    className="h-8 text-sm bg-green-600 hover:bg-green-700 text-primary-foreground dark:bg-green-700 dark:hover:bg-green-800" // Keep green for submit
                 >
                    {isSubmitting ? (
                       <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                    ) : (
                       <Upload className="mr-1.5 h-4 w-4" />
                    )}
                    Submit
                 </Button>
             </div>
        </div>


      {/* Editor Area */}
      <CardContent className="flex-grow p-0 relative">
        <Editor
          height="100%"
          defaultLanguage={language}
          language={language}
          theme={typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'vs-dark' : 'light'}
          value={code}
          onChange={(val) => setCode(val ?? '')}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
          }}
        />
      </CardContent>

      {/* Console/Output Area */}
       <CardFooter className="p-0 border-t min-h-[120px] max-h-[40%] flex flex-col bg-muted/30 overflow-hidden">
          <div className="px-3 py-1 border-b border-border text-xs font-medium text-muted-foreground w-full bg-muted/50">
             Console / Output
           </div>
           {/* Wrap output in ScrollArea */}
           <ScrollArea className="w-full h-full flex-grow">
               <pre className={`p-3 text-xs w-full h-full whitespace-pre-wrap font-mono break-words ${
                    outputType === 'success' ? 'text-green-600 dark:text-green-400' :
                    outputType === 'error' ? 'text-red-600 dark:text-red-400' :
                     outputType === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-muted-foreground' // Default 'info'
                 }`}>
                   {output}
                </pre>
            </ScrollArea>
      </CardFooter>
    </Card>
  );
}


// Potential Future Component for Submission History (Example Structure)


interface SubmissionHistoryProps {
  userId: string;
  problemSlug: string;
}

function SubmissionHistory({ userId, problemSlug }: SubmissionHistoryProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(firestore, 'submissions'),
          where('userId', '==', userId),
          where('problemSlug', '==', problemSlug),
          orderBy('submittedAt', 'desc'),
          limit(10) // Limit to last 10 submissions
        );
        const querySnapshot = await getDocs(q);
        const history = querySnapshot.docs.map(doc => {
            const data = doc.data() as Omit<Submission, 'id'>; // Type assertion
             // Ensure submittedAt is converted correctly
             const submittedAt = (data.submittedAt as any)?.toDate ? (data.submittedAt as any).toDate() : new Date(); // Basic fallback
             return {
               id: doc.id,
               ...data,
               submittedAt: new Timestamp(submittedAt.getTime() / 1000, submittedAt.getMilliseconds() * 1000000) // Convert back if needed, or keep as Date
             } as Submission;
         });

        setSubmissions(history);
      } catch (error) {
        console.error("Error fetching submission history:", error);
        // Handle error display
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [userId, problemSlug]);

  if (loading) return <p className="text-sm text-muted-foreground p-4">Loading history...</p>;
  if (submissions.length === 0) return <p className="text-sm text-muted-foreground p-4">No submissions found for this problem yet.</p>;

  return (
    <div className="space-y-3">
      {submissions.map((sub) => (
        <div key={sub.id} className="border p-3 rounded-md bg-card text-xs">
          <div className="flex justify-between items-center mb-1">
             <span className={`font-medium ${
                 sub.status === 'Accepted' ? 'text-green-600 dark:text-green-400' :
                 sub.status.includes('Error') || sub.status.includes('Wrong') ? 'text-red-600 dark:text-red-400' :
                 'text-yellow-600 dark:text-yellow-400' // Pending/Running
              }`}>
              {sub.status}
            </span>
            <span className="text-muted-foreground">
              {sub.submittedAt?.toDate ? formatDistanceToNow(sub.submittedAt.toDate(), { addSuffix: true }) : 'N/A'}
            </span>
          </div>
          <div className="text-muted-foreground">Language: {sub.language}</div>
          {sub.runtime !== null && <div className="text-muted-foreground">Runtime: {sub.runtime} ms</div>}
          {sub.memory !== null && <div className="text-muted-foreground">Memory: {sub.memory} KB</div>}
          {/* Add button to view code maybe */}
        </div>
      ))}
    </div>
  );
}
