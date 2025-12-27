"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SupportView from "@/components/dashboard/SupportView";
import {
    RiUserFollowLine,
    RiEyeLine,
    RiLinksLine,
    RiHeartLine,
    RiBarChartGroupedLine,
    RiShieldUserLine,
    RiArrowUpSLine,
    RiGroupLine,
    RiCustomerService2Line,
    RiMoneyDollarCircleLine,
    RiHistoryLine,
    RiSearchLine,
    RiCheckLine,
    RiCloseLine,
    RiLockPasswordLine,
    RiGlobalLine
} from "react-icons/ri";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

function StatCard({ title, value, icon: Icon, colorClass, trend }) {
    return (
        <div className="card bg-base-100 shadow-sm border border-base-300 overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
            <div className="card-body p-6">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <p className="text-[10px] font-medium uppercase tracking-[0.2em] opacity-40">{title}</p>
                        <h3 className="text-4xl font-medium tracking-tighter">{value}</h3>
                        {trend && (
                            <div className="flex items-center gap-1 text-success text-xs font-bold pt-2">
                                <RiArrowUpSLine className="text-sm" />
                                {trend}% increase
                            </div>
                        )}
                    </div>
                    <div className={`p-4  ${colorClass} group-hover:scale-110 transition-transform`}>
                        <Icon className="text-2xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("OVERVIEW");
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const router = useRouter();

    // Revenue Logic (Estimated)
    const calculateMRR = (distribution) => {
        if (!distribution) return 0;
        const prices = { FREE: 0, PRO: 9, AGENCY: 29 }; // Hypothetical prices
        return distribution.reduce((acc, curr) => acc + (prices[curr._id] || 0) * curr.count, 0);
    };

    useEffect(() => {
        const siteUser = localStorage.getItem("site_user") ? JSON.parse(localStorage.getItem("site_user")) : null;
        if (siteUser?.role === 'admin') {
            fetchData();
        } else {
            router.push('/dashboard');
        }
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, usersRes, ticketsRes, userRes] = await Promise.all([
                axios.get("/admin/stats"),
                axios.get("/admin/users"),
                axios.get("/admin/tickets"),
                axios.get("/auth/me")
            ]);
            if (statsRes.data.success) setStats(statsRes.data.data);
            if (usersRes.data.success) setUsers(usersRes.data.success ? usersRes.data.data : []);
            if (ticketsRes.data.success) setTickets(ticketsRes.data.data);
            if (userRes.data.success) setCurrentUser(userRes.data.data);
        } catch (error) {
            toast.error("Could not load admin dashboard data.");
        } finally {
            setLoading(false);
        }
    };

    const handleUserUpdate = async (userId, updates) => {
        try {
            const { data } = await axios.patch("/admin/users", { userId, updates });
            if (data.success) {
                setUsers(users.map(u => u._id === userId ? data.data : u));
                toast.success("User account updated successfully! ✅");
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Could not update user. Please try again.");
        }
    };

    const handleTicketStatus = async (ticketId, status) => {
        try {
            const { data } = await axios.patch("/admin/tickets", { ticketId, updates: { status } });
            if (data.success) {
                setTickets(tickets.map(t => t._id === ticketId ? data.data : t));
                toast.success("Support ticket updated! 🎫");
            }
        } catch (error) {
            toast.error("Could not update ticket. Please try again.");
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
    }

    return (
        <DashboardLayout user={currentUser || { name: "System Admin", role: "admin", plan: "AGENCY" }}>
            <div className="max-w-[1400px] mx-auto py-10 px-4 space-y-8">
                {/* Minimal Global Header */}
                <div className="flex flex-col md:flex-row items-center justify-between bg-base-100 p-6  border border-base-200 shadow-sm gap-2">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 md:w-14 md:h-14 bg-primary flex items-center justify-center text-primary-content shadow-lg shadow-primary/20">
                            <RiShieldUserLine className="text-xl md:text-2xl" />
                        </div>
                        <div>
                            <h1 className="md:text-2xl text-xl font-medium tracking-tighter">Control Center</h1>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Elite Platform Management</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {["OVERVIEW", "USERS", "SUPPORT"].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-3  font-medium text-xs transition-all ${activeTab === tab ? 'bg-primary text-primary-content shadow-lg shadow-primary/20' : 'hover:bg-base-200 opacity-60'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === "OVERVIEW" && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Revenue Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                title="Monthly Revenue"
                                value={`$${stats?.mrr || 0}`}
                                icon={RiMoneyDollarCircleLine}
                                colorClass="bg-green-500/10 text-green-600"
                                trend={stats?.growthRate}
                            />
                            <StatCard
                                title="Annual Revenue"
                                value={`$${stats?.arr || 0}`}
                                icon={RiBarChartGroupedLine}
                                colorClass="bg-blue-500/10 text-blue-600"
                            />
                            <StatCard
                                title="Conversion Rate"
                                value={`${stats?.conversionRate || 0}%`}
                                icon={RiArrowUpSLine}
                                colorClass="bg-purple-500/10 text-purple-600"
                            />
                            <StatCard
                                title="Paid Users"
                                value={stats?.paidUsers || 0}
                                icon={RiUserFollowLine}
                                colorClass="bg-orange-500/10 text-orange-600"
                            />
                        </div>

                        {/* Platform Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                title="Total Users"
                                value={stats?.totalUsers}
                                icon={RiGroupLine}
                                colorClass="bg-blue-500/10 text-blue-600"
                                trend={stats?.growthRate}
                            />
                            <StatCard
                                title="New Users (30d)"
                                value={stats?.recentUsers || 0}
                                icon={RiHistoryLine}
                                colorClass="bg-green-500/10 text-green-600"
                            />
                            <StatCard
                                title="Bio Views"
                                value={stats?.totalViews?.toLocaleString()}
                                icon={RiEyeLine}
                                colorClass="bg-purple-500/10 text-purple-600"
                            />
                            <StatCard
                                title="Global Links"
                                value={stats?.totalLinks}
                                icon={RiLinksLine}
                                colorClass="bg-orange-500/10 text-orange-600"
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Plan Distribution */}
                            <div className="lg:col-span-1 card bg-base-100 shadow-sm border border-base-200 ">
                                <div className="card-body p-8">
                                    <h2 className="text-sm font-medium uppercase tracking-widest opacity-40 mb-6 flex items-center gap-2">
                                        <RiMoneyDollarCircleLine className="text-primary text-lg" />
                                        Plan Distribution
                                    </h2>
                                    <div className="space-y-6">
                                        {stats?.planDistribution?.map((p) => (
                                            <div key={p._id} className="space-y-2">
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <span className="text-xs font-medium opacity-40 uppercase tracking-widest block">{p._id}</span>
                                                        <span className="text-lg font-medium">{p.count} Users</span>
                                                    </div>
                                                    <span className="text-sm font-bold opacity-60">
                                                        {((p.count / stats.totalUsers) * 100).toFixed(1)}%
                                                    </span>
                                                </div>
                                                <div className="h-2 w-full bg-base-200 rounded-full overflow-hidden">
                                                    <div className={`h-full bg-primary/20`} style={{ width: `${(p.count / stats.totalUsers) * 100}%` }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Active Subscriptions */}
                            <div className="lg:col-span-2 card bg-base-100 shadow-sm border border-base-200 ">
                                <div className="card-body p-8">
                                    <h2 className="text-sm font-medium uppercase tracking-widest opacity-40 mb-6 flex items-center gap-2">
                                        <RiGlobalLine className="text-primary text-lg" />
                                        Platform Health
                                    </h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-6  bg-base-200/50 border border-base-300">
                                            <p className="text-xs font-medium opacity-40 uppercase mb-2">DB Status</p>
                                            <div className="flex items-center gap-2 text-success font-medium">
                                                <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                                                CONNECTED
                                            </div>
                                        </div>
                                        <div className="p-6  bg-base-200/50 border border-base-300">
                                            <p className="text-xs font-medium opacity-40 uppercase mb-2">API Latency</p>
                                            <div className="text-xl font-medium">24ms</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "USERS" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Search & Stats */}
                        <div className="flex items-center justify-between gap-4 bg-base-100 p-4  border border-base-200">
                            <div className="relative flex-1 max-w-md">
                                <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                                <input
                                    type="text"
                                    placeholder="Search users by name or email..."
                                    className="input input-bordered w-full pl-12  bg-base-200/50 border-none"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-primary/5  border border-primary/10">
                                <span className="text-xs font-medium text-primary uppercase tracking-widest">{users.length} Active Users</span>
                            </div>
                        </div>

                        {/* Users Table */}
                        <div className="bg-base-100  border border-base-200 shadow-sm overflow-hidden">
                            <table className="table w-full">
                                <thead>
                                    <tr className="bg-base-200/30">
                                        <th className="font-medium uppercase text-[10px] tracking-widest py-6">User</th>
                                        <th className="font-medium uppercase text-[10px] tracking-widest">Plan</th>
                                        <th className="font-medium uppercase text-[10px] tracking-widest">Status</th>
                                        <th className="font-medium uppercase text-[10px] tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.filter(u => u.email.toLowerCase().includes(search.toLowerCase()) || u.name.toLowerCase().includes(search.toLowerCase())).map(user => (
                                        <tr key={user._id} className="hover:bg-base-200/20 transition-colors">
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-base-300 flex items-center justify-center font-medium text-xs">
                                                        {user.name[0]}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-sm">{user.name}</div>
                                                        <div className="text-xs opacity-40 font-medium">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                {user.role !== 'admin' ? <select
                                                    disabled={user.role === 'admin'}
                                                    className={`select select-xs select-bordered  font-medium text-[10px] ${user.plan === 'AGENCY' ? 'border-primary text-primary' : ''}`}
                                                    value={user.plan}
                                                    onChange={(e) => handleUserUpdate(user._id, { plan: e.target.value })}
                                                >
                                                    <option value="FREE">FREE</option>
                                                    <option value="PRO">PRO</option>
                                                    <option value="AGENCY">AGENCY</option>
                                                    <option value="ADMIN">ADMIN</option>

                                                </select> : <div className="font-medium text-[10px]">{user.plan}</div>}
                                            </td>
                                            <td>
                                                <div className={`badge badge-sm font-medium gap-1 py-3 px-4 ${user.isActive ? 'badge-success text-success-content' : 'badge-error text-error-content'}`}>
                                                    {user.isActive ? 'ACTIVE' : 'SUSPENDED'}
                                                </div>
                                            </td>
                                            <td className="text-right flex justify-end gap-2">
                                                {user.role !== 'admin' ? <button
                                                    disabled={user.role === 'admin'}
                                                    onClick={() => handleUserUpdate(user._id, { isActive: !user.isActive })}
                                                    className={`btn btn-xs  font-medium ${user.isActive ? 'btn-error' : 'btn-success'}`}
                                                >
                                                    {user.isActive ? 'Deactivate' : 'Activate'}
                                                </button> : <span className="badge badge-success badge-sm text-success-content font-medium py-3 px-4">Active</span>}
                                                {user.role !== 'admin' && (
                                                    <button
                                                        onClick={() => handleUserUpdate(user._id, { role: 'admin' })}
                                                        className="btn btn-xs btn-outline  font-medium hidden"
                                                    >
                                                        Make Admin
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === "SUPPORT" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 bg-base-100  border border-base-200 flex flex-col justify-between">
                                <p className="text-xs font-medium uppercase opacity-40">Open Tickets</p>
                                <p className="text-4xl font-medium tracking-tighter mt-2">{tickets.filter(t => t.status === 'OPEN').length}</p>
                            </div>
                            <div className="p-6 bg-base-100  border border-base-200 flex flex-col justify-between">
                                <p className="text-xs font-medium uppercase opacity-40">Total Resolved</p>
                                <p className="text-4xl font-medium tracking-tighter mt-2">{tickets.filter(t => t.status === 'CLOSED').length}</p>
                            </div>
                            <div className="p-6 bg-base-100  border border-base-200 flex flex-col justify-between">
                                <p className="text-xs font-medium uppercase opacity-40">Avg Priority</p>
                                <p className="text-4xl font-medium tracking-tighter mt-2">MEDIUM</p>
                            </div>
                        </div>

                        <div className="bg-base-100 border border-base-200 shadow-sm overflow-hidden rounded-xl">
                            {/* Integrating the shared SupportView for full interactivity */}
                            <SupportView user={currentUser} />
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
