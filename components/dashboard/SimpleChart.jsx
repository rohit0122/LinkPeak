export default function SimpleChart({ data }) {
    // Basic SVG Area Chart logic
    const maxVal = Math.max(...data.map(d => Math.max(d.views, d.clicks)), 10);
    const height = 200;
    const width = 800;
    const padding = 20;

    const getX = (i) => (i / (data.length - 1)) * (width - padding * 2) + padding;
    const getY = (v) => height - (v / maxVal) * (height - padding * 2) - padding;

    const viewsPath = `M ${getX(0)} ${getY(data[0].views)} ` +
        data.slice(1).map((d, i) => `L ${getX(i + 1)} ${getY(d.views)}`).join(' ') +
        ` L ${getX(data.length - 1)} ${height} L ${getX(0)} ${height} Z`;

    const clicksPath = `M ${getX(0)} ${getY(data[0].clicks)} ` +
        data.slice(1).map((d, i) => `L ${getX(i + 1)} ${getY(d.clicks)}`).join(' ') +
        ` L ${getX(data.length - 1)} ${height} L ${getX(0)} ${height} Z`;

    return (
        <div className="w-full bg-base-100 p-6 rounded-3xl border border-base-300">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Performance Overview</h3>
                <div className="flex gap-4 text-xs font-bold uppercase tracking-widest opacity-60">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary/40 border border-primary"></div>
                        <span>Views</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-secondary/40 border border-secondary"></div>
                        <span>Clicks</span>
                    </div>
                </div>
            </div>

            <div className="relative h-[200px] w-full">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                    {/* View Area */}
                    <path d={viewsPath} fill="url(#gradViews)" className="opacity-20" />
                    <path d={viewsPath.split('L')[0] + data.slice(1).map((d, i) => `L ${getX(i + 1)} ${getY(d.views)}`).join(' ')} fill="none" stroke="oklch(var(--p))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Clicks Area */}
                    <path d={clicksPath} fill="url(#gradClicks)" className="opacity-20" />
                    <path d={clicksPath.split('L')[0] + data.slice(1).map((d, i) => `L ${getX(i + 1)} ${getY(d.clicks)}`).join(' ')} fill="none" stroke="oklch(var(--s))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                    <defs>
                        <linearGradient id="gradViews" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: 'oklch(var(--p))', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: 'oklch(var(--p))', stopOpacity: 0 }} />
                        </linearGradient>
                        <linearGradient id="gradClicks" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: 'oklch(var(--s))', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: 'oklch(var(--s))', stopOpacity: 0 }} />
                        </linearGradient>
                    </defs>

                    {/* X Axis Labels */}
                    {data.map((d, i) => (
                        <text key={i} x={getX(i)} y={height + 15} textAnchor="middle" fontSize="10" className="fill-base-content/40 font-bold tracking-tighter">
                            {d.name}
                        </text>
                    ))}
                </svg>
            </div>
        </div>
    );
}
