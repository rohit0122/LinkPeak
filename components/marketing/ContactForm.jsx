"use client";
import axios from "@/lib/httpClient";
import { ENDPOINTS } from "@/constants/endpoints";
import { toast } from "react-hot-toast";
import { RiCheckboxCircleLine, RiLoader4Line, RiSendPlaneFill } from "react-icons/ri";
import { useState } from "react";

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "General Inquiry",
        message: ""
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await axios.post(ENDPOINTS.PUBLIC.CONTACT_US, formData);
            if (data.success) {
                setSuccess(true);
                toast.success("Message sent successfully!");
                setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
            }
        } catch (error) {
            console.error("Contact form error:", error);
            toast.error(error.response?.data?.error || "Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-base-100 flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-300">
                    <div className="w-24 h-24 bg-success/10 flex items-center justify-center mx-auto text-success">
                        <RiCheckboxCircleLine className="text-5xl" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Message Received!</h2>
                        <p className="text-base-content/70">
                            Thank you for reaching out. Our support team has received your inquiry and will get back to you within 24 hours.
                        </p>
                    </div>
                    <button
                        className="btn btn-primary btn-wide font-bold"
                        onClick={() => setSuccess(false)}
                        aria-label="Send another message"
                    >
                        Send Another Message
                    </button>
                </div>
            </div>
        );
    }
    return (
        <div className="card bg-base-100/80 backdrop-blur-xl border border-base-200 shadow-2xl p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                    <div className="form-control">
                        <label htmlFor="contact-name" className="label uppercase tracking-widest text-[10px] font-bold">Full Name</label>
                        <input
                            id="contact-name"
                            type="text"
                            placeholder="John Doe"
                            className="input input-lg bg-base-200/50 focus:bg-base-100 border-none w-full transition-all font-medium"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label htmlFor="contact-email" className="label uppercase tracking-widest text-[10px] font-bold">Email Address</label>
                        <input
                            id="contact-email"
                            type="email"
                            placeholder="john@example.com"
                            className="input input-lg bg-base-200/50 focus:bg-base-100 border-none w-full transition-all font-medium"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label htmlFor="contact-subject" className="label uppercase tracking-widest text-[10px] font-bold">What can we help with?</label>
                        <select
                            id="contact-subject"
                            className="select select-lg bg-base-200 focus:bg-base-100 border-none w-full transition-all font-medium"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        >
                            <option>General Inquiry</option>
                            <option>Account Support</option>
                            <option>Billing Issue</option>
                            <option>Technical Problem</option>
                            <option>Partnership Request</option>
                        </select>
                    </div>

                    <div className="form-control">
                        <label htmlFor="contact-message" className="label uppercase tracking-widest text-[10px] font-bold">Message Details</label>
                        <textarea
                            id="contact-message"
                            className="textarea textarea-lg bg-base-200/50 focus:bg-base-100 border-none h-40 w-full transition-all font-medium"
                            placeholder="Tell us more about your request..."
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            required
                        ></textarea>
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary btn-lg w-full font-bold text-lg gap-3 h-16 shadow-lg shadow-primary/20"
                    disabled={loading}
                >
                    {loading ? (
                        <RiLoader4Line className="animate-spin text-2xl" />
                    ) : (
                        <>
                            Send Message
                            <RiSendPlaneFill className="text-xl" />
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}