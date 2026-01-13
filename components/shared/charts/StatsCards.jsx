import { RiCursorLine, RiEyeLine, RiHeartLine, RiPercentLine, RiUser6Line, RiMouseLine, RiLinksLine } from "react-icons/ri";

export default function StatsCards({ totals }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            <StatCard title="Total Views" value={totals.total_views} icon={RiEyeLine} colorClass="bg-blue-100 text-blue-600" />
            <StatCard title="Unique Views" value={totals.unique_views} icon={RiUser6Line} colorClass="bg-sky-100 text-sky-600" />
            <StatCard title="Total Clicks" value={totals.total_clicks} icon={RiCursorLine} colorClass="bg-purple-100 text-purple-600" />
            <StatCard title="Unique Clicks" value={totals.unique_clicks} icon={RiMouseLine} colorClass="bg-indigo-100 text-indigo-600" />
            <StatCard title="Avg. CTR" value={`${totals.avg_ctr}%`} icon={RiPercentLine} colorClass="bg-orange-100 text-orange-600" />
            <StatCard title="Total Likes" value={totals.total_likes} icon={RiHeartLine} colorClass="bg-pink-100 text-pink-600" />
            <StatCard title="Active Links" value={totals.total_active_links} icon={RiLinksLine} colorClass="bg-emerald-100 text-emerald-600" />
        </div>
    );
}


function StatCard({ title, value, icon: Icon, colorClass }) {
    return (
        <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">{title}</p>
                        <h3 className="text-3xl font-medium">{value}</h3>
                    </div>
                    <div className={`p-3 rounded-lg ${colorClass}`}>
                        <Icon className="text-2xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}