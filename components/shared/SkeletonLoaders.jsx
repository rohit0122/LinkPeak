export function SkeletonCard() {
    return (
        <div className="card bg-base-100 shadow-sm p-6 animate-pulse">
            <div className="h-4 bg-base-300 rounded w-1/3 mb-4"></div>
            <div className="h-8 bg-base-300 rounded w-2/3"></div>
        </div>
    );
}

export function SkeletonStat() {
    return (
        <div className="stat bg-base-100 shadow-sm animate-pulse">
            <div className="h-3 bg-base-300 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-base-300 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-base-300 rounded w-1/3"></div>
        </div>
    );
}

export function SkeletonChart() {
    return (
        <div className="card bg-base-100 shadow-sm p-6 animate-pulse">
            <div className="h-4 bg-base-300 rounded w-1/4 mb-6"></div>
            <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-end gap-2 h-32">
                        <div className="flex-1 bg-base-300 rounded" style={{ height: `${Math.random() * 100}%` }}></div>
                        <div className="flex-1 bg-base-300 rounded" style={{ height: `${Math.random() * 100}%` }}></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function SkeletonTable() {
    return (
        <div className="card bg-base-100 shadow-sm p-6 animate-pulse">
            <div className="h-4 bg-base-300 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                        <div className="h-10 bg-base-300 rounded flex-1"></div>
                        <div className="h-10 bg-base-300 rounded w-24"></div>
                        <div className="h-10 bg-base-300 rounded w-24"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function SkeletonDashboard() {
    return (
        <div className="space-y-6 max-w-6xl mx-auto my-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SkeletonStat />
                <SkeletonStat />
                <SkeletonStat />
            </div>
            <SkeletonChart />
            <SkeletonTable />
        </div>
    );
}
