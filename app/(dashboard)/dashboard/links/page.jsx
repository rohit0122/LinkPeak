import RoleGate from "@/components/dashboard/RoleGate";
import { PERMISSIONS } from "@/lib/roles";
import { HiPlus, HiArrowRight } from "react-icons/hi2";

import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db/connect";
import BioPage from "@/lib/db/models/BioPage";
import User from "@/lib/db/models/User";
import LinkModel from "@/lib/db/models/Link";
import LinkEditor from "@/components/dashboard/LinkEditor";
import { redirect } from "next/navigation";

export default async function LinksPage() {
    const { userId } = await auth();
    if (!userId) {
        redirect("/");
    }

    try {
        console.log("LinksPage: Connecting DB...");
        await connectDB();
        console.log("LinksPage: DB Connected.");

        // Ensure user exists in local DB
        console.log("LinksPage: Finding User...");
        let mongoUser = await User.findOne({ clerkId: userId });
        if (!mongoUser) {
            console.log("LinksPage: Creating User...");
            mongoUser = await User.create({
                clerkId: userId,
                email: "user@example.com",
                subscriptionTier: "Free",
            });
        }

        console.log("LinksPage: Finding BioPage...");
        let page = await BioPage.findOne({ ownerId: userId });

        // If no bio page exists, show create page screen
        if (!page) {
            console.log("LinksPage: No BioPage found, rendering creation form.");
            return (
                <div className="max-w-2xl mx-auto py-20 px-4">
                    <div className="card bg-base-100 border border-base-200 shadow-2xl overflow-hidden group">
                        <div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent" />
                        <div className="card-body p-8 sm:p-12 items-center text-center space-y-8">
                            <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-primary to-secondary p-[2px] rotate-6 group-hover:rotate-12 transition-transform duration-500 shadow-2xl shadow-primary/20">
                                <div className="w-full h-full rounded-[2rem] bg-base-100 flex items-center justify-center">
                                    <HiPlus className="text-5xl text-primary" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h1 className="text-5xl font-black tracking-tighter">Initiate Peak</h1>
                                <p className="text-base-content/50 font-medium max-w-sm mx-auto">
                                    Select your unique handle before adding links to your profile.
                                </p>
                            </div>

                            <form action="/api/bio/create" method="POST" className="w-full space-y-6 text-left max-w-md">
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text-alt font-black uppercase tracking-widest opacity-40 text-[10px]">Handle (Slug)</span>
                                    </label>
                                    <div className="join w-full">
                                        <span className="join-item bg-base-200 flex items-center px-4 font-black text-sm opacity-50 border border-base-300 border-r-0">linkpeak.com/</span>
                                        <input
                                            type="text"
                                            name="slug"
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
                                        required
                                        placeholder="Briefly describe your current peaks..."
                                        rows={3}
                                        className="textarea textarea-bordered w-full outline-none focus:border-primary font-medium resize-none transition-all"
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary w-full rounded-2xl h-16 text-lg font-black shadow-xl shadow-primary/20 gap-3 group">
                                    Activate My Bio Page
                                    <HiArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            );
        }

        const initialLinksList = await LinkModel.find({ pageId: page._id }).sort({ priorityScore: -1 });

        return (
            <div className="pb-40">
                <LinkEditor
                    initialLinks={JSON.parse(JSON.stringify(initialLinksList))}
                    pageId={page._id.toString()}
                />
            </div>
        );
    } catch (error) {
        console.error("LinksPage Error:", error);
        return (
            <div className="alert alert-error font-bold rounded-2xl shadow-xl">
                System Pulse Interrupted: {error.message}. Please refresh or check infrastructure logs.
            </div>
        );
    }
}
