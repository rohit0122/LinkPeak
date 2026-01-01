"use client";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import ChartRangeSelector from "@/components/shared/charts/ChartRangeSelector";
export default function SummaryAreaChart({ summaryChart, plan, onRangeChange, currentRange }) {

    {/* Engagement Chart */ }
    return (
        <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body p-6">
                <ChartRangeSelector
                    plan={plan}
                    title="Engagement Over Time"
                    subtitle="Clicks vs Views distribution for selected period"
                    onRangeChange={onRangeChange}
                    currentRange={currentRange}
                />
                {summaryChart && summaryChart.length > 0 ? (<div className="w-full h-[360px]">
                    <ResponsiveContainer width="100%" height={360}>
                        <AreaChart data={summaryChart} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#9333ea" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis
                                dataKey="label"
                                axisLine={false}
                                tickLine={false}
                                angle={-45}
                                textAnchor="end"
                                height={60}
                                interval={0}
                            />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Area type="monotone" dataKey="views" stroke="#2563eb" fillOpacity={1} fill="url(#colorViews)" />
                            <Area type="monotone" dataKey="clicks" stroke="#9333ea" fillOpacity={1} fill="url(#colorClicks)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                ) : (
                    <div className="h-[200px] flex items-center justify-center text-center opacity-40">
                        <p>No link data available for selected period.</p>
                    </div>
                )}
            </div>
        </div>
    );
}