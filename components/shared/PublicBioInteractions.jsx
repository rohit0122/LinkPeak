"use client";

import { useState } from "react";
import { RiQrCodeLine } from "react-icons/ri";
import LikeButton from "@/components/shared/LikeButton";
import QRModal from "@/components/shared/QRModal";
import { trackLike } from "@/components/shared/AnalyticsTracker";

export default function PublicBioInteractions({ page }) {
    const [likes, setLikes] = useState(page.likes || 0);
    const [isLiked, setIsLiked] = useState(false);
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);

    const handleLike = async () => {
        if (isLiked) return;

        // Optimistic update
        setLikes(prev => prev + 1);
        setIsLiked(true);

        const success = await trackLike(page._id);
        if (!success) {
            // Revert if failed? Usually overkill for likes
        }
    };

    return (
        <>
            {/* Share Button */}
            <button
                onClick={() => setIsQRModalOpen(true)}
                className="absolute top-6 right-6 btn btn-circle btn-ghost btn-sm bg-base-100/50 backdrop-blur shadow-sm z-20"
                aria-label="Share QR Code"
            >
                <RiQrCodeLine className="text-lg" />
            </button>

            {/* Floating Like Button */}
            <LikeButton
                likes={likes}
                isLiked={isLiked}
                onLike={handleLike}
            />

            {/* QR Modal */}
            <QRModal
                slug={page.slug}
                isOpen={isQRModalOpen}
                onClose={() => setIsQRModalOpen(false)}
                plan={page.userId?.plan || "FREE"}
            />
        </>
    );
}
