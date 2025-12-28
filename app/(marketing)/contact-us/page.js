"use client";

import { useState } from "react";
import {
    RiSendPlaneFill,
    RiLoader4Line,
    RiCheckboxCircleLine,
    RiMailFill,
    RiMapPin2Fill,
    RiTimeFill,
    RiTwitterFill,
    RiInstagramFill,
    RiLinkedinBoxFill
} from "react-icons/ri";
import { Mail, MessageSquare, Clock, Globe } from "lucide-react";
import axios from "@/lib/axios";
import { toast } from "react-hot-toast";
import { CONFIG } from "@/constants/config";

export default function ContactUsPage() {
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
            const { data } = await axios.post("/contact", formData);
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
                    >
                        Send Another Message
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* Left Column: Content & Info */}
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <span className="badge badge-primary badge-outline font-bold tracking-widest px-4 py-3 uppercase text-xs">Contact Us</span>
                            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter leading-none">
                                Let's build something <br />
                                <span className="text-primary italic">extraordinary</span> together.
                            </h1>
                            <p className="text-xl text-base-content/70 font-medium max-w-lg">
                                Have questions about our Pro plan or need technical assistance? We're here to help you peak your digital presence.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex gap-4 items-start">
                                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Email Us</h4>
                                    <p className="text-base-content/60 font-medium">{CONFIG.SUPPORT_EMAIL}</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="w-12 h-12 bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Support Hours</h4>
                                    <p className="text-base-content/60 font-medium">Mon - Fri, 9am - 6pm EST</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="w-12 h-12 bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                                    <MessageSquare className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Live Chat</h4>
                                    <p className="text-base-content/60 font-medium">Available for Agency accounts</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="w-12 h-12 bg-success/10 flex items-center justify-center text-success flex-shrink-0">
                                    <Globe className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">HQ Location</h4>
                                    <p className="text-base-content/60 font-medium">Global Digital Service</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-base-200">
                            <h4 className="font-bold uppercase tracking-widest text-xs opacity-50 mb-6">Connect with us</h4>
                            <div className="flex gap-4">
                                <a href="#" className="btn btn-square btn-ghost hover:bg-primary hover:text-white transition-all text-xl"><RiTwitterFill /></a>
                                <a href="#" className="btn btn-square btn-ghost hover:bg-secondary hover:text-white transition-all text-xl"><RiInstagramFill /></a>
                                <a href="#" className="btn btn-square btn-ghost hover:bg-accent hover:text-white transition-all text-xl"><RiLinkedinBoxFill /></a>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="relative">
                        {/* Decorative Background Element */}
                        <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 via-transparent to-secondary/20 blur-3xl opacity-50 -z-10"></div>

                        <div className="card bg-base-100/80 backdrop-blur-xl border border-base-200 shadow-2xl p-8 md:p-10">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-6">
                                    <div className="form-control">
                                        <label className="label uppercase tracking-widest text-[10px] font-bold opacity-50">Full Name</label>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            className="input input-lg bg-base-200/50 focus:bg-base-100 border-none w-full transition-all font-medium"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="label uppercase tracking-widest text-[10px] font-bold opacity-50">Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="john@example.com"
                                            className="input input-lg bg-base-200/50 focus:bg-base-100 border-none w-full transition-all font-medium"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="label uppercase tracking-widest text-[10px] font-bold opacity-50">What can we help with?</label>
                                        <select
                                            className="select select-lg bg-base-200/50 focus:bg-base-100 border-none w-full transition-all font-medium"
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
                                        <label className="label uppercase tracking-widest text-[10px] font-bold opacity-50">Message Details</label>
                                        <textarea
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
                    </div>

                </div>
            </div>
        </div>
    );
}
