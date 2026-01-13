"use client";

export default function UpgradeBadge({ type = "PRO", rounded = false, inline = false }) {
    if (inline) {
        return (
            <span className={`badge badge-neutral font-bold uppercase tracking-widest leading-none rounded-none ml-2 text-[10px] py-1.5 h-auto md:text-xs`}>
                {type}
            </span>
        );
    }
    return (
        <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className={`badge badge-xs badge-neutral font-bold uppercase tracking-widest px-2 py-2 shadow-sm rounded-none`}>
                {type}
            </span>
        </div>
    );
}
