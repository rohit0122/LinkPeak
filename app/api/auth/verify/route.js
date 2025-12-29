import { NextResponse } from "next/server";
import UserRepository from "@/lib/repositories/UserRepository";
import BioPageRepository from "@/lib/repositories/BioPageRepository";
import { sendWelcomeEmail } from "@/lib/mailer";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get("token");
        if (!token) {
            return NextResponse.json({ success: false, error: "No token provided" }, { status: 400 });
        }

        const user = await UserRepository.findByVerificationToken(token);

        if (!user) {
            return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 400 });
        }

        user.isVerified = true;
        user.verificationToken = null;
        user.isActive = true;
        await UserRepository.save(user);

        // Create default BioPage for the user
        try {
            const defaultSlug = user.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + "-" + Math.floor(Math.random() * 1000);
            await BioPageRepository.create({
                userId: user._id,
                slug: defaultSlug,
                title: `${user.name}'s Bio`,
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
            await sendWelcomeEmail(user.email, user.name || "Creator");
        } catch (mailError) {
            console.error("Welcome email failed but verification succeeded:", mailError);
        }

        return NextResponse.json({
            success: true,
            message: "Email verified successfully. You can now log in.",
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
