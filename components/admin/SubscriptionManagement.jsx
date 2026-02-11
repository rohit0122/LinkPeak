"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "@/lib/httpClient";
import { ENDPOINTS } from "@/constants/endpoints";
import { toast } from "react-hot-toast";
import {
    RiRefreshLine,
    RiSearchLine,
    RiUserLine,
    RiCalendarLine,
    RiMoneyDollarCircleLine,
    RiCheckboxCircleLine,
    RiTimeLine
} from "react-icons/ri";
import Pagination from "@/components/shared/Pagination";
import { formatDate } from "@/lib/dateUtils";

export default function SubscriptionManagement() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
    });

    const fetchSubscriptions = useCallback(async (page = 1, search = "") => {
        setIsLoading(true);
        try {
            const { data } = await axios.get(
                `${ENDPOINTS.ADMIN.SUBSCRIPTION_LIST}?page=${page}&limit=${pagination.limit}&search=${search}`
            );
            if (data.success) {
                const { data: subsData, current_page, last_page, total, per_page } = data.data;
                setSubscriptions(subsData || []);
                setPagination({
                    total: total || 0,
                    page: current_page || 1,
                    limit: per_page || 10,
                    totalPages: last_page || 1,
                });
            }
        } catch (error) {
            toast.error("Failed to load subscriptions");
        } finally {
            setIsLoading(false);
        }
    }, [pagination.limit]);

    useEffect(() => {
        fetchSubscriptions(1, "");
    }, [fetchSubscriptions]);

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const { data } = await axios.post(ENDPOINTS.ADMIN.SUBSCRIPTION_SYNC);
            if (data.success) {
                toast.success(data.message || "Subscriptions synced successfully");
                fetchSubscriptions(pagination.page, searchQuery);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to sync subscriptions");
        } finally {
            setIsSyncing(false);
        }
    };

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearchQuery(val);
        // Simple debounce
        setTimeout(() => {
            fetchSubscriptions(1, val);
        }, 500);
    };

    const handlePageChange = (newPage) => {
        fetchSubscriptions(newPage, searchQuery);
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            active: "badge-success",
            trial: "badge-info",
            past_due: "badge-warning",
            canceled: "badge-error",
            incomplete: "badge-warning",
            incomplete_expired: "badge-error",
            unpaid: "badge-error",
        };
        return statusMap[status] || "badge-ghost";
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-base-100 border border-base-200 flex flex-col justify-between">
                    <p className="text-xs font-medium uppercase opacity-40 flex items-center gap-2">
                        <RiMoneyDollarCircleLine className="text-primary" /> Total Subscriptions
                    </p>
                    <p className="text-4xl font-medium tracking-tight mt-2">
                        {pagination.total}
                    </p>
                </div>
                <div className="p-6 bg-base-100 border border-base-200 flex flex-col justify-between">
                    <p className="text-xs font-medium uppercase opacity-40 flex items-center gap-2">
                        <RiCheckboxCircleLine className="text-success" /> Active
                    </p>
                    <p className="text-4xl font-medium tracking-tight mt-2">
                        {subscriptions.filter(s => s.status === 'active').length}
                    </p>
                </div>
                <div className="p-6 bg-base-100 border border-base-200 flex flex-col justify-between">
                    <p className="text-xs font-medium uppercase opacity-40 flex items-center gap-2">
                        <RiTimeLine className="text-info" /> Trialing
                    </p>
                    <p className="text-4xl font-medium tracking-tight mt-2">
                        {subscriptions.filter(s => s.status === 'trial').length}
                    </p>
                </div>
            </div>

            {/* Search Bar & Sync Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-base-100 p-4 border border-base-200">
                <div className="relative flex-1 max-w-full sm:max-w-md">
                    <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                    <input
                        type="text"
                        placeholder="Search by user email or plan..."
                        className="input input-bordered w-full pl-12 bg-base-200/50 border-none"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
                <button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="btn btn-primary gap-2 w-full sm:w-auto"
                >
                    <RiRefreshLine className={`text-lg ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? 'Syncing...' : 'Sync with Razorpay'}
                </button>
            </div>

            {/* Subscriptions Table */}
            <div className="bg-base-100 border border-base-200 shadow-sm overflow-x-auto">
                <table className="table w-full whitespace-nowrap">
                    <thead>
                        <tr className="bg-base-200/30">
                            <th className="font-medium uppercase text-[10px] tracking-widest py-6">User</th>
                            <th className="font-medium uppercase text-[10px] tracking-widest">Plan</th>
                            <th className="font-medium uppercase text-[10px] tracking-widest">Status</th>
                            <th className="font-medium uppercase text-[10px] tracking-widest">Period</th>
                            <th className="font-medium uppercase text-[10px] tracking-widest">Razorpay ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="5" className="text-center py-20">
                                    <span className="loading loading-spinner loading-lg opacity-20"></span>
                                </td>
                            </tr>
                        ) : subscriptions.length > 0 ? (
                            subscriptions.map((subscription) => (
                                <tr key={subscription.id} className="hover:bg-base-200/20 transition-colors">
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-base-300 flex items-center justify-center font-bold">
                                                <RiUserLine />
                                            </div>
                                            <div>
                                                <div className="font-medium text-sm">
                                                    {subscription.user?.name || 'N/A'}
                                                </div>
                                                <div className="text-xs opacity-40">
                                                    {subscription.user?.email || 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={`badge badge-sm font-bold text-[10px] uppercase border-none ${subscription.plan?.slug === 'agency' ? 'bg-secondary text-secondary-content' :
                                            subscription.plan?.slug === 'pro' ? 'bg-primary text-primary-content' :
                                                'badge-outline opacity-50'
                                            }`}>
                                            {subscription.plan?.name || 'FREE'}
                                        </div>
                                    </td>
                                    <td>
                                        <div className={`badge badge-sm ${getStatusBadge(subscription.status)}`}>
                                            {subscription.status?.toUpperCase() || 'UNKNOWN'}
                                        </div>
                                        {subscription.is_trial && (
                                            <div className="badge badge-xs badge-info ml-2">TRIAL</div>
                                        )}
                                    </td>
                                    <td>
                                        <div className="text-xs space-y-1">
                                            <div className="flex items-center gap-1 opacity-60">
                                                <RiCalendarLine className="text-xs" />
                                                <span>Start: {formatDate(subscription.current_period_start)}</span>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-60">
                                                <RiCalendarLine className="text-xs" />
                                                <span>End: {formatDate(subscription.current_period_end)}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <code className="text-xs opacity-60 bg-base-200 px-2 py-1 rounded">
                                            {subscription.razorpay_subscription_id || 'N/A'}
                                        </code>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-20 opacity-40">
                                    {searchQuery ? "No subscriptions match your search" : "No subscriptions found"}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
            />
        </div>
    );
}
