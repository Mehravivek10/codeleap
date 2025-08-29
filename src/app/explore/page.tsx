// src/app/explore/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { getProblemsByCategory, getProblemsByCompany, type Problem } from '@/services/leetcode';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Building, Layers, Tag, Eye, EyeOff, Loader2, Trophy } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Function to get difficulty class
const getDifficultyClass = (difficulty: string): string => {
    switch (difficulty.toLowerCase()) {
        case 'easy': return 'text-green-600 dark:text-green-400';
        case 'medium': return 'text-yellow-600 dark:text-yellow-400';
        case 'hard': return 'text-red-600 dark:text-red-400';
        default: return 'text-muted-foreground';
    }
};

const EXCLUDED_CATEGORIES = ['Discussion', 'Interview Prep', 'Interview'];

export default function ExplorePage() {
    const [problemsByCategory, setProblemsByCategory] = useState<Record<string, Problem[]>>({});
    const [problemsByCompany, setProblemsByCompany] = useState<Record<string, Problem[]>>({});
    const [showTags, setShowTags] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            const [byCategory, byCompany] = await Promise.all([
                getProblemsByCategory(),
                getProblemsByCompany()
            ]);

            // Filter out excluded categories
            const filteredByCategory: Record<string, Problem[]> = {};
            for (const category in byCategory) {
                if (!EXCLUDED_CATEGORIES.includes(category)) {
                    filteredByCategory[category] = byCategory[category];
                }
            }

            setProblemsByCategory(filteredByCategory);
            setProblemsByCompany(byCompany);
            setIsLoading(false);
        }
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen bg-background text-foreground">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8 flex justify-center items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </main>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6 border-b pb-3">
                     <div>
                        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                             <Trophy className="h-7 w-7" />
                             Challenges & Achievements
                         </h1>
                         <p className="text-muted-foreground mt-1">Solve problems to earn badges on your profile.</p>
                     </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="show-tags-toggle"
                            checked={showTags}
                            onCheckedChange={setShowTags}
                            aria-label="Toggle tag visibility"
                        />
                        <Label htmlFor="show-tags-toggle" className="flex items-center gap-2 cursor-pointer">
                           {showTags ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                           <span className="text-sm">Show Tags</span>
                        </Label>
                    </div>
                </div>

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
                                <CardDescription>Browse questions based on common problem types to earn achievements.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="multiple" className="w-full">
                                    {Object.entries(problemsByCategory).map(([category, problems]) => (
                                        <AccordionItem key={category} value={category}>
                                            <AccordionTrigger className="text-lg font-medium hover:no-underline">
                                                {category} ({problems.length})
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <ProblemGroup problems={problems} showTags={showTags} />
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
                                               <ProblemGroup problems={problems} showTags={showTags} />
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
function ProblemGroup({ problems, showTags }: { problems: Problem[]; showTags: boolean }) {
    return (
        <div className="space-y-2 pl-4 border-l border-border ml-2">
            {problems.map(problem => (
                <Link
                    key={problem.slug}
                    href={`/problems/${problem.slug}`}
                    className="block p-3 rounded-md hover:bg-muted/50 transition-colors duration-150 group"
                    prefetch={false}
                >
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium group-hover:text-primary">{problem.title}</span>
                        <span className={cn("text-xs font-semibold", getDifficultyClass(problem.difficulty))}>
                            {problem.difficulty}
                        </span>
                    </div>
                    {showTags && problem.tags && problem.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                            {problem.tags.slice(0, 4).map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs font-normal">{tag}</Badge>
                            ))}
                        </div>
                    )}
                </Link>
            ))}
             {problems.length === 0 && (
                 <p className="text-sm text-muted-foreground italic px-2">No problems found for this group.</p>
             )}
        </div>
    );
}
