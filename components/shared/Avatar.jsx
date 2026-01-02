"use client";

import { RiUserLine } from "react-icons/ri";

const SIZES = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-20 h-20",
    xl: "w-32 h-32",
};

export default function Avatar({
    src,
    alt = "Profile",
    size = "md",
    className = "",
    ring = false,
    ringColor = "ring-primary"
}) {
    const sizeClass = SIZES[size] || SIZES.md;
    const ringClass = ring ? `ring-2 ${ringColor} shadow-sm` : "";

    return (
        <div className={`${sizeClass} rounded-full overflow-hidden ${ringClass} ${className} flex-shrink-0 bg-base-200`}>
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-base-content/30">
                    <RiUserLine className="w-[50%] h-[50%]" />
                </div>
            )}
        </div>
    );
}
