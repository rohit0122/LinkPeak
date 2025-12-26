import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import BioPage from "@/models/BioPage";
import Link from "@/models/Link";
import Analytics from "@/models/Analytics";
import SupportTicket from "@/models/SupportTicket";
import NewsletterUser from "@/models/NewsletterUser";
import Subscription from "@/models/Subscription";
import { getAuthUser } from "@/lib/auth";

export async function DELETE(req) {
    try {
        await dbConnect();

        // 1. Verify Authentication
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = user.id;
        const userEmail = user.email;

        // 2. Begin Deletion Process
        console.log(`[DANGER] Starting account deletion for user: ${userId} (${userEmail})`);

        // Get user's pages to delete associated links and analytics
        const userPages = await BioPage.find({ userId });
        const pageIds = userPages.map(page => page._id);

        // Delete Links associated with user's pages
        const deletedLinks = await Link.deleteMany({ pageId: { $in: pageIds } });
        console.log(`Deleted ${deletedLinks.deletedCount} links`);

        // Delete Analytics associated with user's pages
        const deletedAnalytics = await Analytics.deleteMany({ pageId: { $in: pageIds } });
        console.log(`Deleted ${deletedAnalytics.deletedCount} analytics records`);

        // Delete BioPages
        const deletedPages = await BioPage.deleteMany({ userId });
        console.log(`Deleted ${deletedPages.deletedCount} bio pages`);

        // Delete Support Tickets
        const deletedTickets = await SupportTicket.deleteMany({ userId });
        console.log(`Deleted ${deletedTickets.deletedCount} support tickets`);

        // Delete Subscription Records
        const deletedSubscriptions = await Subscription.deleteMany({ userId });
        console.log(`Deleted ${deletedSubscriptions.deletedCount} subscription records`);

        // Remove from Newsletter if subscribed
        // We act conservatively here and only delete if exact email match
        const deletedSubscriber = await NewsletterUser.findOneAndDelete({ email: userEmail });
        if (deletedSubscriber) {
            console.log(`Removed user from newsletter`);
        }

        // Finally, Delete the User
        await User.findByIdAndDelete(userId);
        console.log(`User account deleted successfully`);

        // 3. Clear Auth Cookie
        // Note: verify-token middleware might also check, but we clear it here to be safe
        const cookieStore = await cookies();
        cookieStore.delete("token");

        return NextResponse.json(
            {
                success: true,
                message: "Account and all associated data permanently deleted."
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Account deletion error:", error);
        return NextResponse.json(
            { error: "Failed to delete account. Please try again or contact support." },
            { status: 500 }
        );
    }
}
