// src/app/explore/page.tsx
import { Header } from '@/components/header';
import { getProblemsByCategory, getProblemsByCompany, type Problem } from '@/services/leetcode';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Building, Layers } from 'lucide-react'; // Icons for tabs

// Function to get difficulty class (same as in problem-list)
const getDifficultyClass = (difficulty: string): string => {
    switch (difficulty.toLowerCase()) {
        case 'easy': return 'text-green-600 dark:text-green-400';
        case 'medium': return 'text-yellow-600 dark:text-yellow-400';
        case 'hard': return 'text-red-600 dark:text-red-400';
        default: return 'text-muted-foreground';
    }
};

export default async function ExplorePage() {
    const problemsByCategory = await getProblemsByCategory();
    const problemsByCompany = await getProblemsByCompany();

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6 text-primary border-b pb-3">Explore Problems</h1>

                <Tabs defaultValue="category" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="category">
                             <Layers className="mr-2 h-4 w-4" /> By Category
                        </TabsTrigger>
                        <TabsTrigger value="company">
                            <Building className="mr-2 h-4 w-4" /> By Company
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="category">
                        <Card className="border-border shadow-sm">
                            <CardHeader>
                                <CardTitle>Problems by Category</CardTitle>
                                <CardDescription>Browse questions based on common problem types.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="multiple" className="w-full">
                                    {Object.entries(problemsByCategory).map(([category, problems]) => (
                                        <AccordionItem key={category} value={category}>
                                            <AccordionTrigger className="text-lg font-medium hover:no-underline">
                                                {category} ({problems.length})
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <ProblemGroup problems={problems} />
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="company">
                         <Card className="border-border shadow-sm">
                             <CardHeader>
                                 <CardTitle>Problems by Company</CardTitle>
                                 <CardDescription>Explore questions frequently asked by specific companies.</CardDescription>
                             </CardHeader>
                             <CardContent>
                                <Accordion type="multiple" className="w-full">
                                    {Object.entries(problemsByCompany).map(([company, problems]) => (
                                        <AccordionItem key={company} value={company}>
                                            <AccordionTrigger className="text-lg font-medium hover:no-underline">
                                                {company} ({problems.length})
                                            </AccordionTrigger>
                                            <AccordionContent>
                                               <ProblemGroup problems={problems} />
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                             </CardContent>
                         </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}


// Helper component to display a list of problems within an accordion
function ProblemGroup({ problems }: { problems: Problem[] }) {
    return (
        <div className="space-y-2 pl-4 border-l border-border ml-2">
            {problems.map(problem => (
                <Link
                    key={problem.slug}
                    href={`/problems/${problem.slug}`}
                    className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50 transition-colors duration-150 group"
                    prefetch={false}
                >
                    <span className="text-sm group-hover:text-primary group-hover:underline underline-offset-2">{problem.title}</span>
                    <span className={cn("text-xs font-medium", getDifficultyClass(problem.difficulty))}>
                        {problem.difficulty}
                    </span>
                </Link>
            ))}
             {problems.length === 0 && (
                 <p className="text-sm text-muted-foreground italic px-2">No problems found for this group.</p>
             )}
        </div>
    );
}