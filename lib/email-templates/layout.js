import { CONFIG } from "@/constants/config";

export const PRIMARY_COLOR = "#6D28D9"; // Brand Purple
export const TEXT_COLOR = "#374151";
export const LIGHT_BG = "#F3F4F6";

// Inline Styles for Email Clients
export const STYLES = {
    body: `font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: ${TEXT_COLOR}; margin: 0; padding: 0; background-color: ${LIGHT_BG};`,
    wrapper: `width: 100%; table-layout: fixed; background-color: ${LIGHT_BG}; padding-bottom: 40px;`,
    container: `max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; margin-top: 40px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); font-family: 'Inter', sans-serif;`,
    header: `background: linear-gradient(135deg, ${PRIMARY_COLOR} 0%, #4C1D95 100%); padding: 40px 32px; text-align: center;`,
    logo: `font-size: 28px; font-weight: 800; color: #ffffff; text-decoration: none; letter-spacing: -1px; display: inline-block;`,
    logoSpan: `color: #A78BFA;`,
    content: `padding: 48px 40px; background-color: #ffffff;`,
    footer: `background-color: #F9FAFB; padding: 40px 32px; text-align: center; color: #6B7280; font-size: 14px; border-top: 1px solid #E5E7EB;`,
    button: `display: inline-block; background-color: ${PRIMARY_COLOR}; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; margin-top: 24px; box-shadow: 0 4px 6px -1px rgba(109, 40, 217, 0.2);`,
    h1: `margin-top: 0; color: #111827; font-size: 24px; font-weight: 700; margin-bottom: 24px;`,
    text: `font-size: 16px; color: #4B5563; margin-bottom: 24px; line-height: 1.6;`,
    link: `color: ${PRIMARY_COLOR}; text-decoration: underline;`,
    socialLink: `margin: 0 12px; color: #9CA3AF; text-decoration: none; font-weight: 500; font-size: 14px;`
};

export const emailLayout = ({ content, previewText, title }) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        /* Resets and Fonts only - Layout handled by inline styles */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        body { margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        img { border: 0; outline: none; text-decoration: none; display: block; }
        @media only screen and (max-width: 600px) {
            .container { width: 100% !important; margin-top: 0 !important; border-radius: 0 !important; }
            .content { padding: 32px 24px !important; }
            .button { width: 100% !important; box-sizing: border-box !important; text-align: center !important; }
        }
    </style>
</head>
<body style="${STYLES.body}">
    <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">${previewText}</div>
    
    <div style="${STYLES.wrapper}">
        <!-- Main Container -->
        <!--[if mso]>
        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        
        <div class="container" style="${STYLES.container}">
            
            <!-- Header -->
            <div style="${STYLES.header}">
                <a href="${CONFIG.SITE_URL}" style="${STYLES.logo}">
                    ${CONFIG.SITE_NAME}<span style="${STYLES.logoSpan}">.</span>
                </a>
            </div>

            <!-- Content -->
            <div class="content" style="${STYLES.content}">
                ${content}
            </div>

            <!-- Footer -->
            <div style="${STYLES.footer}">
                <p style="margin: 0 0 8px 0;">&copy; ${new Date().getFullYear()} ${CONFIG.SITE_NAME}. All rights reserved.</p>
                <p style="margin: 0 0 24px 0;">Empowering creators to peak their online presence.</p>
                
                <div style="margin-bottom: 24px;">
                    <a href="${CONFIG.SITE_URL}/dashboard" style="${STYLES.socialLink}">Dashboard</a>
                    <a href="${CONFIG.SITE_URL}/terms" style="${STYLES.socialLink}">Terms</a>
                    <a href="${CONFIG.SITE_URL}/privacy" style="${STYLES.socialLink}">Privacy</a>
                </div>

                <div style="font-size: 12px; color: #9CA3AF;">
                    You're receiving this because you signed up for ${CONFIG.SITE_NAME}.
                </div>
            </div>
        </div>
        
        <!--[if mso]>
        </td>
        </tr>
        </table>
        <![endif]-->
    </div>
</body>
</html>
`;
