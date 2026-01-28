"use client";

import Image from "next/image";
import { CONFIG } from "@/constants/config";

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

                <Image
                    src={src ? src : CONFIG.DEFAULT_PROFILE_IMAGE}
                    alt={alt}
                    width={numericSize}
                    height={numericSize}
                    priority={priority}
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
}
