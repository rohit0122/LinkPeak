"use client";

import { useState } from "react";
import { RiQuestionLine } from "react-icons/ri";
// constants/faq.js
import { CONFIG } from "@/constants/config";
const faqs = [
    {
        q: `What exactly is ${CONFIG.SITE_NAME}?`,
        a: `${CONFIG.SITE_NAME} is an ultra-fast link-in-bio platform that turns your single social media bio link into a high-performance landing page. It helps you share multiple links, track clicks in real-time, and collect 'Fan Love'—all in one place.`
    },
    {
        q: "How does the 'Fan Love' interaction work?",
        a: "Unlike static link-tools, we feature an interactive 'Heart' button on your profile. It allows your audience to show instant appreciation with a single tap. You can track these interactions as a 'Social Score' in your live dashboard."
    },
    {
        q: "Are the analytics really 'Live'?",
        a: "Yes! Every time someone views your page or clicks a link, our atomic-tracking engine updates your dashboard instantly. You don't have to wait 24 hours to see your performance."
    },
    {
        q: "Can I preview themes before saving them?",
        a: "Absolutely. Our Dashboard features a live mobile mockup. You can experiment with all 8+ color themes and 5 layout templates in 'Draft Mode' before publishing them to your live profile."
    },
    {
        q: "How do I get my custom QR code?",
        a: "Your profile automatically generates a dynamic QR code. Pro and Agency users can even embed their own logo in the center. You can download it as a high-resolution PNG, perfect for business cards or stickers."
    },
    {
        q: "Will I lose my data if my subscription expires?",
        a: "Never. If your plan expires, we simply 'archive' your extra pages and premium themes. Your data remains safe in our database, and you can restore everything instantly by renewing your plan."
    },
    {
        q: "Do you offer a trial for PRO & AGENCY plans?",
        a: "We want you to be 100% confident. We offer a full 24-hour 'Test Drive' of all premium features. Explore the AI SEO tools, advanced templates, and deep analytics risk-free before your first payment."
    },
    {
        q: "What is your refund policy?",
        a: "Because we offer a 24-hour full-access trial, we do not provide refunds once a paid subscription begins. We encourage everyone to use the trial period to ensure the platform meets their needs."
    },
    {
        q: "Can I use my own domain name?",
        a: "Currently, we provide high-authority vanity URLs (e.g., linkpeak.com/yourname). Full custom domain mapping (yourname.com) is currently in development and is scheduled for release sooner."
    }
];
/*
const faqs = [
    {
        q: "How does the 'Fan Love' system work?",
        a: "It's simple! Every bio page comes with a floating heart button. Visitors can show their support with a single tap, and we track the total count for you in your dashboard. It's the ultimate engagement booster."
    },
    {
        q: "Can I use my own domain?",
        a: "Currently, our 'Pro' and 'Agency' plans support custom vanity slugs (e.g., linkpeak.com/yourname). Full custom domain support is coming in Early 2026."
    },
    {
        q: "Is it really 100% free?",
        a: "Yes! Our 'Free' plan includes 5 links, social icons, and 7-day analytics. We only charge for premium themes, advanced data retention, and business tools."
    },
    {
        q: "How do I download my QR code?",
        a: "Once you sign up, your dashboard will automatically generate a dynamic QR code for your bio. You can download it as a high-resolution PNG for your print marketing."
    },
    {
        q: "Is there any trial period for PRO & AGENCY plans?",
        a: "Yes! we do offer 24 hours of trial period for our 'Pro' and 'Agency' plans. If you feel great you can pay for the plan via dashboard itself."
    },
    {
        q: "Is there any money back gurantee?",
        a: "Well! above question says it all. So, we are not offering any money back gurantee."
    }
];*/

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section id="faq" className="py-24 bg-base-100">
            <div className="max-w-3xl mx-auto px-6">
                <div className="text-center mb-16">
                    <RiQuestionLine className="text-6xl text-primary mx-auto mb-4 animate-pulse" />
                    <h2 className="text-4xl md:text-5xl font-medium tracking-tighter mb-4">Common Questions</h2>
                    <p className="text-xl opacity-60">Everything you need to know about {CONFIG.SITE_NAME}.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div key={i} className="collapse collapse-plus bg-base-200/50  border border-base-300">
                            <input
                                type="checkbox"
                                name="my-accordion-3"
                                checked={openIndex === i}
                                onChange={() => setOpenIndex(openIndex === i ? null : i)}
                            />
                            <div className="collapse-title text-xl font-bold p-6">
                                {faq.q}
                            </div>
                            <div className="collapse-content px-6 pb-6 text-base-content/70 font-medium">
                                <p>{faq.a}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
