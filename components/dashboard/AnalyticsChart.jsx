'use client';

import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

export default function AnalyticsChart({ data }) {
    return (
        <div className="w-full h-[300px] mt-8 bg-base-100 rounded-[2rem] border border-base-300 p-6 shadow-sm overflow-hidden group">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="oklch(var(--p))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="oklch(var(--p))" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="oklch(var(--s))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="oklch(var(--s))" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--bc) / 0.1)" vertical={false} />
                    <XAxis
                        dataKey="name"
                        stroke="oklch(var(--bc) / 0.4)"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                        fontWeight="900"
                    />
                    <YAxis
                        stroke="oklch(var(--bc) / 0.4)"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        fontWeight="900"
                        tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'oklch(var(--b1))',
                            border: '1px solid oklch(var(--bc) / 0.1)',
                            borderRadius: '1.25rem',
                            fontSize: '10px',
                            fontWeight: '900',
                            boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)'
                        }}
                        itemStyle={{ color: 'oklch(var(--bc))' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="views"
                        stroke="oklch(var(--p))"
                        fillOpacity={1}
                        fill="url(#colorViews)"
                        strokeWidth={4}
                        animationDuration={1500}
                    />
                    <Area
                        type="monotone"
                        dataKey="clicks"
                        stroke="oklch(var(--s))"
                        fillOpacity={1}
                        fill="url(#colorClicks)"
                        strokeWidth={4}
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
