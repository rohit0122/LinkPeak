import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    secure: process.env.NODEMAILER_PORT === "465",
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
    },
});

export async function sendEmail({ to, subject, html }) {
    try {
        const info = await transporter.sendMail({
            from: `"${process.env.SITE_NAME || "LinkPeak"}" <${process.env.NODEMAILER_USER_SENDER}>`,
            to,
            subject,
            html,
        });
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Email error:", error);
        return { success: false, error: error.message };
    }
}

export async function sendVerificationEmail(email, token) {
    const verifyUrl = `${process.env.SITE_URL}/verify?token=${token}`;

    const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #333; text-align: center;">Verify Your Email</h2>
      <p>Thank you for signing up for LinkPeak! Please click the button below to verify your email address and activate your account.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verifyUrl}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
      </div>
      <p>If you did not create an account, please ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #777; text-align: center;">&copy; 2025 LinkPeak. All rights reserved.</p>
    </div>
  `;

    return await sendEmail({ to: email, subject: "Verify your LinkPeak account", html });
}
