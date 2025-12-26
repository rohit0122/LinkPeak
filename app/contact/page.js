"use client";

import { useState } from "react";
import { RiSendPlaneFill, RiLoader4Line, RiCheckboxCircleLine } from "react-icons/ri";
import axios from "@/lib/axios";
import { toast } from "react-hot-toast";

export default function ContactPage() {
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
            <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
                <div className="card w-full max-w-md bg-base-100 shadow-xl text-center">
                    <div className="card-body items-center">
                        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-4 text-success">
                            <RiCheckboxCircleLine className="text-4xl" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
                        <p className="text-base-content/70 mb-6">
                            Thank you for reaching out. Our support team has received your message and will get back to you shortly.
                        </p>
                        <button
                            className="btn btn-primary"
                            onClick={() => setSuccess(false)}
                        >
                            Send Another Message
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 py-12 px-4 flex justify-center">
            <div className="card w-full max-w-2xl bg-base-100 shadow-xl">
                <div className="card-body">
                    <h1 className="text-3xl font-bold text-center mb-2">Contact Support</h1>
                    <p className="text-center text-base-content/60 mb-8">
                        Having issues with your account or billing? Fill out the form below.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-medium">Your Name</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className="input input-bordered w-full"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-medium">Email Address</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    className="input input-bordered w-full"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-medium">Subject</span>
                            </label>
                            <select
                                className="select select-bordered w-full"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            >
                                <option>General Inquiry</option>
                                <option>Account Support</option>
                                <option>Billing Issue</option>
                                <option>Technical Problem</option>
                                <option>Suspended Account Appeal</option>
                                <option>Feedback / Feature Request</option>
                            </select>
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-medium">Message</span>
                            </label>
                            <textarea
                                className="textarea textarea-bordered h-32"
                                placeholder="How can we help you?"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <RiLoader4Line className="animate-spin text-xl" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <RiSendPlaneFill className="text-xl" />
                                    Send Message
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
