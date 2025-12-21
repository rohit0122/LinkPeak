import RoleGate from "@/components/dashboard/RoleGate";
import { PERMISSIONS } from "@/lib/roles";
import { HiPlus, HiArrowRight } from "react-icons/hi2";
import BioCreationForm from "@/components/dashboard/BioCreationForm";

import connectDB from "@/lib/db/connect";
import BioPage from "@/lib/db/models/BioPage";
import User from "@/lib/db/models/User";
import LinkModel from "@/lib/db/models/Link";
import LinkEditor from "@/components/dashboard/LinkEditor";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/jwt";

export default async function LinksPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        redirect("/login");
    }

    const payload = await verifyToken(token);
    if (!payload) {
        redirect("/login");
    }

    const userId = payload.userId;

    try {
        await connectDB();
        const user = await User.findById(userId);
        if (!user) redirect("/login");

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

                            <BioCreationForm />
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
                    initialTheme={page.themeConfig?.name || "creator"}
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
