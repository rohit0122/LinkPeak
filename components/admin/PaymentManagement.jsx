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
    RiTimeLine,
    RiCloseCircleLine,
    RiBillLine
} from "react-icons/ri";
import Pagination from "@/components/shared/Pagination";
import { formatDate } from "@/lib/dateUtils";

export default function PaymentManagement() {
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
    });

    const fetchPayments = useCallback(async (page = 1, search = "", status = "all") => {
        setIsLoading(true);
        try {
            let url = `${ENDPOINTS.ADMIN.PAYMENTS}?page=${page}&limit=${pagination.limit}`;
            if (search) url += `&search=${search}`;
            if (status !== "all") url += `&status=${status}`;

            const { data } = await axios.get(url);
            if (data.success) {
                // Handle different potential backend response structures
                const responseData = data.data;
                const paymentList = responseData.data || responseData;
                const meta = responseData.data ? responseData : {
                    total: paymentList.length,
                    current_page: 1,
                    last_page: 1,
                    per_page: paymentList.length
                };

                setPayments(paymentList || []);
                setPagination({
                    total: meta.total || 0,
                    page: meta.current_page || 1,
                    limit: meta.per_page || 10,
                    totalPages: meta.last_page || 1,
                });
            }
        } catch (error) {
            console.error("Payment fetch error:", error);
            toast.error("Failed to load payments");
        } finally {
            setIsLoading(false);
        }
    }, [pagination.limit]);

    useEffect(() => {
        fetchPayments(1, "", "all");
    }, [fetchPayments]);

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearchQuery(val);
        // Simple debounce
        setTimeout(() => {
            fetchPayments(1, val, statusFilter);
        }, 500);
    };

    const handleStatusFilterChange = (status) => {
        setStatusFilter(status);
        fetchPayments(1, searchQuery, status);
    };

    const handlePageChange = (newPage) => {
        fetchPayments(newPage, searchQuery, statusFilter);
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            captured: "badge-success",
            authorized: "badge-info",
            created: "badge-ghost",
            failed: "badge-error",
            refunded: "badge-warning",
        };
        return statusMap[status] || "badge-ghost";
    };

    const formatCurrency = (amount, currency = 'INR') => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2
        }).format(amount);
    };

    // Calculate totals for stats
    const totalRevenue = payments.reduce((acc, curr) => {
        if (curr.status === 'captured') {
            return acc + (parseFloat(curr.amount) || 0);
        }
        return acc;
    }, 0);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-base-100 border border-base-200 flex flex-col justify-between">
                    <p className="text-xs font-medium uppercase opacity-40 flex items-center gap-2">
                        <RiBillLine className="text-primary" /> Total Transactions
                    </p>
                    <p className="text-4xl font-medium tracking-tight mt-2">
                        {pagination.total}
                    </p>
                </div>
                <div className="p-6 bg-base-100 border border-base-200 flex flex-col justify-between">
                    <p className="text-xs font-medium uppercase opacity-40 flex items-center gap-2">
                        <RiCheckboxCircleLine className="text-success" /> Successful
                    </p>
                    <p className="text-4xl font-medium tracking-tight mt-2">
                        {payments.filter(p => p.status === 'captured').length}
                    </p>
                </div>
                <div className="p-6 bg-base-100 border border-base-200 flex flex-col justify-between">
                    <p className="text-xs font-medium uppercase opacity-40 flex items-center gap-2">
                        <RiCloseCircleLine className="text-error" /> Failed
                    </p>
                    <p className="text-4xl font-medium tracking-tight mt-2">
                        {payments.filter(p => p.status === 'failed').length}
                    </p>
                </div>
            </div>

            {/* Filter & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-base-100 p-4 border border-base-200">
                <div className="relative flex-1 max-w-full sm:max-w-md">
                    <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                    <input
                        type="text"
                        placeholder="Search by ID, email or Razorpay ID..."
                        className="input input-bordered w-full pl-12 bg-base-200/50 border-none"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                    {['all', 'captured', 'failed', 'created'].map((status) => (
                        <button
                            key={status}
                            onClick={() => handleStatusFilterChange(status)}
                            className={`btn btn-sm ${statusFilter === status
                                ? 'btn-neutral'
                                : 'btn-ghost'}`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                    <button
                        onClick={() => fetchPayments(pagination.page, searchQuery, statusFilter)}
                        className="btn btn-sm btn-ghost btn-square"
                        title="Refresh"
                    >
                        <RiRefreshLine />
                    </button>
                </div>
            </div>

            {/* Payments Table */}
            <div className="bg-base-100 border border-base-200 shadow-sm overflow-x-auto">
                <table className="table w-full whitespace-nowrap">
                    <thead>
                        <tr className="bg-base-200/30">
                            <th className="font-medium uppercase text-[10px] tracking-widest py-6">ID / User</th>
                            <th className="font-medium uppercase text-[10px] tracking-widest">Amount</th>
                            <th className="font-medium uppercase text-[10px] tracking-widest">Status</th>
                            <th className="font-medium uppercase text-[10px] tracking-widest">Date</th>
                            <th className="font-medium uppercase text-[10px] tracking-widest">Method</th>
                            <th className="font-medium uppercase text-[10px] tracking-widest text-right">Razorpay ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="6" className="text-center py-20">
                                    <span className="loading loading-spinner loading-lg opacity-20"></span>
                                </td>
                            </tr>
                        ) : payments.length > 0 ? (
                            payments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-base-200/20 transition-colors">
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-base-300 flex items-center justify-center font-bold text-xs rounded-full">
                                                {payment.user?.name?.[0] || 'U'}
                                            </div>
                                            <div>
                                                <div className="font-medium text-sm">
                                                    {payment.user?.name || 'Unknown User'}
                                                </div>
                                                <div className="text-xs opacity-40 font-mono">
                                                    #{payment.id} • {payment.user?.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="font-medium">
                                            {formatCurrency(payment.amount, payment.currency)}
                                        </div>
                                        <div className="text-[10px] opacity-50 uppercase">
                                            {payment.currency || 'INR'}
                                        </div>
                                    </td>
                                    <td>
                                        <div className={`badge badge-sm uppercase font-bold text-[10px] border-none ${getStatusBadge(payment.status)}`}>
                                            {payment.status}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-1 opacity-60 text-xs">
                                            <RiCalendarLine />
                                            <span>{formatDate(payment.created_at)}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="text-xs uppercase font-medium opacity-70">
                                            {payment.method || 'Online'}
                                        </div>
                                    </td>
                                    <td className="text-right">
                                        <code className="text-[10px] bg-base-200 px-2 py-1 rounded opacity-60 select-all">
                                            {payment.razorpay_payment_id || 'N/A'}
                                        </code>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-20 opacity-40">
                                    {searchQuery ? "No payments match your search" : "No payments found"}
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
