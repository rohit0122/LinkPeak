import {
    RiMailLine,
    RiTimeLine,
    RiQuestionAnswerLine,
    RiGlobalLine
} from "react-icons/ri";

import { CONFIG } from "@/constants/config";
import { SocialIcons } from "@/components/shared/SocialIcons";
import ContactForm from "@/components/marketing/ContactForm";

export const metadata = {
    title: `Contact Us | ${CONFIG.SITE_NAME} - Support & Inquiries`,
    description: `Have a question or need help? Reach out to the ${CONFIG.SITE_NAME} team. We're here to assist you with technical support, billing, and any other inquiries.`,
    alternates: {
        canonical: `${CONFIG.SITE_URL}/contact-us`,
    },
};

export default function ContactUsPage() {
    const contactSchema = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": `Contact Us - ${CONFIG.SITE_NAME}`,
        "description": `Get in touch with the ${CONFIG.SITE_NAME} support team.`,
        "url": `${CONFIG.SITE_URL}/contact-us`,
        "mainEntity": {
            "@type": "ContactPoint",
            "email": CONFIG.SUPPORT_EMAIL,
            "contactType": "customer support",
            "availableLanguage": "English"
        }
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": CONFIG.SITE_URL
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Contact Us",
                "item": `${CONFIG.SITE_URL}/contact-us`
            }
        ]
    };
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <div className="min-h-screen bg-base-100 pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                        {/* Left Column: Content & Info */}
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <span className="badge badge-primary badge-outline font-bold tracking-widest px-4 py-3 uppercase text-xs">Contact Us</span>
                                <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-none">
                                    Let&apos;s build something <br />
                                    <span className="text-primary italic">extraordinary</span> together.
                                </h1>
                                <p className="text-xl text-base-content/70 font-medium max-w-lg">
                                    Have questions about our Pro plan or need technical assistance? We&apos;re here to help you peak your digital presence.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex gap-4 items-start">
                                    <div className="w-12 h-12 bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                        <RiMailLine className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Email Us</h4>
                                        <p className="text-base-content/60 font-medium">{CONFIG.SUPPORT_EMAIL}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-12 h-12 bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0">
                                        <RiTimeLine className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Support Hours</h4>
                                        <p className="text-base-content/60 font-medium">Mon - Fri, 9am - 6pm EST</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-12 h-12 bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                                        <RiQuestionAnswerLine className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">FAQs</h4>
                                        <p className="text-base-content/60 font-medium">Find answers to common questions</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-12 h-12 bg-success/10 flex items-center justify-center text-success flex-shrink-0">
                                        <RiGlobalLine className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">HQ Location</h4>
                                        <p className="text-base-content/60 font-medium">Global Digital Service</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-base-200">
                                <h4 className="font-bold uppercase tracking-widest text-xs mb-6">Connect with us</h4>
                                <SocialIcons />
                            </div>
                        </div>

                        {/* Right Column: Form */}
                        <div className="relative">
                            {/* Decorative Background Element */}
                            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 via-transparent to-secondary/20 blur-3xl -z-10"></div>
                            <div className="h-2 bg-primary w-full"></div>
                            <ContactForm />
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
