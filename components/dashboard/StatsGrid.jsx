import { HiCursorArrowRays, HiEye, HiArrowTrendingUp } from "react-icons/hi2";
import { formatNumber } from "@/lib/utils";

export default function StatsGrid({ stats }) {
    return (
        <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-100 border border-base-300 w-full mb-8">
            <div className="stat">
                <div className="stat-figure text-primary">
                    <HiEye className="text-3xl" />
                </div>
                <div className="stat-title font-semibold uppercase tracking-wider text-[10px] opacity-60">Total Views</div>
                <div className="stat-value text-primary">{formatNumber(stats.views)}</div>
                <div className="stat-desc text-xs mt-1">
                    <span className="text-success font-bold">↗︎ 12%</span> from last week
                </div>
            </div>

            <div className="stat border-l border-base-300">
                <div className="stat-figure text-secondary">
                    <HiCursorArrowRays className="text-3xl" />
                </div>
                <div className="stat-title font-semibold uppercase tracking-wider text-[10px] opacity-60">Total Clicks</div>
                <div className="stat-value text-secondary">{formatNumber(stats.clicks)}</div>
                <div className="stat-desc text-xs mt-1">
                    <span className="text-success font-bold">↗︎ 8%</span> from last week
                </div>
            </div>

            <div className="stat border-l border-base-300">
                <div className="stat-figure text-accent">
                    <HiArrowTrendingUp className="text-3xl" />
                </div>
                <div className="stat-title font-semibold uppercase tracking-wider text-[10px] opacity-60">Avg. CTR</div>
                <div className="stat-value text-accent">{stats.ctr}%</div>
                <div className="stat-desc text-xs mt-1">
                    <span className="text-success font-bold">↗︎ 0.4%</span> since yesterday
                </div>
            </div>
        </div>
    );
}
