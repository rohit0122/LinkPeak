import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SupportTicket from "@/models/SupportTicket";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getAuthUser();
        if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

        await dbConnect();
        const tickets = await SupportTicket.find({ userId: session.id }).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: tickets });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getAuthUser();
        if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

        await dbConnect();
        const { subject, message, priority, category } = await req.json();

        const ticket = await SupportTicket.create({
            userId: session.id,
            subject,
            message,
            priority,
            category,
        });

        return NextResponse.json({ success: true, data: ticket });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
