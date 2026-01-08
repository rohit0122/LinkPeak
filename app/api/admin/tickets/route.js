import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SupportTicket from "@/models/SupportTicket";
import UserModel from "@/models/User";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

async function checkAdmin(req) {
    const lpkSiteToken = req.cookies.get("lpkSiteToken")?.value;
    if (!lpkSiteToken) return null;
    try {
        const { payload } = await jwtVerify(lpkSiteToken, secret);
        return payload.role === "admin" ? payload : null;
    } catch {
        return null;
    }
}

export async function GET(req) {
    try {
        if (!(await checkAdmin(req))) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Find all tickets and populate currentUser info
        const tickets = await SupportTicket.find({})
            .populate("userId", "name email")
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: tickets });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        if (!(await checkAdmin(req))) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { ticketId, updates } = await req.json();

        if (!ticketId) {
            return NextResponse.json({ success: false, error: "Ticket ID required" }, { status: 400 });
        }

        const ticket = await SupportTicket.findByIdAndUpdate(ticketId, updates, { new: true });

        return NextResponse.json({ success: true, data: ticket });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
