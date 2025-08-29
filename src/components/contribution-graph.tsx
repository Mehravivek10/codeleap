// src/components/contribution-graph.tsx
'use client';

import type { UserProblemStatus, ProblemStatusDetail } from '@/types';
import { eachDayOfInterval, format, startOfDay, subYears, getDay, isSameDay } from 'date-fns';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Flame, GitCommitVertical } from 'lucide-react';
import { useMemo } from 'react';

interface ContributionGraphProps {
    userProgress: UserProblemStatus;
}

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function ContributionGraph({ userProgress }: ContributionGraphProps) {
    const { contributions, totalContributions, currentStreak } = useMemo(() => {
        const today = startOfDay(new Date());
        const oneYearAgo = subYears(today, 1);
        const allDays = eachDayOfInterval({ start: oneYearAgo, end: today });

        const contributionsMap = new Map<string, number>();
        let totalContributions = 0;

        Object.values(userProgress).forEach(data => {
            const detail = data as ProblemStatusDetail;
            if (detail.status === 'Solved' && detail.solvedAt) {
                const date = startOfDay(detail.solvedAt.toDate());
                const dateString = format(date, 'yyyy-MM-dd');
                
                if (!contributionsMap.has(dateString)) {
                    contributionsMap.set(dateString, 0);
                }
                contributionsMap.set(dateString, contributionsMap.get(dateString)! + 1);
                totalContributions++;
            }
        });

        // Calculate current streak
        let currentStreak = 0;
        let streakDate = today;
        while (contributionsMap.has(format(streakDate, 'yyyy-MM-dd'))) {
            currentStreak++;
            streakDate = new Date(streakDate.setDate(streakDate.getDate() - 1));
        }

        const contributions = allDays.map(day => {
            const dateString = format(day, 'yyyy-MM-dd');
            return {
                date: day,
                count: contributionsMap.get(dateString) || 0,
            };
        });
        
        return { contributions, totalContributions, currentStreak };
    }, [userProgress]);

    const getIntensity = (count: number): string => {
        if (count === 0) return 'bg-muted/50';
        if (count <= 2) return 'bg-primary/20 text-primary';
        if (count <= 5) return 'bg-primary/40 text-primary-foreground';
        if (count <= 8) return 'bg-primary/70 text-primary-foreground';
        return 'bg-primary text-primary-foreground';
    };

    const firstDayOfWeek = getDay(contributions[0].date);

    return (
        <div>
            <div className="grid grid-flow-col-dense grid-rows-7 gap-1 overflow-x-auto pb-4">
                {/* Add empty squares for padding to align the first day correctly */}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                    <div key={`pad-${i}`} className="w-4 h-4 rounded-sm" />
                ))}

                {contributions.map(({ date, count }) => (
                    <Tooltip key={date.toString()}>
                        <TooltipTrigger asChild>
                            <div
                                className={cn(
                                    'w-4 h-4 rounded-sm',
                                    getIntensity(count)
                                )}
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="text-sm">
                                {count} {count === 1 ? 'submission' : 'submissions'} on {format(date, 'MMM d, yyyy')}
                            </p>
                        </TooltipContent>
                    </Tooltip>
                ))}
            </div>
            <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Flame className="h-4 w-4 text-orange-500" />
                        <span>Current Streak: <strong className="text-foreground">{currentStreak} {currentStreak === 1 ? 'day' : 'days'}</strong></span>
                    </div>
                     <div className="flex items-center gap-2">
                        <GitCommitVertical className="h-4 w-4" />
                        <span>Total Contributions: <strong className="text-foreground">{totalContributions}</strong></span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span>Less</span>
                    <div className="w-3 h-3 rounded-sm bg-muted/50" />
                    <div className="w-3 h-3 rounded-sm bg-primary/20" />
                    <div className="w-3 h-3 rounded-sm bg-primary/40" />
                    <div className="w-3 h-3 rounded-sm bg-primary/70" />
                    <div className="w-3 h-3 rounded-sm bg-primary" />
                    <span>More</span>
                </div>
            </div>
        </div>
    );
}
