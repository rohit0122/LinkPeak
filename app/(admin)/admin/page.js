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
} from "recharts";
import { useAuthStore } from "@/stores/useAuthStore";

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
            <h3 className="text-4xl font-medium tracking-tighter">{value}</h3>
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        setTickets(data.data);
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
        setUsers(data.data.users);
        setPagination(data.data.pagination);
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

  const handleUserUpdate = async (userId, updates) => {
    try {
      const { data } = await axios.patch(ENDPOINTS.ADMIN.USERS, {
        userId,
        updates,
      });
      if (data.success) {
        setUsers(users.map((u) => (u.id === userId ? data.data : u)));
        toast.success("User account updated successfully! ✅");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
        "Could not update currentUser. Please try again."
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
        <div className="flex flex-col md:flex-row items-center justify-between bg-base-100 p-6  border border-base-200 shadow-sm gap-2">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-primary flex items-center justify-center text-primary-content shadow-lg shadow-primary/20">
              <RiShieldUserLine className="text-xl md:text-2xl" />
            </div>
            <div>
              <h1 className="md:text-2xl text-xl font-medium tracking-tighter">
                Control Center
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                Elite Platform Management
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {["OVERVIEW", "USERS", "SUPPORT"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3  font-medium text-xs transition-all ${activeTab === tab
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
                      <div key={p.id} className="space-y-2">
                        <div className="flex justify-between items-end">
                          <div>
                            <span className="text-xs font-medium opacity-40 uppercase tracking-widest block">
                              {p.id}
                            </span>
                            <span className="text-lg font-medium">
                              {p.total} Users
                            </span>
                          </div>
                          <span className="text-sm font-bold opacity-60">
                            {((p.total / stats.totalUsers) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-2 w-full bg-base-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-primary/20`}
                            style={{
                              width: `${(p.total / stats.totalUsers) * 100}%`,
                            }}
                          ></div>
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
                    <RiGroupLine className="text-primary text-lg" />
                    User Distribution (Active vs Inactive)
                  </h2>
                  <div className="w-full mt-4">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={stats?.planDistribution || []}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="rgba(255,255,255,0.05)"
                        />
                        <XAxis
                          dataKey="_id"
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
                        <Legend
                          iconType="circle"
                          wrapperStyle={{
                            fontSize: "10px",
                            paddingTop: "20px",
                          }}
                        />
                        <Bar
                          name="Active"
                          dataKey="active"
                          fill="#10b981"
                          radius={[4, 4, 0, 0]}
                          barSize={30}
                        />
                        <Bar
                          name="Inactive"
                          dataKey="inactive"
                          fill="#ef4444"
                          radius={[4, 4, 0, 0]}
                          barSize={30}
                        />
                      </BarChart>
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
                      Plan
                    </th>
                    <th className="font-medium uppercase text-[10px] tracking-widest">
                      Status
                    </th>
                    <th className="font-medium uppercase text-[10px] tracking-widest text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((currentUser) => (
                    <tr
                      key={currentUser.id}
                      className="hover:bg-base-200/20 transition-colors"
                    >
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-base-300 flex items-center justify-center font-medium text-xs">
                            {currentUser.name[0]}
                          </div>
                          <div>
                            <div className="font-medium text-sm">
                              {currentUser.name}
                            </div>
                            <div className="text-xs opacity-40 font-medium">
                              {currentUser.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        {currentUser.role !== "admin" ? (
                          <select
                            disabled={currentUser.role === "admin"}
                            className={`select select-xs select-bordered font-medium text-[10px] ${currentUser.plan === "AGENCY"
                              ? "border-primary text-primary"
                              : ""
                              }`}
                            value={currentUser.plan}
                            onChange={(e) =>
                              handleUserUpdate(currentUser.id, {
                                plan: e.target.value,
                              })
                            }
                          >
                            <option value="FREE">FREE</option>
                            <option value="PRO">PRO</option>
                            <option value="AGENCY">AGENCY</option>
                          </select>
                        ) : (
                          <div className="font-medium text-[10px]">
                            {currentUser.plan}
                          </div>
                        )}
                      </td>
                      <td>
                        <div
                          className={`badge badge-sm font-medium gap-1 py-3 px-4 ${currentUser.is_active
                            ? "badge-success text-success-content"
                            : "badge-error text-error-content"
                            }`}
                        >
                          {currentUser.is_active ? "ACTIVE" : "SUSPENDED"}
                        </div>
                      </td>
                      <td className="text-right flex justify-end gap-2">
                        {currentUser.role !== "admin" ? (
                          <button
                            disabled={currentUser.role === "admin"}
                            onClick={() =>
                              handleUserUpdate(currentUser.id, {
                                is_active: !currentUser.is_active,
                              })
                            }
                            className={`btn btn-xs font-medium ${currentUser.is_active
                              ? "btn-error"
                              : "btn-success"
                              }`}
                          >
                            {currentUser.is_active ? "Deactivate" : "Activate"}
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
                <p className="text-4xl font-medium tracking-tighter mt-2">
                  {tickets.filter((t) => t.status === "OPEN").length}
                </p>
              </div>
              <div className="p-6 bg-base-100  border border-base-200 flex flex-col justify-between">
                <p className="text-xs font-medium uppercase opacity-40">
                  Total Resolved
                </p>
                <p className="text-4xl font-medium tracking-tighter mt-2">
                  {tickets.filter((t) => t.status === "CLOSED").length}
                </p>
              </div>
              <div className="p-6 bg-base-100  border border-base-200 flex flex-col justify-between">
                <p className="text-xs font-medium uppercase opacity-40">
                  Avg Priority
                </p>
                <p className="text-4xl font-medium tracking-tighter mt-2">
                  MEDIUM
                </p>
              </div>
            </div>

            <div className="bg-base-100 border border-base-200 shadow-sm overflow-hidden rounded-xl">
              {/* Integrating the shared SupportView for full interactivity */}
              <SupportView currentUser={currentUser} />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
