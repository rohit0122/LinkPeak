import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import BioPage from "@/models/BioPage";
import { sendWelcomeEmail } from "@/lib/mailer";

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const lpkSiteToken = searchParams.get("lpkSiteToken");
        if (!lpkSiteToken) {
            return NextResponse.json({ success: false, error: "No lpkSiteToken provided" }, { status: 400 });
        }

        const currentUser = await User.findOne({ verificationToken: lpkSiteToken });

        if (!currentUser) {
            return NextResponse.json({ success: false, error: "Invalid or expired lpkSiteToken" }, { status: 400 });
        }

        currentUser.isVerified = true;
        currentUser.verificationToken = null;
        currentUser.isActive = true;
        await currentUser.save();

        // Create default BioPage for the currentUser
        try {
            const defaultSlug = currentUser.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + "-" + Math.floor(Math.random() * 1000);
            await BioPage.create({
                userId: currentUser._id,
                slug: defaultSlug,
                title: `${currentUser.name}'s Bio`,
                bio: "Welcome to my link-in-bio page!",
                template: "classic",
                theme: "light"
            });
        } catch (pageError) {
            console.error("Failed to create default bio page:", pageError);
            // Continue execution, as verification was successful
        }

        // Send Welcome Email
        try {
            await sendWelcomeEmail(currentUser.email, currentUser.name || "Creator");
        } catch (mailError) {
            console.error("Welcome email failed but verification succeeded:", mailError);
        }

        return NextResponse.json({
            success: true,
            message: "Email verified successfully. You can now log in.",
        });
    } catch (error) {
        //console.log(error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
