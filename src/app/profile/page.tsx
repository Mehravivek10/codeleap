// src/app/profile/page.tsx
import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Trophy, GitCommitVertical, Star, CheckCircle, BarChart, HardDrive, Cpu } from 'lucide-react';
import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { getProblems, type Problem } from '@/services/leetcode';
import type { UserProblemStatus, UserProfile } from '@/types';
import { redirect } from 'next/navigation';
import { ContributionGraph } from '@/components/contribution-graph';
import { SolvedProgressChart } from '@/components/solved-progress-chart';

const getInitials = (displayName: string | null | undefined): string => {
    if (!displayName) return 'U';
    const names = displayName.split(' ');
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
};

const countProblemsByDifficulty = (
    userProgress: UserProblemStatus,
    allProblems: Problem[]
): { easy: number; medium: number; hard: number; total: number } => {
    const solvedSlugs = new Set<string>();
    Object.entries(userProgress).forEach(([slug, data]) => {
        const status = typeof data === 'object' ? data.status : data;
        if (status === 'Solved') {
            solvedSlugs.add(slug);
        }
    });

    let easy = 0;
    let medium = 0;
    let hard = 0;

    allProblems.forEach(problem => {
        if (solvedSlugs.has(problem.slug)) {
            if (problem.difficulty === 'Easy') easy++;
            else if (problem.difficulty === 'Medium') medium++;
            else if (problem.difficulty === 'Hard') hard++;
        }
    });

    return { easy, medium, hard, total: solvedSlugs.size };
};

export default async function ProfilePage() {
    let userProfile: UserProfile | null = null;
    let userProgress: UserProblemStatus = {};

    try {
        const sessionCookie = (await cookies()).get('session')?.value;
        if (!sessionCookie) {
            redirect('/?auth=true&redirectedFrom=/profile');
        }
        const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
        const userRecord = await adminAuth.getUser(decodedToken.uid);
        userProfile = {
            uid: userRecord.uid,
            email: userRecord.email || null,
            displayName: userRecord.displayName || 'Anonymous User',
            photoURL: userRecord.photoURL || null,
        };

        const progressDoc = await adminDb.collection('userProgress').doc(decodedToken.uid).get();
        if (progressDoc.exists) {
            userProgress = progressDoc.data()?.problems || {};
        }
    } catch (error) {
        console.log("Session invalid or user not found, redirecting to login.");
        redirect('/?auth=true&redirectedFrom=/profile');
    }

    const allProblems = await getProblems();
    const solvedCounts = countProblemsByDifficulty(userProgress, allProblems);

    const totalProblemsByDifficulty = {
        easy: allProblems.filter(p => p.difficulty === 'Easy').length,
        medium: allProblems.filter(p => p.difficulty === 'Medium').length,
        hard: allProblems.filter(p => p.difficulty === 'Hard').length,
    }

    return (
        <TooltipProvider>
            <div className="flex flex-col min-h-screen bg-secondary/30 text-foreground">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Left Column */}
                        <div className="lg:col-span-1 space-y-6">
                            <Card className="shadow-lg border-border/60">
                                <CardContent className="p-6 text-center">
                                    <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-background ring-2 ring-accent">
                                        <AvatarImage src={userProfile.photoURL || ''} alt={userProfile.displayName || ''} />
                                        <AvatarFallback className="text-3xl">{getInitials(userProfile.displayName)}</AvatarFallback>
                                    </Avatar>
                                    <h1 className="text-2xl font-bold">{userProfile.displayName}</h1>
                                    <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                                    <Button variant="outline" className="mt-4 w-full">Edit Profile</Button>
                                </CardContent>
                            </Card>

                            <Card className="shadow-lg border-border/60">
                                 <CardHeader>
                                    <CardTitle className="text-lg">Stats</CardTitle>
                                 </CardHeader>
                                 <CardContent className="space-y-4">
                                     <div className="flex justify-between items-center text-sm">
                                         <p className="text-muted-foreground flex items-center gap-2"><Cpu className="h-4 w-4 text-green-500"/> Easy</p>
                                         <p className="font-medium">{solvedCounts.easy} <span className="text-muted-foreground">/ {totalProblemsByDifficulty.easy}</span></p>
                                     </div>
                                      <div className="flex justify-between items-center text-sm">
                                         <p className="text-muted-foreground flex items-center gap-2"><HardDrive className="h-4 w-4 text-yellow-500"/> Medium</p>
                                         <p className="font-medium">{solvedCounts.medium} <span className="text-muted-foreground">/ {totalProblemsByDifficulty.medium}</span></p>
                                     </div>
                                      <div className="flex justify-between items-center text-sm">
                                         <p className="text-muted-foreground flex items-center gap-2"><BarChart className="h-4 w-4 text-red-500"/> Hard</p>
                                         <p className="font-medium">{solvedCounts.hard} <span className="text-muted-foreground">/ {totalProblemsByDifficulty.hard}</span></p>
                                     </div>
                                 </CardContent>
                            </Card>
                        </div>

                        {/* Right Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="shadow-lg border-border/60">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium">Problems Solved</CardTitle>
                                        <CheckCircle className="h-4 w-4 text-muted-foreground"/>
                                    </CardHeader>
                                    <CardContent>
                                       <SolvedProgressChart
                                            totalSolved={solvedCounts.total}
                                            totalAvailable={allProblems.length}
                                       />
                                    </CardContent>
                                </Card>
                                <Card className="shadow-lg border-border/60">
                                     <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium">Contest Rating</CardTitle>
                                        <Star className="h-4 w-4 text-muted-foreground"/>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">1,562</div>
                                        <p className="text-xs text-muted-foreground">+24 from last contest</p>
                                        <div className="h-24 mt-4 text-center text-muted-foreground text-sm flex items-center justify-center">
                                            (Contest chart placeholder)
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                             <Card className="shadow-lg border-border/60">
                                 <CardHeader>
                                     <CardTitle className="flex items-center gap-2 text-lg">
                                         <GitCommitVertical className="h-5 w-5 text-accent" />
                                         Contribution Activity
                                     </CardTitle>
                                 </CardHeader>
                                 <CardContent className="pl-2 sm:pl-6">
                                     <ContributionGraph userProgress={userProgress} />
                                 </CardContent>
                             </Card>
                        </div>
                    </div>
                </main>
            </div>
        </TooltipProvider>
    );
}
