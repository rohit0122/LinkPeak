import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import NewsletterUser from "@/models/NewsletterUser";

export async function POST(req) {
    try {
        await dbConnect();
        const { email } = await req.json();

        if (!email || !email.includes("@")) {
            return NextResponse.json(
                { error: "Please provide a valid email address." },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingUser = await NewsletterUser.findOne({ email });

        if (existingUser) {
            if (!existingUser.isActive) {
                // Reactivate subscription if previously unsubscribed
                existingUser.isActive = true;
                await existingUser.save();
                return NextResponse.json(
                    { message: "Welcome back! You've successfully resubscribed to our newsletter." },
                    { status: 200 }
                );
            }
            return NextResponse.json(
                { error: "This email is already subscribed to our newsletter." },
                { status: 409 } // Conflict
            );
        }

        // Create new newsletter user
        await NewsletterUser.create({ email });

        return NextResponse.json(
            { message: "Thank you for subscribing! You've been added to our newsletter." },
            { status: 201 }
        );
    } catch (error) {
        console.error("Newsletter subscription error:", error);

        // Handle duplicate key error (if race condition occurs)
        if (error.code === 11000) {
            return NextResponse.json(
                { error: "This email is already subscribed." },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: "Something went wrong. Please try again later." },
            { status: 500 }
        );
    }
}
