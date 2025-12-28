import { NextResponse } from "next/server"
import { sendWelcomeEmail } from "@/lib/mailer"

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url)
        const to = searchParams.get("to") || "rohits0122@yahoo.com"

        console.log(`Sending test email to: ${to}`)

        const result = await sendWelcomeEmail(to, "Test User")

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: `Test email sent successfully to ${to}`,
                messageId: result.messageId
            })
        } else {
            return NextResponse.json({
                success: false,
                error: result.error,
                details: "Check server logs for more information."
            }, { status: 500 })
        }
    } catch (error) {
        console.error("Test email route error:", error)
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 })
    }
}
