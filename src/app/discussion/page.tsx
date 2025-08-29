// src/app/discussion/page.tsx
import { Header } from '@/components/header';
import { getProblems, type Problem } from '@/services/leetcode';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Star } from 'lucide-react';

// Function to get difficulty class
const getDifficultyClass = (difficulty: string): string => {
    switch (difficulty.toLowerCase()) {
        case 'easy': return 'text-green-600 dark:text-green-400';
        case 'medium': return 'text-yellow-600 dark:text-yellow-400';
        case 'hard': return 'text-red-600 dark:text-red-400';
        default: return 'text-muted-foreground';
    }
};

export default async function DiscussionPage() {
    const allProblems = await getProblems();
    // Filter for problems categorized under 'Discussion'
    const discussionProblems = allProblems.filter(p => p.category === 'Discussion');

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="mb-8 border-b pb-4">
                    <h1 className="text-4xl font-bold tracking-tight text-primary flex items-center gap-3">
                        <MessageSquare className="h-10 w-10" />
                        Discussion
                    </h1>
                    <p className="mt-2 text-lg text-muted-foreground">
                        Engage with the community on system design, algorithms, and data structures.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {discussionProblems.map(problem => (
                        <Card key={problem.slug} className="hover:border-primary/50 transition-all duration-200 hover:shadow-lg">
                            <CardHeader>
                                <CardTitle>{problem.title}</CardTitle>
                                <CardDescription className={getDifficultyClass(problem.difficulty)}>
                                    {problem.difficulty}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                                    {problem.statement}
                                </p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {problem.tags?.slice(0, 3).map(tag => (
                                        <Badge key={tag} variant="secondary">{tag}</Badge>
                                    ))}
                                </div>
                                <Link
                                    href={`/problems/${problem.slug}`}
                                    className="text-sm font-semibold text-primary hover:underline"
                                >
                                    View Problem &rarr;
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                     {discussionProblems.length === 0 && (
                        <div className="col-span-full text-center py-12">
                            <p className="text-muted-foreground">No discussion topics found at the moment.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
