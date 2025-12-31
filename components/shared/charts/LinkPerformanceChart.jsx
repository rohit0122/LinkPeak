import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import ChartRangeSelector from "@/components/shared/charts/ChartRangeSelector";
import { RiBarChartGroupedLine } from "react-icons/ri";

/**
 * linkChart = [
 *   { label: "Dec 30", "Link A": 1, "Link B": 2 }
 * ]
 */

export default function LinkPerformanceChart({ plan, linkChart }) {
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
                <p className="text-white/60 max-w-sm mb-8 leading-relaxed">
                    Upgrade to Pro to see exactly which links your fans are clicking most with detailed 7-day, 15-day, 30-day, 90-day, and lifetime performance data.
                </p>
                <button
                    onClick={() => window.location.href = '/#pricing'}
                    className="btn btn-primary btn-wide font-bold shadow-2xl shadow-primary/20 hover:scale-105 transition-all"
                >
                    Upgrade to Pro
                </button>
            </div>
        </div>);

    const hasLinkData = linkChart?.length ? linkChart.some(row => Object.values(row).some(v => typeof v === "number" && v > 0)) : false;

    // ---------------------------
    // Derive link keys dynamically
    // ---------------------------
    const rawKeys = linkChart?.length ? Object.keys(linkChart[0]).filter(
        (key) => key !== "label"
    ) : [];

    // ---------------------------
    // Remove links with zero clicks
    // ---------------------------
    const linkKeys = rawKeys?.length ? rawKeys.filter((key) =>
        linkChart.some((row) => row[key] > 0)
    ) : [];

    // ---------------------------
    // Sort links by total clicks
    // ---------------------------
    linkKeys.sort((a, b) => {
        const sum = (key) =>
            linkChart.reduce((t, r) => t + (r[key] || 0), 0);
        return sum(b) - sum(a);
    });

    // ---------------------------
    // Color palette (cycled)
    // ---------------------------
    const COLORS = [
        "#6366f1", // indigo
        "#9333ea", // purple
        "#ec4899", // pink
        "#f59e0b", // amber
        "#10b981", // emerald
    ];

    {/* Link Performance Chart */ }
    return (
        plan !== "FREE" && (
            <div className="card bg-base-100 shadow-sm border border-base-300 p-6">
                <div className="card-body p-6">
                    <ChartRangeSelector plan={plan} title="Link Performance" subtitle="Click distribution for selected period" />
                    {
                        hasLinkData ? (
                            <div style={{ width: "100%", height: 360 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={linkChart}
                                        margin={{ top: 20, right: 30, left: 10, bottom: 40 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />

                                        {/* X Axis = Date */}
                                        <XAxis
                                            dataKey="label"
                                            tickLine={false}
                                            axisLine={false}
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
                                            <Bar
                                                key={key}
                                                dataKey={key}
                                                name={key}
                                                fill={[
                                                    "#6366f1",
                                                    "#9333ea",
                                                    "#ec4899",
                                                    "#f59e0b",
                                                    "#10b981",
                                                ][index % 5]}
                                                radius={[6, 6, 0, 0]}
                                            />
                                        ))}
                                    </BarChart>
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
