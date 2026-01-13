import { RiCursorLine, RiEyeLine, RiHeartLine, RiPercentLine, RiUser6Line, RiMouseLine, RiLinksLine } from "react-icons/ri";

export default function StatsCards({ totals }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Views" value={totals.total_views} icon={RiEyeLine} colorClass="text-info" />
            <StatCard title="Unique Views" value={totals.unique_views} icon={RiUser6Line} colorClass="text-primary" />
            <StatCard title="Total Clicks" value={totals.total_clicks} icon={RiCursorLine} colorClass="text-secondary" />
            <StatCard title="Unique Clicks" value={totals.unique_clicks} icon={RiMouseLine} colorClass="text-accent" />
            <StatCard title="Avg. CTR" value={`${totals.avg_ctr}%`} icon={RiPercentLine} colorClass="text-warning" />
            <StatCard title="Total Likes" value={totals.total_likes} icon={RiHeartLine} colorClass="text-error" />
            <StatCard title="Active Links" value={totals.total_active_links} icon={RiLinksLine} colorClass="text-success" />
        </div>
    );
}


function StatCard({ title, value, icon: Icon, colorClass }) {
    return (
        <div className="stats shadow-sm border border-base-300 bg-base-100">
            <div className="stat">
                <div className="stat-figure text-2xl">
                    <Icon className={colorClass} />
                </div>
                <div className="stat-title text-xs opacity-60">{title}</div>
                <div className="stat-value text-3xl">{value}</div>
            </div>
        </div>
    );
}