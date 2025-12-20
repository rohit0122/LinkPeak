"use client";

import { useEffect } from "react";

export default function ViewTracker({ slug }) {
    useEffect(() => {
        const trackView = async () => {
            try {
                await fetch('/api/bio/view', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ slug }),
                });
            } catch (error) {
                console.error("View tracking pulse failed:", error);
            }
        };

        if (slug) {
            trackView();
        }
    }, [slug]);

    return null;
}
