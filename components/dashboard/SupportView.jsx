"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { toast } from "react-hot-toast";
import { RiMessage2Line, RiHistoryLine, RiCheckboxCircleLine, RiTimeLine, RiHashtag } from "react-icons/ri";
import { CONFIG } from "@/constants/config";

export default function SupportView() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ subject: "", message: "", priority: "MEDIUM", category: CONFIG.SUPPORT_CATEGORIES[0] });

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const { data } = await axios.get("/support");
            if (data.success) setTickets(data.data);
        } catch (error) {
            toast.error("Could not load support history.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post("/support", formData);
            if (data.success) {
                setTickets([data.data, ...tickets]);
                setFormData({ subject: "", message: "", priority: "MEDIUM", category: CONFIG.SUPPORT_CATEGORIES[0] });
                toast.success("Support ticket created! We'll reply soon. 🎫");
            }
        } catch (error) {
            toast.error("Could not submit ticket. Please try again.");
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'OPEN': return <span className="badge badge-success gap-1"><RiTimeLine /> Open</span>;
            case 'PENDING': return <span className="badge badge-warning gap-1"><RiTimeLine /> Pending</span>;
            case 'CLOSED': return <span className="badge badge-ghost gap-1"><RiCheckboxCircleLine /> Closed</span>;
            default: return <span className="badge">{status}</span>;
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Create Ticket */}
            <div className="card bg-base-100 shadow-sm border border-base-300 h-fit">
                <div className="card-body">
                    <h2 className="card-title mb-6 grid items-center gap-2">
                        <RiMessage2Line className="text-primary" />
                        New Support Ticket
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="form-control grid col-span-2">
                            <label className="label"><span className="label-text">Subject</span></label>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                placeholder="Briefly describe the issue"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Category</span></label>
                            <select
                                className="select select-bordered"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                {CONFIG.SUPPORT_CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Priority</span></label>
                            <select
                                className="select select-bordered"
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                        <div className="form-control grid col-span-2">
                            <label className="label"><span className="label-text">Message</span></label>
                            <textarea
                                className="textarea textarea-bordered h-32 w-full"
                                placeholder="Tell us what's happening..."
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                            />
                        </div>
                        <div className="flex justify-end col-span-2">
                            <button type="submit" className="btn btn-primary font-medium">Submit Ticket</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Ticket History */}
            <div className="card bg-base-100 shadow-sm border border-base-300 h-fit">
                <div className="card-body">
                    <h2 className="card-title mb-6 flex items-center gap-2">
                        <RiHistoryLine className="text-primary" />
                        Ticket History
                    </h2>

                    {loading ? (
                        <div className="flex justify-center p-8"><span className="loading loading-dots loading-lg text-primary"></span></div>
                    ) : tickets.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Category</th>
                                        <th>Subject</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tickets.map(ticket => (
                                        <tr key={ticket._id}>
                                            <td><span className="badge badge-sm badge-outline opacity-60">{ticket.category}</span></td>
                                            <td className="font-bold">{ticket.subject}</td>
                                            <td>{getStatusBadge(ticket.status)}</td>
                                            <td className="text-xs opacity-60">
                                                {new Date(ticket.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center p-8 opacity-40">
                            <p>No tickets found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
