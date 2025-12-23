import { RiQuestionLine } from "react-icons/ri";

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
        a: "Yes! Our 'Free' plan includes unlimited links, social icons, and 7-day analytics. We only charge for premium themes, advanced data retention, and business tools."
    },
    {
        q: "How do I download my QR code?",
        a: "Once you sign up, your dashboard will automatically generate a dynamic QR code for your bio. You can download it as a high-resolution PNG for your print marketing."
    }
];

export default function FAQ() {
    return (
        <section id="faq" className="py-24 bg-base-100">
            <div className="max-w-3xl mx-auto px-6">
                <div className="text-center mb-16">
                    <RiQuestionLine className="text-6xl text-primary mx-auto mb-4 animate-pulse" />
                    <h2 className="text-4xl md:text-5xl font-medium tracking-tighter mb-4">Common Questions</h2>
                    <p className="text-xl opacity-60">Everything you need to know about LinkPeak.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div key={i} className="collapse collapse-plus bg-base-200/50  border border-base-300">
                            <input type="radio" name="my-accordion-3" defaultChecked={i === 0} />
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
