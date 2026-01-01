import { RiCursorLine, RiEyeLine, RiHeartLine, RiPercentLine } from "react-icons/ri";

export default function StatsCards({ totals }) {
    const ctr = totals.views ? ((totals.clicks / totals.views) * 100).toFixed(1) : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2">
            <StatCard title="Total Views" value={totals.views} icon={RiEyeLine} colorClass="bg-blue-100 text-blue-600" />
            <StatCard title="Total Clicks" value={totals.clicks} icon={RiCursorLine} colorClass="bg-purple-100 text-purple-600" />
            <StatCard title="Avg. CTR" value={`${ctr}%`} icon={RiPercentLine} colorClass="bg-orange-100 text-orange-600" />
            <StatCard title="Total Likes" value={totals.likes} icon={RiHeartLine} colorClass="bg-pink-100 text-pink-600" />
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