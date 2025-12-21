"use client";

import { useState } from "react";
import { HiArrowRight } from "react-icons/hi2";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

export default function BioCreationForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [slug, setSlug] = useState("");
    const [title, setTitle] = useState("");
    const [bio, setBio] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("slug", slug);
        formData.append("title", title);
        formData.append("bio", bio);

        try {
            // We use fetch instead of form action to handle errors and loading state better
            // Ideally we could keep using action="/api/bio/create" if we want native behavior, 
            // but fetching allows us to show toast errors easily.
            // However, the existing API redirects on success. 
            // Fetch will follow redirect automatically, but we might want to handle it manually.

            // Let's stick to simple submit via fetch for better UX control
            const res = await fetch("/api/bio/create", {
                method: "POST",
                body: formData
            });

            if (res.redirected) {
                window.location.href = res.url;
                return;
            }

            // If API returns JSON error (e.g. slug taken)
            const data = await res.json().catch(() => ({}));

            if (res.ok) {
                // Should have redirected, but if not:
                toast.success("Bio Page Created!");
                router.refresh();
            } else {
                toast.error(data.error || "Failed to create bio page");
                setIsSubmitting(false);
            }

        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <LoadingOverlay isLoading={isSubmitting} message="Activating Bio Page..." />
            <form onSubmit={handleSubmit} className="w-full space-y-6 text-left max-w-md">
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text-alt font-black uppercase tracking-widest opacity-40 text-[10px]">Handle (Slug)</span>
                    </label>
                    <div className="join w-full">
                        <span className="join-item bg-base-200 flex items-center px-4 font-black text-sm opacity-50 border border-base-300 border-r-0">linkpeak.com/</span>
                        <input
                            type="text"
                            name="slug"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            required
                            placeholder="identity"
                            className="input input-bordered join-item w-full outline-none focus:border-primary font-black transition-all"
                        />
                    </div>
                </div>

                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text-alt font-black uppercase tracking-widest opacity-40 text-[10px]">Display Name</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="The Peak Professional"
                        className="input input-bordered w-full outline-none focus:border-primary font-black transition-all"
                    />
                </div>

                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text-alt font-black uppercase tracking-widest opacity-40 text-[10px]">Bio Narrative</span>
                    </label>
                    <textarea
                        name="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        required
                        placeholder="Briefly describe your current peaks..."
                        rows={3}
                        className="textarea textarea-bordered w-full outline-none focus:border-primary font-medium resize-none transition-all"
                    />
                </div>

                <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full rounded-2xl h-16 text-lg font-black shadow-xl shadow-primary/20 gap-3 group">
                    Activate My Bio Page
                    <HiArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
                </button>
            </form>
        </>
    );
}
