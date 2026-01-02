import Link from "next/link";
import { CONFIG } from "@/constants/config";

export const metadata = {
    title: `Privacy Policy | ${CONFIG.SITE_NAME}`,
    description: `Privacy Policy for ${CONFIG.SITE_NAME} - Learn how we collect, use, and protect your personal information.`,
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-base-100">
            <div className="max-w-4xl mx-auto px-6 py-16">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mt-8 mb-4">Privacy Policy</h1>
                    <p className="text-sm opacity-60">Last Updated: December 31, 2024</p>
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                        <p>
                            {CONFIG.SITE_NAME} ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
                            explains how we collect, use, disclose, and safeguard your information when you use our Service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
                        <h3 className="text-xl font-semibold mb-2">2.1 Information You Provide</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Account Information:</strong> Name, email address, password</li>
                            <li><strong>Profile Information:</strong> Bio text, profile images, custom URLs (slugs)</li>
                            <li><strong>Content:</strong> Links you create, link titles, icons, and descriptions</li>
                            <li><strong>Payment Information:</strong> Processed securely through third-party payment providers (we do not store credit card details)</li>
                            <li><strong>Support Communications:</strong> Messages you send to our support team</li>
                        </ul>

                        <h3 className="text-xl font-semibold mb-2 mt-4">2.2 Automatically Collected Information</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Analytics Data:</strong> Page views, link clicks, likes on your bio page</li>
                            <li><strong>Device Information:</strong> Browser type, operating system, IP address</li>
                            <li><strong>Usage Data:</strong> Features used, time spent on platform, interaction patterns</li>
                            <li><strong>Cookies and Local Storage:</strong> Session data, preferences, cached images</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
                        <p>We use your information to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Provide and maintain the Service</li>
                            <li>Process your subscription and payments</li>
                            <li>Display your bio page and links to visitors</li>
                            <li>Provide analytics about your bio page performance</li>
                            <li>Send service-related notifications and updates</li>
                            <li>Respond to your support requests</li>
                            <li>Improve and optimize our Service</li>
                            <li>Detect and prevent fraud or abuse</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">4. Data Storage and Security</h2>
                        <h3 className="text-xl font-semibold mb-2">4.1 Storage</h3>
                        <p>
                            Your data is stored in MongoDB databases hosted on secure servers. Profile images are stored
                            as optimized WebP base64 data URIs directly in the database. We also use browser localStorage
                            for caching to improve performance.
                        </p>
                        <h3 className="text-xl font-semibold mb-2 mt-4">4.2 Security Measures</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Passwords are hashed using bcrypt</li>
                            <li>HTTPS encryption for all data transmission</li>
                            <li>JWT-based authentication</li>
                            <li>Regular security audits and updates</li>
                            <li>Access controls and monitoring</li>
                        </ul>
                        <p className="mt-4">
                            While we implement industry-standard security measures, no method of transmission over the
                            internet is 100% secure. We cannot guarantee absolute security.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">5. Data Sharing and Disclosure</h2>
                        <h3 className="text-xl font-semibold mb-2">5.1 Public Information</h3>
                        <p>
                            Your bio page, including your profile image, bio text, and links, is publicly accessible to
                            anyone who visits your custom URL. Analytics data (views, clicks, likes) is only visible to you.
                        </p>
                        <h3 className="text-xl font-semibold mb-2 mt-4">5.2 Third-Party Service Providers</h3>
                        <p>We share data with:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Payment Processors:</strong> Razorpay (for subscription payments)</li>
                            <li><strong>Email Service:</strong> For transactional emails (account verification, notifications)</li>
                            <li><strong>Hosting Providers:</strong> For infrastructure and database hosting</li>
                        </ul>
                        <h3 className="text-xl font-semibold mb-2 mt-4">5.3 Legal Requirements</h3>
                        <p>
                            We may disclose your information if required by law, court order, or to protect our rights,
                            property, or safety.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">6. Your Rights and Choices</h2>
                        <h3 className="text-xl font-semibold mb-2">6.1 Access and Correction</h3>
                        <p>
                            You can access and update your account information, profile, and links at any time through
                            your dashboard.
                        </p>
                        <h3 className="text-xl font-semibold mb-2 mt-4">6.2 Data Deletion</h3>
                        <p>
                            You can delete your account and all associated data by contacting us at {CONFIG.SUPPORT_EMAIL}.
                            We will process deletion requests within 30 days.
                        </p>
                        <h3 className="text-xl font-semibold mb-2 mt-4">6.3 Data Portability</h3>
                        <p>
                            You can export your data (links, analytics) in a machine-readable format by contacting support.
                        </p>
                        <h3 className="text-xl font-semibold mb-2 mt-4">6.4 Marketing Communications</h3>
                        <p>
                            You can opt out of marketing emails by clicking the unsubscribe link in any email. You will
                            still receive essential service-related communications.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">7. Cookies and Tracking</h2>
                        <p>
                            We use browser localStorage (not traditional cookies) to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Keep you logged in (JWT tokens)</li>
                            <li>Cache profile images for faster loading</li>
                            <li>Remember your preferences (theme, language)</li>
                            <li>Track which bio pages you&apos;ve viewed (to prevent duplicate view counts)</li>
                        </ul>
                        <p className="mt-4">
                            You can clear localStorage through your browser settings. See our{" "}
                            <Link href="/cookies-policy" className="text-primary hover:underline">Cookie Policy</Link> for details.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">8. Children's Privacy</h2>
                        <p>
                            Our Service is not intended for children under 13. We do not knowingly collect personal
                            information from children. If you believe a child has provided us with personal information,
                            please contact us.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">9. International Data Transfers</h2>
                        <p>
                            Your information may be transferred to and processed in countries other than your own. We ensure
                            appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">10. GDPR Compliance (EU Users)</h2>
                        <p>If you are in the European Union, you have additional rights:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Right to access your personal data</li>
                            <li>Right to rectification of inaccurate data</li>
                            <li>Right to erasure ("right to be forgotten")</li>
                            <li>Right to restrict processing</li>
                            <li>Right to data portability</li>
                            <li>Right to object to processing</li>
                            <li>Right to withdraw consent</li>
                        </ul>
                        <p className="mt-4">
                            To exercise these rights, contact us at {CONFIG.SUPPORT_EMAIL}.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">11. CCPA Compliance (California Users)</h2>
                        <p>If you are a California resident, you have the right to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Know what personal information we collect</li>
                            <li>Know whether we sell or disclose your personal information (we don&apos;t)</li>
                            <li>Access your personal information</li>
                            <li>Delete your personal information</li>
                            <li>Opt-out of the sale of personal information (not applicable)</li>
                            <li>Non-discrimination for exercising your rights</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">12. Changes to This Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. We will notify you of material changes
                            via email or through the Service. Continued use after changes constitutes acceptance.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">13. Contact Us</h2>
                        <p>
                            If you have questions about this Privacy Policy or want to exercise your rights, contact us:
                        </p>
                        <p className="mt-2">
                            Email: <a href={`mailto:${CONFIG.SUPPORT_EMAIL}`} className="text-primary hover:underline">
                                {CONFIG.SUPPORT_EMAIL}
                            </a>
                        </p>
                    </section>
                </div>

            </div>
        </div>
    );
}