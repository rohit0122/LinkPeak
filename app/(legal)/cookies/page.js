import Link from "next/link";
import { CONFIG } from "@/constants/config";

export const metadata = {
    title: `Cookie Policy | ${CONFIG.SITE_NAME}`,
    description: `Cookie Policy for ${CONFIG.SITE_NAME} - Learn about how we use cookies and local storage.`,
};

export default function CookiesPage() {
    return (
        <div className="min-h-screen bg-base-100">
            <div className="max-w-4xl mx-auto px-6 py-16">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mt-8 mb-4">Cookie Policy</h1>
                    <p className="text-sm opacity-60">Last Updated: December 26, 2024</p>
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">1. What Are Cookies?</h2>
                        <p>
                            Cookies are small text files stored on your device when you visit a website. They help websites
                            remember your preferences and improve your experience.
                        </p>
                        <p className="mt-4">
                            <strong>Note:</strong> {CONFIG.SITE_NAME} primarily uses <strong>localStorage</strong> (a modern browser storage
                            technology) instead of traditional cookies. localStorage works similarly but offers better performance
                            and larger storage capacity.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">2. How We Use Cookies and Local Storage</h2>
                        <p>We use browser storage technologies for the following purposes:</p>
                    </section>

                    <section className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">2.1 Essential Storage (Required)</h3>
                        <p>These are necessary for the Service to function:</p>
                        <div className="overflow-x-auto mt-4">
                            <table className="table table-zebra w-full">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Purpose</th>
                                        <th>Duration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><code>auth_token</code></td>
                                        <td>Keeps you logged in to your account</td>
                                        <td>Session (until logout)</td>
                                    </tr>
                                    <tr>
                                        <td><code>user_session</code></td>
                                        <td>Maintains your session state</td>
                                        <td>Session</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">2.2 Performance Storage</h3>
                        <p>These improve loading speed and performance:</p>
                        <div className="overflow-x-auto mt-4">
                            <table className="table table-zebra w-full">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Purpose</th>
                                        <th>Duration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><code>linkpeak_img_v1_*</code></td>
                                        <td>Caches optimized profile images (base64 WebP)</td>
                                        <td>Until image updated</td>
                                    </tr>
                                    <tr>
                                        <td><code>page_cache_*</code></td>
                                        <td>Caches bio page data for faster loading</td>
                                        <td>24 hours</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="mt-4">
                            <strong>Benefit:</strong> Profile images load instantly on repeat visits (zero network requests),
                            saving bandwidth and improving speed.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">2.3 Analytics Storage</h3>
                        <p>These help us understand how the Service is used:</p>
                        <div className="overflow-x-auto mt-4">
                            <table className="table table-zebra w-full">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Purpose</th>
                                        <th>Duration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><code>viewed_pages_*</code></td>
                                        <td>Tracks which bio pages you've viewed (prevents duplicate view counts)</td>
                                        <td>24 hours</td>
                                    </tr>
                                    <tr>
                                        <td><code>clicked_links_*</code></td>
                                        <td>Tracks link clicks (prevents duplicate click counts)</td>
                                        <td>24 hours</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">2.4 Preference Storage</h3>
                        <p>These remember your preferences:</p>
                        <div className="overflow-x-auto mt-4">
                            <table className="table table-zebra w-full">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Purpose</th>
                                        <th>Duration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><code>theme_preference</code></td>
                                        <td>Remembers your selected theme (light/dark/etc.)</td>
                                        <td>Persistent</td>
                                    </tr>
                                    <tr>
                                        <td><code>dashboard_settings</code></td>
                                        <td>Saves dashboard layout preferences</td>
                                        <td>Persistent</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">3. Third-Party Cookies</h2>
                        <p>
                            We use minimal third-party services that may set their own cookies:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                <strong>Payment Processors (Razorpay):</strong> May set cookies during payment processing
                                for fraud prevention and security. See their privacy policy for details.
                            </li>
                        </ul>
                        <p className="mt-4">
                            We do <strong>not</strong> use third-party advertising or tracking cookies.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">4. Managing Cookies and Local Storage</h2>
                        <h3 className="text-xl font-semibold mb-2">4.1 Browser Settings</h3>
                        <p>
                            You can control and delete cookies and localStorage through your browser settings:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-4">
                            <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and site data</li>
                            <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
                            <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                            <li><strong>Edge:</strong> Settings → Privacy, search, and services → Cookies and site data</li>
                        </ul>

                        <h3 className="text-xl font-semibold mb-2 mt-6">4.2 Clear LinkPeak Data</h3>
                        <p>
                            To clear only {CONFIG.SITE_NAME}'s stored data:
                        </p>
                        <ol className="list-decimal pl-6 space-y-2 mt-4">
                            <li>Open your browser's Developer Tools (F12)</li>
                            <li>Go to the "Application" or "Storage" tab</li>
                            <li>Find "Local Storage" → "{CONFIG.SITE_URL}"</li>
                            <li>Click "Clear All" or delete individual items</li>
                        </ol>

                        <h3 className="text-xl font-semibold mb-2 mt-6">4.3 Impact of Disabling Storage</h3>
                        <p>
                            If you disable cookies and localStorage:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-4">
                            <li>You will be logged out and unable to stay logged in</li>
                            <li>Profile images will load slower (no caching)</li>
                            <li>Your theme and preferences won't be saved</li>
                            <li>Some features may not work properly</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">5. Updates to This Policy</h2>
                        <p>
                            We may update this Cookie Policy from time to time. Check this page periodically for changes.
                            The "Last Updated" date at the top indicates when changes were made.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">6. Contact Us</h2>
                        <p>
                            If you have questions about our use of cookies and localStorage, contact us:
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
