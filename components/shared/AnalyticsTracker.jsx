"use client";

import { useEffect } from "react";
import axios from "@/lib/axios";

export default function AnalyticsTracker({ pageId, links = [] }) {
    useEffect(() => {
        if (!pageId) return;

        const checkUnique = (key) => {
            if (typeof window === "undefined") return false;
            const lastTracked = localStorage.getItem(key);
            if (!lastTracked) return true;

            const hoursSince = (new Date().getTime() - parseInt(lastTracked)) / (1000 * 60 * 60);
            return hoursSince > 24; // Unique per 24 hours
        };

        const viewedKey = `viewed_${pageId}`;
        if (checkUnique(viewedKey)) {
            const timer = setTimeout(() => {
                axios.post("/track/view", { pageId }, { skipLoader: true })
                    .then(() => localStorage.setItem(viewedKey, new Date().getTime().toString()))
                    .catch(console.error);
            }, 3000); // 3s genuine view

            return () => clearTimeout(timer);
        }
    }, [pageId]);

    // This component renders nothing, it just handles tracking logic
    return null;
}

/**
 * Helper to wrap link clicks with tracking
 * This is used by templates to ensure clicks are recorded
 */
export const trackLinkClick = async (linkId, pageId) => {
    if (typeof window === "undefined" || !pageId) return;

    const clickKey = `clicked_${linkId}`;
    const lastClicked = localStorage.getItem(clickKey);
    const hoursSince = lastClicked ? (new Date().getTime() - parseInt(lastClicked)) / (1000 * 60 * 60) : 999;

    // Track only if unique in 24h
    if (hoursSince > 24) {
        try {
            localStorage.setItem(clickKey, new Date().getTime().toString());
            await axios.post("/track/click", { linkId, pageId }, { skipLoader: true });
        } catch (error) {
            console.error("Click tracking failed", error);
        }
    }
};

/**
 * Helper to handle likes tracking
 */
export const trackLike = async (pageId) => {
    if (typeof window === "undefined") return;

    try {
        localStorage.setItem(`liked_${pageId}`, "true");
        await axios.post("/track/like", { pageId }, { skipLoader: true });
        return true;
    } catch (error) {
        console.error("Like failed", error);
        return false;
    }
};
