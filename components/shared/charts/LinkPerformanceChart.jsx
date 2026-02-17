import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    LineChart,
    Line,
} from "recharts";
import { useState } from "react";
import ChartRangeSelector from "@/components/shared/charts/ChartRangeSelector";
import { RiBarChartGroupedLine } from "react-icons/ri";

/**
 * linkChart = [
 *   {
 *     "label": "Jan 03",
 *     "My Website": { "total_clicks": 14, "unique_clicks": 9 },
 *     "Latest Blog Post": { "total_clicks": 23, "unique_clicks": 16 }
 *   }
 * ]
 */

export default function LinkPerformanceChart({ plan, linkChart, onRangeChange, currentRange }) {
    console.log('linkChart ', linkChart)
    const [metric, setMetric] = useState("total_clicks"); // "total_clicks" or "unique_clicks"

    if (plan === "FREE") return (
        <div className="card bg-slate-900 text-white shadow-xl border border-slate-700/50 group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

            <div className="card-body p-10 items-center text-center relative z-10">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                    <RiBarChartGroupedLine className="text-3xl text-primary" />
                </div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                    Unlock Per-Link Analytics
                </h2>
                <div className="space-y-4 mb-2">
                    <p className="text-white/60 max-w-sm leading-relaxed">
                        See exactly which links your fans are clicking most with detailed 7-day, 15-day, 30-day, 90-day, and lifetime performance data.
                    </p>
                    <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
                        <p className="text-primary font-bold text-sm">
                            Available on Pro & Agency Plans
                        </p>
                        <p className="text-white/40 text-xs mt-1">
                            To unlock these analytics, please upgrade from your <span className="text-white font-bold underline">Account Section</span>.
                        </p>
                    </div>
                </div>
            </div>
        </div>);

    const transformedData = linkChart?.map(row => {
        const transformed = { label: row.label };
        Object.keys(row).forEach(key => {
            if (key !== "label" && row[key]?.[metric] !== undefined) {
                transformed[key] = row[key][metric];
            }
        });
        return transformed;
    }) || [];

    const hasLinkData = transformedData.length > 0 && transformedData.some(row =>
        Object.values(row).some(v => typeof v === "number" && v >= 0)
    );

    // Derive link keys and filter out links with zero clicks
    const linkKeys = transformedData.length
        ? Object.keys(transformedData[0])
            .filter((key) => key !== "label")
            .filter((key) => transformedData.some((row) => row[key] >= 0))
        : [];

    // Sort links by total clicks
    linkKeys.sort((a, b) => {
        const sum = (key) => transformedData.reduce((t, r) => t + (r[key] || 0), 0);
        return sum(b) - sum(a);
    });

    const COLORS = ["#6366f1", "#9333ea", "#ec4899", "#f59e0b", "#10b981"];
    return (
        plan !== "FREE" && (
            <div className="card bg-base-100 shadow-sm border border-base-300 p-6">
                <div className="card-body p-6">
                    <ChartRangeSelector
                        plan={plan}
                        title="Link Performance"
                        subtitle="Click distribution for selected period"
                        onRangeChange={onRangeChange}
                        currentRange={currentRange}
                    />

                    {/* Metric Toggle */}
                    <div className="flex justify-end mb-4">
                        <div className="join">
                            <button
                                className={`join-item btn btn-sm ${metric === "total_clicks" ? "btn-primary" : "btn-ghost"} tooltip tooltip-bottom`}
                                onClick={() => setMetric("total_clicks")}
                                data-tip="Total Clicks"
                            >
                                Total Clicks
                            </button>
                            <button
                                className={`join-item btn btn-sm ${metric === "unique_clicks" ? "btn-primary" : "btn-ghost"} tooltip tooltip-bottom`}
                                onClick={() => setMetric("unique_clicks")}
                                data-tip="Unique Clicks"
                            >
                                Unique Clicks
                            </button>
                        </div>
                    </div>

                    {
                        hasLinkData ? (
                            <div className="w-full h-[360px]">
                                <ResponsiveContainer width="100%" height={360}>
                                    <LineChart
                                        data={transformedData}
                                        margin={{ top: 20, right: 30, left: 10, bottom: 40 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />

                                        {/* X Axis = Date */}
                                        <XAxis
                                            dataKey="label"
                                            tickLine={false}
                                            axisLine={false}
                                            angle={-45}
                                            textAnchor="end"
                                            height={60}
                                            interval={0}
                                        />

                                        {/* Y Axis = Click Count */}
                                        <YAxis
                                            tickLine={false}
                                            axisLine={false}
                                            allowDecimals={false}
                                        />

                                        <Tooltip />
                                        <Legend />

                                        {linkKeys.map((key, index) => (
                                            <Line
                                                key={key}
                                                dataKey={key}
                                                name={key}
                                                stroke={COLORS[index % COLORS.length]}
                                                strokeWidth={2}
                                            />
                                        ))}
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>) : (
                            <div className="h-[200px] flex items-center justify-center text-center opacity-40">
                                <p>No link data available for selected period.</p>
                            </div>
                        )
                    }
                </div>
            </div>
        )
    );
}