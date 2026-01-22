"use client";

import { useState, useEffect, useRef } from "react";
import {
  RiMessage2Line,
  RiHistoryLine,
  RiCheckboxCircleLine,
  RiTimeLine,
  RiArrowLeftLine,
  RiSendPlaneFill,
  RiUserSmileLine,
  RiAdminLine,
} from "react-icons/ri";
import { CONFIG } from "@/constants/config";
import { ENDPOINTS } from "@/constants/endpoints";
import axios from "@/lib/httpClient";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/stores/useAuthStore";
import { formatDateTime } from "@/lib/dateUtils";

export default function SupportView({
  tickets: propTickets,
  setTickets: propSetTickets,
}) {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    priority: "MEDIUM",
    category: CONFIG.SUPPORT_CATEGORIES[0],
  });

  const { currentUser } = useAuthStore();
  const isAdmin = currentUser?.role === "admin";
  const messagesEndRef = useRef(null);

  const isControlled = typeof propTickets !== "undefined";
  const displayTickets = isControlled ? propTickets : tickets;

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const endpoint = isAdmin
        ? ENDPOINTS.ADMIN.TICKETS
        : ENDPOINTS.SUPPORT.TICKETS;
      const { data } = await axios.get(endpoint);
      if (data.success) {
        // Handle both simple array and Laravel paginated structure
        const ticketData = data.data.data || data.data;
        if (isControlled) {
          propSetTickets(ticketData);
        } else {
          setTickets(ticketData);
        }
        if (selectedTicket) {
          const updated = ticketData.find((t) => t.id === selectedTicket.id);
          if (updated) setSelectedTicket(updated);
        }
      }
    } catch (error) {
      toast.error("Could not load tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchTickets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, isAdmin, isControlled]);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(ENDPOINTS.SUPPORT.TICKETS, formData);
      if (data.success) {
        const newTickets = [data.data, ...displayTickets];
        if (isControlled) {
          propSetTickets(newTickets);
        } else {
          setTickets(newTickets);
        }
        setFormData({
          subject: "",
          message: "",
          priority: "MEDIUM",
          category: CONFIG.SUPPORT_CATEGORIES[0],
        });
        toast.success("Ticket created!");
        if (!isAdmin) setSelectedTicket(data.data);
      }
    } catch (error) {
      toast.error("Failed to create ticket.");
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    try {
      const { data } = await axios.post(
        ENDPOINTS.SUPPORT.REPLY(selectedTicket.id),
        { message: replyMessage }
      );
      if (data.success) {
        const updatedTicket = data.data;
        const newTickets = displayTickets.map((t) =>
          t.id === updatedTicket.id ? updatedTicket : t
        );
        if (isControlled) {
          propSetTickets(newTickets);
        } else {
          setTickets(newTickets);
        }
        setSelectedTicket(updatedTicket);
        setReplyMessage("");
        toast.success("Reply sent!");
      }
    } catch (error) {
      toast.error("Failed to send reply.");
    }
  };

  const getStatusBadge = (status = "") => {
    switch (status.toUpperCase()) {
      case "OPEN":
        return (
          <span className="badge badge-success gap-1 text-xs">
            <RiTimeLine /> Open
          </span>
        );
      case "PENDING":
        return (
          <span className="badge badge-warning gap-1 text-xs">
            <RiTimeLine /> Pending
          </span>
        );
      case "RESOLVED":
      case "CLOSED":
        return (
          <span className="badge badge-neutral gap-1 text-xs border-none bg-base-300">
            <RiCheckboxCircleLine /> Resolved
          </span>
        );
      default:
        return <span className="badge text-xs">{status}</span>;
    }
  };

  // Helper to get initials from name
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // --- RENDER: TICKET DETAIL (CHAT VIEW) ---
  if (selectedTicket) {
    return (
      <div className="h-[calc(100vh-180px)] min-h-[500px] flex flex-col bg-base-100 rounded-xl border border-base-300 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-base-200 flex items-center gap-4 bg-base-200/50">
          <button
            onClick={() => setSelectedTicket(null)}
            className="btn btn-sm btn-ghost btn-square"
          >
            <RiArrowLeftLine className="text-xl" />
          </button>
          <div className="flex-1">
            <h3 className="font-bold text-lg leading-tight">
              {selectedTicket.subject}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {getStatusBadge(selectedTicket.status)}
              <span className="text-xs opacity-50">
                #LPK_{selectedTicket.id}
              </span>
              <span className="text-xs opacity-50">
                • {selectedTicket.category}
              </span>
              {isAdmin && (
                <div className="flex items-center gap-2 ml-2">
                  <div className="badge badge-sm badge-neutral">
                    <RiUserSmileLine className="mr-1 text-xs" />
                    {selectedTicket.user?.name || "Unknown"}
                  </div>
                  <span className="text-xs opacity-50">
                    ({selectedTicket.user?.email || "No Email"})
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-base-100">
          {/* Original Issue */}
          {(() => {
            // Debug: Check currentUser object structure
            /*console.log("Full currentUser object:", currentUser);
            console.log(
              "User keys:",
              currentUser ? Object.keys(currentUser) : "currentUser is null"
            );*/

            // Check if current user created this ticket
            const isMyTicket = selectedTicket?.user_id === currentUser?.id;
            /* console.log("Original Ticket Check:", {
               ticketuser_id: selectedTicket?.user_id,
               currentuser_id: currentUser?.id,
               isMyTicket,
             });*/
            return (
              <div className={`chat ${isMyTicket ? "chat-end" : "chat-start"}`}>
                <div className="chat-image avatar placeholder">
                  <div className="bg-neutral text-neutral-content rounded-full w-10 flex items-center justify-center">
                    <span className="text-sm font-bold">
                      {getInitials(
                        isMyTicket ? currentUser?.name : "Support Team"
                      )}
                    </span>
                  </div>
                </div>
                <div className="chat-header opacity-50 text-xs mb-1">
                  {isMyTicket ? "You" : "Support Team"} •{" "}
                  {formatDateTime(selectedTicket.created_at)}
                </div>
                <div
                  className={`chat-bubble whitespace-pre-wrap ${isMyTicket ? "chat-bubble-primary" : "chat-bubble-neutral"
                    }`}
                >
                  {selectedTicket.message}
                </div>
              </div>
            );
          })()}

          {/* Replies */}
          {selectedTicket.replies?.map((reply, idx) => {
            const isMe = reply.senderId === currentUser?.id;
            return (
              <div
                key={idx}
                className={`chat ${isMe ? "chat-end" : "chat-start"}`}
              >
                <div className="chat-image avatar placeholder">
                  <div
                    className={`rounded-full w-10 flex items-center justify-center ${reply.role === "admin"
                      ? "bg-primary text-primary-content"
                      : "bg-neutral text-neutral-content"
                      }`}
                  >
                    <span className="text-sm font-bold">
                      {getInitials(reply.senderName)}
                    </span>
                  </div>
                </div>
                <div className="chat-header opacity-50 text-xs mb-1 flex gap-1">
                  {isMe ? "You" : reply.senderName}{" "}
                  {reply.role === "admin" && (
                    <span className="text-primary font-bold">(Admin)</span>
                  )}
                  <time className="text-[10px] opacity-70 ml-1">
                    {formatDateTime(reply.createdAt)}
                  </time>
                </div>
                <div
                  className={`chat-bubble whitespace-pre-wrap ${isMe ? "chat-bubble-primary" : "chat-bubble-base-200"
                    }`}
                >
                  {reply.message}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply Input */}
        <div className="p-4 border-t border-base-200 bg-base-200/30">
          <form onSubmit={handleReply} className="flex gap-2">
            <input
              type="text"
              className="input input-bordered flex-1"
              placeholder="Type your reply here..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-primary px-6"
              disabled={!replyMessage.trim()}
            >
              Reply <RiSendPlaneFill className="ml-2" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- RENDER: LIST VIEW ---
  return (
    <div className="grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Create Ticket (Only for Users, or implement separate Admin panel later if needed, but Admins usually REPLY) */}
      {!isAdmin && (
        <div className="card bg-base-100 shadow-sm border border-base-300 h-fit">
          <div className="card-body">
            <h2 className="card-title mb-6 flex items-center gap-2">
              <RiMessage2Line className="text-primary" />
              New Support Ticket
            </h2>
            <form
              onSubmit={handleCreateTicket}
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              {/* Compact Form */}
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text">Category</span>
                </label>
                <select
                  className="select select-bordered"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  {CONFIG.SUPPORT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text">Priority</span>
                </label>
                <select
                  className="select select-bordered"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div className="form-control md:col-span-2">
                <label className="label py-1">
                  <span className="label-text">Subject</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  required
                  placeholder="Brief issue summary"
                />
              </div>
              <div className="form-control md:col-span-4">
                <label className="label py-1">
                  <span className="label-text">Message</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24 w-full"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                  placeholder="Details..."
                />
              </div>
              <div className="md:col-span-4">
                <button type="submit" className="btn btn-primary btn-block">
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ticket Management List */}
      <div className="card bg-base-100 shadow-sm border border-base-300 h-fit">
        <div className="card-body">
          <h2 className="card-title mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isAdmin ? (
                <RiAdminLine className="text-secondary" />
              ) : (
                <RiHistoryLine className="text-primary" />
              )}
              {isAdmin ? "All User Tickets" : "Your Ticket History"}
            </div>
            <button
              onClick={fetchTickets}
              className="btn btn-neutral btn-outline btn-sm btn-circle"
              title="Refresh"
            >
              <RiHistoryLine />
            </button>
          </h2>

          {tickets.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Subject</th>
                    <th>Category</th>
                    {isAdmin && <th>User</th>}
                    <th>Last Update</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="cursor-pointer hover:bg-base-200/50"
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <td>{getStatusBadge(ticket.status)}</td>
                      <td>
                        <div className="font-bold truncate max-w-[200px]">
                          {ticket.subject}
                        </div>
                        <div className="text-xs opacity-50 truncate max-w-[200px]">
                          {ticket.message}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-sm badge-outline opacity-60">
                          {ticket.category}
                        </span>
                      </td>
                      {isAdmin && (
                        <td>
                          <span className="text-xs font-medium">
                            {ticket.user?.name || "Support Team"}
                          </span>
                        </td>
                      )}
                      <td className="text-xs opacity-60">
                        {formatDateTime(ticket.updated_at)}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary btn-outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTicket(ticket);
                          }}
                        >
                          View/Reply
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-12 opacity-40 border-2 border-dashed border-base-200 rounded-xl">
              <RiMessage2Line className="text-4xl mx-auto mb-2" />
              <p>No tickets found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
