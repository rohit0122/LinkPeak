import { CONFIG } from "@/constants/config";
import LegalPageClient from "@/components/shared/LegalPageClient";

export const metadata = {
    title: `Terms and Conditions | ${CONFIG.SITE_NAME}`,
    description: `Read the Terms of Service for ${CONFIG.SITE_NAME}. Understand your rights and responsibilities when using our AI-powered bio link platform.`,
    alternates: {
        canonical: `${CONFIG.SITE_URL}/terms-and-conditions`,
    },
};

export default function TermsPage() {
    const sections = [
        { id: "acceptance", title: "1. Acceptance of Terms" },
        { id: "description", title: "2. Description of Service" },
        { id: "accounts", title: "3. User Accounts" },
        { id: "billing", title: "4. Billing & Plans" },
        { id: "ownership", title: "5. Content Ownership" },
        { id: "prohibited", title: "6. Prohibited Uses" },
        { id: "analytics", title: "7. Analytics" },
        { id: "liability", title: "8. Limitation of Liability" },
        { id: "disclaimer", title: "9. Disclaimer" },
        { id: "indemnity", title: "10. Indemnification" },
        { id: "changes", title: "11. Changes to Terms" },
        { id: "governing", title: "12. Governing Law" },
        { id: "contact", title: "13. Contact Us" },
    ];

    return (
        <LegalPageClient
            title="Terms of Service"
            lastUpdated="February 14, 2026"
            sections={sections}
        >
            <section id="acceptance" className="mb-12 scroll-mt-24">
                <h2 className="text-3xl font-bold mb-6">1. Acceptance of Terms</h2>
                <p>
                    By accessing or using {CONFIG.SITE_NAME} (&quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;).
                    If you do not agree to these Terms, please do not use our Service.
                </p>
            </section>

            <section id="description" className="mb-12 scroll-mt-24">
                <h2 className="text-3xl font-bold mb-6">2. Description of Service</h2>
                <p>
                    {CONFIG.SITE_NAME} is a bio link service that allows users to create customizable link-in-bio pages.
                    Our Service includes:
                </p>
                <ul>
                    <li>Customizable bio page templates</li>
                    <li>Link management and organization</li>
                    <li>Analytics and performance tracking</li>
                    <li>Profile customization (images, themes, branding)</li>
                    <li>QR code generation</li>
                    <li>Multiple plan tiers (FREE, PRO, AGENCY)</li>
                </ul>
            </section>

            <section id="accounts" className="mb-12 scroll-mt-24">
                <h2 className="text-3xl font-bold mb-6">3. User Accounts</h2>
                <h3 className="text-xl font-bold mb-4 mt-8">3.1 Registration</h3>
                <p>
                    You must create an account to use certain features of our Service. You agree to provide accurate,
                    current, and complete information during registration and to update such information to keep it accurate.
                </p>
                <h3 className="text-xl font-bold mb-4 mt-8">3.2 Account Security</h3>
                <p>
                    You are responsible for maintaining the confidentiality of your account credentials and for all
                    activities that occur under your account. Notify us immediately of any unauthorized use.
                </p>
                <h3 className="text-xl font-bold mb-4 mt-8">3.3 Account Termination</h3>
                <p>
                    We reserve the right to suspend or terminate your account if you violate these Terms or engage
                    in fraudulent, abusive, or illegal activities. You may also delete your account at any time through your dashboard settings.
                </p>
            </section>

            <section id="billing" className="mb-12 scroll-mt-24">
                <h2 className="text-3xl font-bold mb-6">4. Payment Plans and Billing</h2>
                <h3 className="text-xl font-bold mb-4 mt-8">4.1 Plan Tiers</h3>
                <p>We offer the following Paid Access plans:</p>
                <ul>
                    <li><strong>FREE:</strong> Limited features, up to 5 links, 1 page, basic templates</li>
                    <li><strong>PRO ($9 / 30 Days):</strong> Unlimited links (up to 1000 links), advanced templates, 90-day analytics, custom QR codes</li>
                    <li><strong>AGENCY ($49 / 30 Days):</strong> Up to 10 pages, unlimited links (up to 1000 links per bio page), all templates, white-labeling, unlimited analytics</li>
                </ul>
                <h3 className="text-xl font-bold mb-4 mt-8">4.2 Billing</h3>
                <p>
                    Payments are processed as one-time transactions for the selected period (typically 30 days).
                    There are no automatic recurring charges. You must manually renew your plan to maintain
                    continuous access to premium features. Prices are subject to change with 30 days notice.
                </p>
                <h3 className="text-xl font-bold mb-4 mt-8">4.3 Cancellation and Refunds</h3>
                <p>
                    We want you to buy with confidence, which is why we offer a 7 days full-access trial for PRO and AGENCY plans to evaluate the platform.
                    You may manage your plan or delete your account at any time through your dashboard.
                </p>
                <p className="bg-base-200 p-6 rounded-2xl border border-base-300 font-medium">
                    Plan access takes effect immediately upon successful payment. Due to the digital nature of the services and the trial provided, we do not offer refunds once a paid term has started.
                </p>
                <h3 className="text-xl font-bold mb-4 mt-8">4.4 Data Retention after Expiration</h3>
                <p>
                    If your plan expires or is cancelled, your account will transition to the FREE tier. Your data remains safe in our database; however, extra pages and premium themes will be archived. You can restore access to all premium features and archived content instantly by renewing your plan.
                </p>
            </section>

            <section id="ownership" className="mb-12 scroll-mt-24">
                <h2 className="text-3xl font-bold mb-6">5. Content Ownership and License</h2>
                <h3 className="text-xl font-bold mb-4 mt-8">5.1 Your Content</h3>
                <p>
                    You retain all rights to the content you upload to {CONFIG.SITE_NAME} (profile images, links, text, etc.).
                    By uploading content, you grant us a worldwide, non-exclusive license to host, store, and display
                    your content as necessary to provide the Service.
                </p>
                <h3 className="text-xl font-bold mb-4 mt-8">5.2 Our Content</h3>
                <p>
                    All intellectual property rights in the Service, including templates, designs, logos, and software,
                    are owned by {CONFIG.SITE_NAME}. You may not copy, modify, or distribute our content without permission.
                </p>
            </section>

            <section id="prohibited" className="mb-12 scroll-mt-24">
                <h2 className="text-3xl font-bold mb-6">6. Prohibited Uses</h2>
                <p>You agree not to use the Service to:</p>
                <ul>
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

            <section id="analytics" className="mb-12 scroll-mt-24">
                <h2 className="text-3xl font-bold mb-6">7. Analytics and Tracking</h2>
                <p>
                    We provide analytics features that track views, clicks, and likes on your bio page. This data
                    is collected to help you understand your audience. We do not sell this data to third parties.
                </p>
            </section>

            <section id="liability" className="mb-12 scroll-mt-24">
                <h2 className="text-3xl font-bold mb-6">8. Limitation of Liability</h2>
                <p className="uppercase font-bold text-error/80">
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, {CONFIG.SITE_NAME.toUpperCase()} SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
                    SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, DATA LOSS, OR BUSINESS INTERRUPTION,
                    ARISING FROM YOUR USE OF THE SERVICE.
                </p>
                <p className="mt-4">
                    Our total liability for any claims related to the Service shall not exceed the amount you paid us
                    in the 12 months preceding the claim.
                </p>
            </section>

            <section id="disclaimer" className="mb-12 scroll-mt-24">
                <h2 className="text-3xl font-bold mb-6">9. Disclaimer of Warranties</h2>
                <p className="uppercase font-bold text-error/80">
                    THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
                    WE DO NOT GUARANTEE THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
                </p>
            </section>

            <section id="indemnity" className="mb-12 scroll-mt-24">
                <h2 className="text-3xl font-bold mb-6">10. Indemnification</h2>
                <p>
                    You agree to indemnify and hold harmless {CONFIG.SITE_NAME} from any claims, damages, losses, or expenses
                    (including legal fees) arising from your use of the Service or violation of these Terms.
                </p>
            </section>

            <section id="changes" className="mb-12 scroll-mt-24">
                <h2 className="text-3xl font-bold mb-6">11. Changes to Terms</h2>
                <p>
                    We may modify these Terms at any time. We will notify you of material changes via email or through
                    the Service. Continued use of the Service after changes constitutes acceptance of the new Terms.
                </p>
            </section>

            <section id="governing" className="mb-12 scroll-mt-24">
                <h2 className="text-3xl font-bold mb-6">12. Governing Law</h2>
                <p>
                    These Terms shall be governed by and construed in accordance with the laws of {CONFIG.JURISDICTION},
                    without regard to its conflict of law provisions.
                </p>
            </section>

            <section id="contact" className="mb-24 scroll-mt-24">
                <h2 className="text-3xl font-bold mb-6">13. Contact Us</h2>
                <p>
                    If you have questions about these Terms, please contact us at:
                </p>
                <p className="mt-4 flex items-baseline gap-2">
                    <span className="font-bold">Email:</span>
                    <a href={`mailto:${CONFIG.SUPPORT_EMAIL}`} className="text-primary hover:underline font-bold underline-offset-4 decoration-2">
                        {CONFIG.SUPPORT_EMAIL}
                    </a>
                </p>
            </section>
        </LegalPageClient>
    );
}
