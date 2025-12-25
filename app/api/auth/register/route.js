import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { sendVerificationEmail } from "@/lib/mailer";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
    try {
        await dbConnect();
        const { name, email, password, plan } = await req.json();

        // Validate plan if provided
        const validPlans = ["FREE", "PRO", "AGENCY"];
        const userPlan = plan && validPlans.includes(plan.toUpperCase()) ? plan.toUpperCase() : "FREE";

        const userExists = await User.findOne({ email });
        if (userExists) {
            return NextResponse.json({ success: false, error: "User already exists" }, { status: 400 });
        }

        const verificationToken = uuidv4();

        const user = await User.create({
            name,
            email,
            password,
            plan: userPlan,
            verificationToken,
        });

        await sendVerificationEmail(email, verificationToken);

        return NextResponse.json({
            success: true,
            message: "Registration successful. Please check your email to verify your account.",
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
