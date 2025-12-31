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
        <div className="card bg-base-100 shadow-sm p-6">
            {/* Title skeleton */}
            <div className="skeleton h-4 w-1/4 mb-6"></div>

            {/* Chart area */}
            <div className="relative h-40 flex items-end gap-3 px-2">
                {/* Y-axis grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="border-t border-base-300/40"></div>
                    ))}
                </div>

                {/* Bars */}
                {[60, 40, 80, 55, 70, 35].map((h, i) => (
                    <div key={i} className="flex-1 flex items-end z-10">
                        <div
                            className="skeleton w-full rounded-t-md"
                            style={{ height: `${h}%` }}
                        ></div>
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
