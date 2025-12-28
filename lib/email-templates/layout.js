import { CONFIG } from "@/constants/config";

const PRIMARY_COLOR = "#6D28D9"; // Matching the Brand Purple

export const emailLayout = ({ content, previewText, title }) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1F2937; margin: 0; padding: 0; background-color: #F9FAFB; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 20px; margin-bottom: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header { background-color: #ffffff; padding: 32px; text-align: center; border-bottom: 1px solid #F3F4F6; }
        .content { padding: 40px 32px; }
        .footer { background-color: #FBFBFB; padding: 32px; text-align: center; color: #6B7280; font-size: 14px; border-top: 1px solid #F3F4F6; }
        .logo { font-size: 24px; font-weight: 700; color: #111827; text-decoration: none; letter-spacing: -1px; }
        .logo span { color: ${PRIMARY_COLOR}; font-style: italic; }
        .button { display: inline-block; background-color: ${PRIMARY_COLOR}; color: #ffffff !important; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; margin-top: 24px; }
        .social-link { margin: 0 8px; color: #9CA3AF; text-decoration: none; }
        .preview-text { display: none; max-height: 0; overflow: hidden; }
    </style>
</head>
<body>
    <div class="preview-text">${previewText}</div>
    <div class="container">
        <div class="header">
            <a href="${CONFIG.SITE_URL}" class="logo">${CONFIG.SITE_NAME}<span>.</span></a>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${CONFIG.SITE_NAME}. All rights reserved.</p>
            <div style="margin-top: 16px;">
                <a href="${CONFIG.SITE_URL}/privacy" class="social-link">Privacy</a>
                <a href="${CONFIG.SITE_URL}/terms" class="social-link">Terms</a>
                <a href="${CONFIG.SITE_URL}/contact" class="social-link">Support</a>
            </div>
        </div>
    </div>
</body>
</html>
`;
