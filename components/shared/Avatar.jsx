"use client";

import Image from "next/image";

const SIZES = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-20 h-20",
    xl: "w-32 h-32",
};

const SIZE_NUMERIC = {
    xs: 24,
    sm: 32,
    md: 48,
    lg: 80,
    xl: 128,
};

const SHAPES = {
    circle: "rounded-full",
    rounded: "rounded-2xl",
    square: "rounded-none",
};

export default function Avatar({
    src,
    alt = "Profile",
    size = "md",
    className = "",
    ring = false,
    ringColor = "ring-primary",
    shape = "circle",
    priority = false
}) {
    // Determine numeric size for Next.js Image
    const isNumericSize = typeof size === "number";
    const sizeUtility = isNumericSize ? "" : SIZES[size] || SIZES.md;
    const numericSize = isNumericSize ? size : SIZE_NUMERIC[size] || SIZE_NUMERIC.md;

    // Use standard rounding instead of masks to support borders/shadows on the container
    const shapeClass = SHAPES[shape] || shape;
    const ringClass = ring ? `ring-2 ${ringColor} ring-offset-base-100 ring-offset-2` : "";

    return (
        <div
            className={`avatar ${!src ? 'placeholder' : ''} ${sizeUtility} ${shapeClass} ${ringClass} flex-shrink-0 ${className}`}
            style={isNumericSize ? { width: size, height: size, minWidth: size, minHeight: size } : {}}
        >
            <div
                className={`w-full h-full ${shapeClass} bg-white flex items-center justify-center overflow-hidden`}
            >
                {src ? (
                    <Image
                        src={src}
                        alt={alt}
                        width={numericSize}
                        height={numericSize}
                        priority={priority}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <svg
                        viewBox="0 0 256 256"
                        className="w-1/2 h-1/2 text-base-content/40"
                        fill="currentColor"
                    >
                        <path d="M152 128a24 24 0 1 1-24-24 24 24 0 0 1 24 24Z" opacity=".2" />
                        <path d="M200 152a31.84 31.84 0 0 0-19.53 6.68l-23.11-18A31.65 31.65 0 0 0 160 128c0-.74 0-1.48-.08-2.21l13.23-4.41A32 32 0 1 0 168 104c0 .74 0 1.48.08 2.21l-13.23 4.41A32 32 0 0 0 128 96a32.59 32.59 0 0 0-5.27.44L115.89 81A32 32 0 1 0 96 88a32.59 32.59 0 0 0 5.27-.44l6.84 15.4a31.92 31.92 0 0 0-8.57 39.64l-25.71 22.84a32.06 32.06 0 1 0 10.63 12l25.71-22.84a31.91 31.91 0 0 0 37.36-1.24l23.11 18A31.65 31.65 0 0 0 168 184a32 32 0 1 0 32-32Zm0-64a16 16 0 1 1-16 16 16 16 0 0 1 16-16ZM80 56a16 16 0 1 1 16 16 16 16 0 0 1-16-16ZM56 208a16 16 0 1 1 16-16 16 16 0 0 1-16 16Zm56-80a16 16 0 1 1 16 16 16 16 0 0 1-16-16Zm88 72a16 16 0 1 1 16-16 16 16 0 0 1-16 16Z" />
                    </svg>
                )}
            </div>
        </div>
    );
}
