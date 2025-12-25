import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SupportTicket from "@/models/SupportTicket";
import { getAuthUser } from "@/lib/auth";
import User from "@/models/User"; // Ensure User model is loaded

export async function POST(req, { params }) {
    try {
        const session = await getAuthUser();
        // Await params for Next.js 15+ compatibility
        const { id } = await params;
        console.log("Reply Route Hit. ID:", id, "Session:", session?.id);

        if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

        await dbConnect();
        const { message } = await req.json();

        if (!message || !message.trim()) {
            return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 });
        }

        const ticket = await SupportTicket.findById(id);
        if (!ticket) {
            return NextResponse.json({ success: false, error: "Ticket not found" }, { status: 404 });
        }

        // Get full user details to check role
        const user = await User.findById(session.id);
        const isAdmin = user.role === "admin";

        // Authorization Check: Must be admin OR ticket owner
        if (!isAdmin && ticket.userId.toString() !== session.id) {
            return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        }

        // Add Reply
        const reply = {
            senderId: session.id,
            senderName: user.name || "User",
            role: isAdmin ? "admin" : "user",
            message: message.trim(),
            createdAt: new Date(),
        };

        // Initialize replies array if it doesn't exist (legacy data protection)
        if (!ticket.replies) {
            ticket.replies = [];
        }

        // Ensure category exists (legacy data protection)
        if (!ticket.category) {
            ticket.category = "General";
        }

        ticket.replies.push(reply);

        // Update status if replied by admin (e.g., to PENDING or answered state)
        // If user replies, maybe set to OPEN?
        if (isAdmin) {
            ticket.status = "PENDING"; // Admin replied, waiting for user
        } else {
            ticket.status = "OPEN"; // User replied, needs admin attention
        }

        await ticket.save();

        // Populate userId so the frontend can display user details
        await ticket.populate('userId', 'name email');

        return NextResponse.json({ success: true, data: ticket });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
