"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/httpClient";
import { ENDPOINTS } from "@/constants/endpoints";
import { toast } from "react-hot-toast";
import {
    RiMailSendLine,
    RiDeleteBin6Line,
    RiSearchLine,
    RiUserFollowLine,
    RiTimeLine
} from "react-icons/ri";
import ConfirmationModal from "../shared/ConfirmationModal";
import { formatDateTime } from "@/lib/dateUtils";

export default function NewsletterManagement() {
    const [subscribers, setSubscribers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [subscriberToDelete, setSubscriberToDelete] = useState(null);

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.get(ENDPOINTS.ADMIN.NEWSLETTER);
            if (data.success) {
                setSubscribers(data.data || []);
            }
        } catch (error) {
            toast.error("Failed to load subscribers");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClick = (subscriber) => {
        setSubscriberToDelete(subscriber);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!subscriberToDelete) return;

        try {
            const { data } = await axios.delete(ENDPOINTS.ADMIN.NEWSLETTER_BY_ID(subscriberToDelete.id));
            if (data.success) {
                toast.success("Subscriber removed successfully");
                setSubscribers(subscribers.filter(s => s.id !== subscriberToDelete.id));
            }
        } catch (error) {
            toast.error("Failed to remove subscriber");
        } finally {
            setShowDeleteModal(false);
            setSubscriberToDelete(null);
        }
    };

    const filteredSubscribers = subscribers.filter(s =>
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ConfirmationModal
                isOpen={showDeleteModal}
                title="Remove Subscriber?"
                message={`Are you sure you want to remove ${subscriberToDelete?.email} from the newsletter list?`}
                confirmText="Remove"
                cancelText="Keep"
                isDestructive={true}
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteModal(false)}
            />

            {/* Header & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-base-100 border border-base-200 flex flex-col justify-between">
                    <p className="text-xs font-medium uppercase opacity-40 flex items-center gap-2">
                        <RiUserFollowLine className="text-primary" /> Total Subscribers
                    </p>
                    <p className="text-4xl font-medium tracking-tighter mt-2">
                        {subscribers.length}
                    </p>
                </div>
                <div className="md:col-span-2 flex items-end justify-between gap-4 bg-base-100 p-6 border border-base-200">
                    <div className="relative flex-1">
                        <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                        <input
                            type="text"
                            placeholder="Search by email..."
                            className="input input-bordered w-full pl-12 bg-base-200/50 border-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Subscribers Table */}
            <div className="bg-base-100 border border-base-200 shadow-sm overflow-x-auto">
                <table className="table w-full whitespace-nowrap">
                    <thead>
                        <tr className="bg-base-200/30">
                            <th className="font-medium uppercase text-[10px] tracking-widest py-6">Email Address</th>
                            <th className="font-medium uppercase text-[10px] tracking-widest">Joined Date</th>
                            <th className="font-medium uppercase text-[10px] tracking-widest text-right px-8">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="3" className="text-center py-20">
                                    <span className="loading loading-spinner loading-lg opacity-20"></span>
                                </td>
                            </tr>
                        ) : filteredSubscribers.length > 0 ? (
                            filteredSubscribers.map((subscriber) => (
                                <tr key={subscriber.id} className="hover:bg-base-200/20 transition-colors">
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center font-bold">
                                                <RiMailSendLine />
                                            </div>
                                            <span className="font-medium">{subscriber.email}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2 text-xs opacity-60">
                                            <RiTimeLine />
                                            {formatDateTime(subscriber.created_at)}
                                        </div>
                                    </td>
                                    <td className="text-right px-8">
                                        <button
                                            onClick={() => handleDeleteClick(subscriber)}
                                            className="btn btn-ghost btn-sm btn-circle hover:bg-error/10 hover:text-error"
                                            title="Remove Subscriber"
                                        >
                                            <RiDeleteBin6Line className="text-lg" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center py-20 opacity-40">
                                    {searchQuery ? "No subscribers match your search" : "No subscribers yet"}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
