import Link from "next/link";
import { CONFIG } from "@/constants/config";

export const metadata = {
    title: `Terms of Service | ${CONFIG.SITE_NAME}`,
    description: `Terms of Service for ${CONFIG.SITE_NAME} - Read our terms and conditions for using our bio link service.`,
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-base-100">
            <div className="max-w-4xl mx-auto px-6 py-16">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mt-8 mb-4">Terms of Service</h1>
                    <p className="text-sm opacity-60">Last Updated: December 31, 2024</p>
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using {CONFIG.SITE_NAME} ("Service"), you agree to be bound by these Terms of Service ("Terms").
                            If you do not agree to these Terms, please do not use our Service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
                        <p>
                            {CONFIG.SITE_NAME} is a bio link service that allows users to create customizable link-in-bio pages.
                            Our Service includes:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Customizable bio page templates</li>
                            <li>Link management and organization</li>
                            <li>Analytics and performance tracking</li>
                            <li>Profile customization (images, themes, branding)</li>
                            <li>QR code generation</li>
                            <li>Multiple subscription tiers (FREE, PRO, AGENCY)</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
                        <h3 className="text-xl font-semibold mb-2">3.1 Registration</h3>
                        <p>
                            You must create an account to use certain features of our Service. You agree to provide accurate,
                            current, and complete information during registration and to update such information to keep it accurate.
                        </p>
                        <h3 className="text-xl font-semibold mb-2 mt-4">3.2 Account Security</h3>
                        <p>
                            You are responsible for maintaining the confidentiality of your account credentials and for all
                            activities that occur under your account. Notify us immediately of any unauthorized use.
                        </p>
                        <h3 className="text-xl font-semibold mb-2 mt-4">3.3 Account Termination</h3>
                        <p>
                            We reserve the right to suspend or terminate your account if you violate these Terms or engage
                            in fraudulent, abusive, or illegal activities. You may also delete your account at any time through your dashboard settings.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">4. Subscription Plans and Billing</h2>
                        <h3 className="text-xl font-semibold mb-2">4.1 Plan Tiers</h3>
                        <p>We offer the following subscription plans:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>FREE:</strong> Limited features, up to 5 links, 1 page, basic templates</li>
                            <li><strong>PRO ($9/month):</strong> Up to 1000 links, advanced templates, 90-day analytics, custom QR codes</li>
                            <li><strong>AGENCY ($49/month):</strong> Up to 10 pages, unlimited links, all templates, white-labeling, unlimited analytics</li>
                        </ul>
                        <h3 className="text-xl font-semibold mb-2 mt-4">4.2 Billing</h3>
                        <p>
                            Paid subscriptions are billed monthly in advance. You authorize us to charge your payment method
                            for recurring subscription fees. Prices are subject to change with 30 days notice.
                        </p>
                        <h3 className="text-xl font-semibold mb-2 mt-4">4.3 Cancellation and Refunds</h3>
                        <p>
                            We want you to buy with confidence, which is why we offer a 24-hour full-access trial for PRO and AGENCY plans to evaluate the platform.
                            You may cancel your subscription or delete your account at any time through your dashboard.
                        </p>
                        <p className="mt-2">
                            Cancellations take effect at the end of the current billing period. Due to the access provided during the trial period, we do not offer refunds on cancellations or account deletions. No refunds or cancellation refunds are applicable once a paid subscription begins.
                        </p>
                        <h3 className="text-xl font-semibold mb-2 mt-4">4.4 Data Retention after Expiration</h3>
                        <p>
                            If your plan expires or is cancelled, your account will transition to the FREE tier. Your data remains safe in our database; however, extra pages and premium themes will be archived. You can restore access to all premium features and archived content instantly by renewing your plan.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">5. Content Ownership and License</h2>
                        <h3 className="text-xl font-semibold mb-2">5.1 Your Content</h3>
                        <p>
                            You retain all rights to the content you upload to {CONFIG.SITE_NAME} (profile images, links, text, etc.).
                            By uploading content, you grant us a worldwide, non-exclusive license to host, store, and display
                            your content as necessary to provide the Service.
                        </p>
                        <h3 className="text-xl font-semibold mb-2 mt-4">5.2 Our Content</h3>
                        <p>
                            All intellectual property rights in the Service, including templates, designs, logos, and software,
                            are owned by {CONFIG.SITE_NAME}. You may not copy, modify, or distribute our content without permission.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">6. Prohibited Uses</h2>
                        <p>You agree not to use the Service to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Violate any laws or regulations</li>
                            <li>Infringe on intellectual property rights of others</li>
                            <li>Distribute malware, spam, or harmful content</li>
                            <li>Impersonate others or misrepresent your affiliation</li>
                            <li>Engage in fraudulent or deceptive practices</li>
                            <li>Harass, abuse, or harm others</li>
                            <li>Scrape or data mine our Service</li>
                            <li>Interfere with the proper functioning of the Service</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">7. Analytics and Tracking</h2>
                        <p>
                            We provide analytics features that track views, clicks, and likes on your bio page. This data
                            is collected to help you understand your audience. We do not sell this data to third parties.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">8. Limitation of Liability</h2>
                        <p>
                            TO THE MAXIMUM EXTENT PERMITTED BY LAW, {CONFIG.SITE_NAME.toUpperCase()} SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
                            SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, DATA LOSS, OR BUSINESS INTERRUPTION,
                            ARISING FROM YOUR USE OF THE SERVICE.
                        </p>
                        <p className="mt-4">
                            Our total liability for any claims related to the Service shall not exceed the amount you paid us
                            in the 12 months preceding the claim.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">9. Disclaimer of Warranties</h2>
                        <p>
                            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
                            WE DO NOT GUARANTEE THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">10. Indemnification</h2>
                        <p>
                            You agree to indemnify and hold harmless {CONFIG.SITE_NAME} from any claims, damages, losses, or expenses
                            (including legal fees) arising from your use of the Service or violation of these Terms.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">11. Changes to Terms</h2>
                        <p>
                            We may modify these Terms at any time. We will notify you of material changes via email or through
                            the Service. Continued use of the Service after changes constitutes acceptance of the new Terms.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">12. Governing Law</h2>
                        <p>
                            These Terms shall be governed by and construed in accordance with the laws of {CONFIG.JURISDICTION},
                            without regard to its conflict of law provisions.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">13. Contact Us</h2>
                        <p>
                            If you have questions about these Terms, please contact us at:
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
