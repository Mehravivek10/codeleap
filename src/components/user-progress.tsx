'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface UserProgressProps {
  data: { month: string; solved: number }[];
}

const chartConfig = {
  solved: {
    label: 'Problems Solved',
    color: 'hsl(var(--chart-1))', // Use primary theme color for bars
  },
} satisfies ChartConfig;

export function UserProgress({ data }: UserProgressProps) {
  return (
       <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <ResponsiveContainer width="100%" height={200}>
           <BarChart accessibilityLayer data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)} // Show abbreviated month names
                fontSize={12}
                stroke="hsl(var(--foreground))" // Ensure tick text color follows theme
              />
              <ChartTooltip
                cursor={false}
                content={
                    <ChartTooltipContent
                        indicator="dot"
                        hideLabel
                     />
                 }
              />
              <Bar dataKey="solved" fill="var(--color-solved)" radius={4} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
       </ChartContainer>
  );
}
