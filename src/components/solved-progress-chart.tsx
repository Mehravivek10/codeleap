// src/components/solved-progress-chart.tsx
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SolvedProgressChartProps {
    totalSolved: number;
    totalAvailable: number;
}

const data = [{ name: 'Solved', value: 0 }, { name: 'Remaining', value: 100 }];
const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--border))'];

export function SolvedProgressChart({ totalSolved, totalAvailable }: SolvedProgressChartProps) {
    const solvedPercentage = totalAvailable > 0 ? (totalSolved / totalAvailable) * 100 : 0;
    const chartData = [
        { name: 'Solved', value: solvedPercentage },
        { name: 'Remaining', value: 100 - solvedPercentage },
    ];

    return (
        <div style={{ width: '100%', height: 140 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={65}
                        startAngle={90}
                        endAngle={450}
                        paddingAngle={0}
                        dataKey="value"
                        stroke="none"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                         <Label
                            value={`${totalSolved}`}
                            position="center"
                            className="fill-foreground"
                            style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                            }}
                         />
                         <Label
                             value={`/ ${totalAvailable}`}
                             position="center"
                             dy={20}
                             className="fill-muted-foreground"
                             style={{
                                 fontSize: '12px',
                             }}
                         />
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
SolvedProgressChart.displayName = 'SolvedProgressChart';