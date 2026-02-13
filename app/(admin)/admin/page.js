"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/httpClient";
import { ENDPOINTS } from "@/constants/endpoints";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SupportView from "@/components/dashboard/SupportView";
import Pagination from "@/components/shared/Pagination";
import {
  RiUserFollowLine,
  RiEyeLine,
  RiLinksLine,
  RiBarChartGroupedLine,
  RiShieldUserLine,
  RiArrowUpSLine,
  RiGroupLine,
  RiMoneyDollarCircleLine,
  RiHistoryLine,
  RiSearchLine,
} from "react-icons/ri";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { useAuthStore } from "@/stores/useAuthStore";
import PlanManagement from "@/components/admin/PlanManagement";
import NewsletterManagement from "@/components/admin/NewsletterManagement";
import PaymentManagement from "@/components/admin/PaymentManagement";
import { formatDate } from "@/lib/dateUtils";

// useSupportStore removed

function StatCard({ title, value, icon: Icon, colorClass, trend }) {
  return (
    <div className="card bg-base-100 shadow-sm border border-base-300 overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
      <div className="card-body p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] opacity-40">
              {title}
            </p>
            <h3 className="text-4xl font-medium tracking-tight">{value}</h3>
            {trend && (
              <div className="flex items-center gap-1 text-success text-xs font-bold pt-2">
                <RiArrowUpSLine className="text-sm" />
                {trend}% increase
              </div>
            )}
          </div>
          <div
            className={`p-4  ${colorClass} group-hover:scale-110 transition-transform`}
          >
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
  const [isLoaded, setIsLoaded] = useState({ users: false, tickets: false });

  // ... (rest of state)

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [search, setSearch] = useState("");
  const { currentUser } = useAuthStore();
  const router = useRouter();

  // Plan prices for reference (matching backend)
  const PLAN_PRICES = { FREE: 0, PRO: 9, AGENCY: 49 };

  // Initial Load - Stats Only
  useEffect(() => {
    fetchStats();
  }, []);

  // Lazy Load Data on Tab Change
  useEffect(() => {
    if (activeTab === "USERS" && !isLoaded.users) {
      fetchUsers(1, "");
    } else if (activeTab === "SUPPORT" && !isLoaded.tickets) {
      fetchTickets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(ENDPOINTS.ADMIN.STATS);
      if (data.success) setStats(data.data);
    } catch (error) {
      toast.error("Could not load stats.");
    } finally {
    }
  };

  const fetchTickets = async () => {
    try {
      const { data } = await axios.get(ENDPOINTS.ADMIN.TICKETS);
      if (data.success) {
        // Handle both simple array and Laravel paginated structure
        const ticketData = data.data.data || data.data || [];
        setTickets(ticketData);
        setIsLoaded((prev) => ({ ...prev, tickets: true }));
      }
    } catch (error) {
      toast.error("Could not load tickets.");
    }
  };

  const fetchUsers = async (page = 1, searchQuery = "") => {
    try {
      const { data } = await axios.get(
        `${ENDPOINTS.ADMIN.USERS}?page=${page}&limit=${pagination.limit}&search=${searchQuery}`
      );
      if (data.success) {
        const { data: usersData, current_page, last_page, total, per_page } = data.data;
        setUsers(usersData);
        setPagination({
          total: total,
          page: current_page,
          limit: per_page,
          totalPages: last_page,
        });
        setIsLoaded((prev) => ({ ...prev, users: true }));
      }
    } catch (error) {
      toast.error("Could not load users.");
    } finally {
    }
  };

  // Debounced search
  const debouncedSearch = debounce((val) => {
    fetchUsers(1, val);
  }, 500);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    debouncedSearch(val);
  };

  const handlePageChange = (newPage) => {
    fetchUsers(newPage, search);
  };

  const handleUserUpdate = async (userId, suspend) => {
    try {
      const { data } = await axios.post(ENDPOINTS.ADMIN.SUSPEND_USER, {
        userId,
        suspend,
      });
      if (data.success) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, is_active: !suspend } : u)));
        toast.success(data.message || "User status updated successfully! ✅");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Could not update user status. Please try again."
      );
    }
  };

  return (
    <DashboardLayout
      currentUser={
        currentUser || { name: "System Admin", role: "admin", plan: "AGENCY" }
      }
    >
      <div className="max-w-[1400px] mx-auto py-10 px-4 space-y-8">
        {/* Minimal Global Header */}
        <div className="flex flex-col items-start justify-between bg-base-100 p-6 border border-base-200 shadow-sm gap-4">
          <div className="flex items-center gap-4 w-full">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-primary flex items-center justify-center text-primary-content shadow-lg shadow-primary/20">
              <RiShieldUserLine className="text-xl md:text-2xl" />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-medium tracking-tight">
                Control Center
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                Elite Platform Management
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 w-full">
            {["OVERVIEW", "USERS", "SUPPORT", "PLANS", "PAYMENTS", "NEWSLETTER"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 md:px-6 py-2 md:py-3 font-medium text-xs transition-all ${activeTab === tab
                  ? "bg-primary text-primary-content shadow-lg shadow-primary/20"
                  : "hover:bg-base-200 opacity-60"
                  }`}
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
                value={`$${stats?.metrics?.mrr || 0}`}
                icon={RiMoneyDollarCircleLine}
                colorClass="bg-green-500/10 text-green-600"
                trend={stats?.metrics?.growth_rate}
              />
              <StatCard
                title="Annual Revenue"
                value={`$${stats?.metrics?.annual_revenue || 0}`}
                icon={RiBarChartGroupedLine}
                colorClass="bg-blue-500/10 text-blue-600"
              />
              <StatCard
                title="Conversion Rate"
                value={`${stats?.metrics?.conversion_rate || 0}%`}
                icon={RiArrowUpSLine}
                colorClass="bg-purple-500/10 text-purple-600"
              />
              <StatCard
                title="Paid Users"
                value={stats?.metrics?.paid_users || 0}
                icon={RiUserFollowLine}
                colorClass="bg-orange-500/10 text-orange-600"
              />
            </div>

            {/* Platform Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Users"
                value={stats?.metrics?.total_users || 0}
                icon={RiGroupLine}
                colorClass="bg-blue-500/10 text-blue-600"
                trend={stats?.metrics?.growth_rate}
              />
              <StatCard
                title="New Users (30d)"
                value={stats?.metrics?.new_users_30d || 0}
                icon={RiHistoryLine}
                colorClass="bg-green-500/10 text-green-600"
              />
              <StatCard
                title="Bio Views"
                value={stats?.metrics?.total_views?.toLocaleString() || 0}
                icon={RiEyeLine}
                colorClass="bg-purple-500/10 text-purple-600"
              />
              <StatCard
                title="Global Links"
                value={stats?.metrics?.total_links || 0}
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
                    {stats?.charts?.plan_distribution?.map((p) => (
                      <div key={p.label} className="space-y-2">
                        <div className="flex justify-between items-end">
                          <div>
                            <span className="text-xs font-medium opacity-40 uppercase tracking-widest block">
                              {p.label}
                            </span>
                            <span className="text-lg font-medium">
                              {p.value} Users
                            </span>
                          </div>
                          <span className="text-sm font-bold opacity-60">
                            {((p.value / stats.metrics.total_users) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-2 w-full bg-base-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-primary/20`}
                            style={{
                              width: `${(p.value / stats.metrics.total_users) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* User Distribution */}
              <div className="lg:col-span-2 card bg-base-100 shadow-sm border border-base-200 ">
                <div className="card-body p-8">
                  <h2 className="text-sm font-medium uppercase tracking-widest opacity-40 mb-6 flex items-center gap-2">
                    <RiGroupLine className="text-primary text-lg" />
                    User Status (Active vs Inactive)
                  </h2>
                  <div className="w-full mt-4">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={stats?.charts?.user_distribution || []}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="rgba(255,255,255,0.05)"
                        />
                        <XAxis
                          dataKey="label"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fontWeight: 500 }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1a1a1a",
                            border: "1px solid #333",
                            borderRadius: "8px",
                            fontSize: "12px",
                          }}
                        />
                        <Bar
                          dataKey="value"
                          fill="#10b981"
                          radius={[4, 4, 0, 0]}
                          barSize={50}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* User Growth Chart */}
              <div className="lg:col-span-3 card bg-base-100 shadow-sm border border-base-200 ">
                <div className="card-body p-8">
                  <h2 className="text-sm font-medium uppercase tracking-widest opacity-40 mb-6 flex items-center gap-2">
                    <RiHistoryLine className="text-primary text-lg" />
                    User Growth (New Registrations)
                  </h2>
                  <div className="w-full mt-4">
                    <ResponsiveContainer width="100%" height={350}>
                      <AreaChart
                        data={stats?.charts?.user_growth || []}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                          dataKey="label"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10 }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1a1a1a",
                            border: "1px solid #333",
                            borderRadius: "8px",
                            fontSize: "12px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="#10b981"
                          fillOpacity={1}
                          fill="url(#colorCount)"
                          strokeWidth={3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
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
                  onChange={handleSearchChange}
                />
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/5  border border-primary/10">
                <span className="text-xs font-medium text-primary uppercase tracking-widest">
                  {pagination.total} Total Users
                </span>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-base-100 border border-base-200 shadow-sm overflow-x-auto relative">
              <table className="table w-full whitespace-nowrap">
                <thead>
                  <tr className="bg-base-200/30">
                    <th className="font-medium uppercase text-[10px] tracking-widest py-6">
                      User
                    </th>
                    <th className="font-medium uppercase text-[10px] tracking-widest">
                      Subscription
                    </th>
                    <th className="font-medium uppercase text-[10px] tracking-widest">
                      User Status
                    </th>
                    <th className="font-medium uppercase text-[10px] tracking-widest text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-base-200/20 transition-colors"
                    >
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-base-300 flex items-center justify-center font-medium text-xs">
                            {user.name?.[0] || 'U'}
                          </div>
                          <div>
                            <div className="font-medium text-sm">
                              {user.name}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs opacity-40 font-medium">{user.email}</span>
                              <span className={`text-[9px] px-1.5 rounded-sm font-bold uppercase ${user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-base-300 text-base-content/50'}`}>
                                {user.role}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        {user.active_subscription ? (
                          <div className="space-y-0.5">
                            <div className={`badge badge-sm font-bold text-[10px] uppercase border-none ${user.active_subscription.plan?.slug === 'agency' ? 'bg-secondary text-secondary-content' : user.active_subscription.plan?.slug === 'pro' ? 'bg-primary text-primary-content' : 'badge-outline opacity-50'}`}>
                              {user.active_subscription.plan?.name || "Free"}
                            </div>
                            {user.active_subscription.current_period_end && (
                              <div className="text-[10px] opacity-40 font-medium">
                                Renew: {formatDate(user.active_subscription.current_period_end)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-[10px] opacity-30 italic font-medium">
                            {user.role === 'admin' ? 'System Admin' : 'No Active Plan'}
                          </div>
                        )}
                      </td>
                      <td>
                        <div
                          className={`badge badge-sm font-medium gap-1 py-3 px-4 ${user.is_active
                            ? "badge-success text-success-content"
                            : "badge-error text-error-content"
                            }`}
                        >
                          {user.is_active ? "ACTIVE" : "SUSPENDED"}
                        </div>
                      </td>
                      <td className="text-right flex justify-end gap-2">
                        {user.role !== "admin" ? (
                          <button
                            onClick={() =>
                              handleUserUpdate(user.id, user.is_active)
                            }
                            className={`btn btn-xs font-medium ${user.is_active
                              ? "btn-error"
                              : "btn-success"
                              }`}
                          >
                            {user.is_active ? "Deactivate" : "Activate"}
                          </button>
                        ) : (
                          <span className="badge badge-success badge-sm text-success-content font-medium py-3 px-4">
                            Active
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {activeTab === "SUPPORT" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-base-100  border border-base-200 flex flex-col justify-between">
                <p className="text-xs font-medium uppercase opacity-40">
                  Open Tickets
                </p>
                <p className="text-4xl font-medium tracking-tight mt-2">
                  {Array.isArray(tickets) ? tickets.filter((t = {}) => String(t.status).toLowerCase() === "open").length : 0}
                </p>
              </div>
              <div className="p-6 bg-base-100  border border-base-200 flex flex-col justify-between">
                <p className="text-xs font-medium uppercase opacity-40">
                  Total Resolved
                </p>
                <p className="text-4xl font-medium tracking-tight mt-2">
                  {Array.isArray(tickets) ? tickets.filter((t = {}) => String(t.status).toLowerCase() === "resolved").length : 0}
                </p>
              </div>
              <div className="p-6 bg-base-100  border border-base-200 flex flex-col justify-between">
                <p className="text-xs font-medium uppercase opacity-40">
                  Avg Priority
                </p>
                <p className="text-4xl font-medium tracking-tight mt-2">
                  MEDIUM
                </p>
              </div>
            </div>

            <div className="bg-base-100 border border-base-200 shadow-sm overflow-hidden rounded-xl">
              {/* Integrating the shared SupportView for full interactivity */}
              <SupportView
                currentUser={currentUser}
                tickets={tickets}
                setTickets={setTickets}
              />
            </div>
          </div>
        )}

        {activeTab === "PLANS" && <PlanManagement />}

        {activeTab === "PAYMENTS" && <PaymentManagement />}

        {activeTab === "NEWSLETTER" && <NewsletterManagement />}
      </div>
    </DashboardLayout>
  );
}
