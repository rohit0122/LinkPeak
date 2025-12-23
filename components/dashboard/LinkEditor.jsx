"use client";

import { useState } from "react";
import { CONFIG } from "@/constants/config";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    RiDragMove2Fill,
    RiLink,
    RiDeleteBin6Line,
    RiEditLine,
    RiToggleLine,
    RiToggleFill,
    RiAddLine,
    RiMagicLine
} from "react-icons/ri";
import { toast } from "react-hot-toast";
import axios from "@/lib/axios";

function SortableItem({ link, onEdit, onDelete, onToggle }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: link._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 0,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`card bg-base-100 border-2 ${link.isActive ? 'border-base-300' : 'border-dashed border-base-200 opacity-60'} mb-4  transition-all hover:shadow-lg`}
        >
            <div className="card-body p-5 flex-row items-center gap-4">
                <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-2 text-primary/30 hover:text-primary transition-all">
                    <RiDragMove2Fill className="text-2xl" />
                </div>

                <div className="flex-1 min-w-0 flex items-center gap-3">
                    {link.icon ? (
                        <div className="text-2xl w-12 h-12 flex items-center justify-center bg-base-200  shadow-inner group-hover:scale-110 transition-transform">
                            {link.icon}
                        </div>
                    ) : (
                        <div className="w-12 h-12 flex items-center justify-center bg-base-200  opacity-20 group-hover:opacity-40 transition-opacity">
                            <RiLink className="text-xl" />
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-lg tracking-tight truncate">{link.title}</h3>
                        <p className="text-xs opacity-40 truncate flex items-center gap-1 font-medium mt-0.5">
                            <RiLink className="text-primary" /> {link.url}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onToggle(link._id, !link.isActive)}
                        className={`btn btn-sm btn-ghost btn-circle ${link.isActive ? 'text-success' : 'text-base-content/20'}`}
                        title={link.isActive ? "Deactivate" : "Activate"}
                    >
                        {link.isActive ? <RiToggleFill className="text-2xl" /> : <RiToggleLine className="text-2xl" />}
                    </button>
                    <button
                        onClick={() => onEdit(link)}
                        className="btn btn-sm btn-ghost btn-circle hover:bg-primary/10 hover:text-primary"
                        title="Edit Link"
                    >
                        <RiEditLine className="text-xl" />
                    </button>
                    <button
                        onClick={() => onDelete(link._id)}
                        className="btn btn-sm btn-ghost btn-circle hover:bg-error/10 hover:text-error"
                        title="Delete Link"
                    >
                        <RiDeleteBin6Line className="text-xl" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function LinkEditor({ links, plan, onReorder, onAdd, onUpdate, onDelete }) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingLink, setEditingLink] = useState(null);
    const [formData, setFormData] = useState({ title: "", url: "", icon: "" });
    const [activeEmojiTab, setActiveEmojiTab] = useState(CONFIG.COMMON_EMOJIS[0].name);

    const [isAiLoading, setIsAiLoading] = useState(false);

    const handleAiTitle = async () => {
        if (!formData.url) return;
        setIsAiLoading(true);
        try {
            const { data } = await axios.post("/ai/generate-title", { url: formData.url });
            if (data.success) {
                setFormData(prev => ({ ...prev, title: data.data.title }));
                toast.success("AI generated a catchy title!", { icon: "🪄" });
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "AI generation failed. Please try again.");
        } finally {
            setIsAiLoading(false);
        }
    };

    const limit = CONFIG.PLAN_LIMITS[plan || "FREE"].links;
    const isLimitReached = links.length >= limit;

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = links.findIndex((l) => l._id === active.id);
            const newIndex = links.findIndex((l) => l._id === over.id);
            const newLinks = arrayMove(links, oldIndex, newIndex);
            onReorder(newLinks);
        }
    };

    const handleAddClick = () => {
        setFormData({ title: "", url: "", icon: "" });
        setShowAddModal(true);
    };

    const handleEditClick = (link) => {
        setFormData({ title: link.title, url: link.url, icon: link.icon || "" });
        setEditingLink(link);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingLink) {
            onUpdate({ ...editingLink, ...formData });
            setEditingLink(null);
        } else {
            onAdd(formData);
            setShowAddModal(false);
        }
        setFormData({ title: "", url: "", icon: "" });
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-medium tracking-tight flex items-center gap-3">
                    <div className="p-2 bg-primary/10  text-primary">
                        <RiLink className="text-xl" />
                    </div>
                    Dynamic Links
                </h2>
                <div className="flex items-center gap-4">
                    {isLimitReached && (
                        <div className="badge badge-error badge-outline gap-2 font-medium py-4 px-4  animate-pulse">
                            Limit Reached ({links.length}/{limit})
                        </div>
                    )}
                    <button
                        onClick={handleAddClick}
                        disabled={isLimitReached}
                        className={`btn btn-primary btn-sm ${isLimitReached ? 'grayscale opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <RiAddLine className="text-lg" /> Add New Link
                    </button>
                </div>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={links.map(l => l._id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-2">
                        {links.length > 0 ? (
                            links.map((link) => (
                                <SortableItem
                                    key={link._id}
                                    link={link}
                                    onEdit={handleEditClick}
                                    onDelete={onDelete}
                                    onToggle={(id, active) => onUpdate({ _id: id, isActive: active })}
                                />
                            ))
                        ) : (
                            <div className="bg-base-100  border-2 border-dashed border-base-300 p-16 text-center animate-pulse">
                                <div className="w-20 h-20  bg-base-200 flex items-center justify-center mx-auto mb-6">
                                    <RiLink className="text-4xl opacity-10" />
                                </div>
                                <h3 className="font-medium text-xl mb-2">No Links Yet</h3>
                                <p className="text-base-content/40 max-w-xs mx-auto text-sm">Create your first link and watch it appear on your bio page instantly!</p>
                            </div>
                        )}
                    </div>
                </SortableContext>
            </DndContext>

            {/* Modal for Add/Edit */}
            {(showAddModal || editingLink) && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-base-100 w-full max-w-md  shadow-2xl overflow-hidden border border-white/10 animate-in zoom-in-95 duration-300">
                        <div className="p-8">
                            <h3 className="font-medium text-2xl mb-8 tracking-tight">
                                {editingLink ? "Edit Link" : "Add New Link"}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-bold text-xs uppercase tracking-widest opacity-50">Link Title</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. My Portfolio"
                                        className="input input-bordered  focus:input-primary transition-all font-bold"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-bold text-xs uppercase tracking-widest opacity-50">Target URL</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="url"
                                            placeholder="https://example.com"
                                            className="input input-bordered w-full  focus:input-primary transition-all font-bold pr-12"
                                            value={formData.url}
                                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                            required
                                        />
                                        {plan !== 'FREE' && (
                                            <button
                                                type="button"
                                                disabled={!formData.url || isAiLoading}
                                                onClick={handleAiTitle}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-xs btn-circle btn-primary shadow-sm"
                                                title="Generate Title with AI"
                                            >
                                                {isAiLoading ? (
                                                    <span className="loading loading-spinner loading-xs text-white"></span>
                                                ) : (
                                                    <RiMagicLine className="text-white" />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="label">
                                        <span className="label-text font-bold text-xs uppercase tracking-widest opacity-50">Link Icon</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="e.g. 🚀"
                                            className="input input-bordered  focus:input-primary transition-all font-bold text-xl flex-1"
                                            value={formData.icon}
                                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                        />
                                        {formData.icon && (
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, icon: "" })}
                                                className="btn btn-ghost  font-medium text-error"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>

                                    {/* Tabbed Emoji Picker */}
                                    <div className="bg-base-200/50  p-4 border border-base-300">
                                        <div className="flex gap-1 bg-base-300/40 p-1  mb-4 overflow-x-auto no-scrollbar">
                                            {CONFIG.COMMON_EMOJIS.map((cat) => (
                                                <button
                                                    key={cat.name}
                                                    type="button"
                                                    onClick={() => setActiveEmojiTab(cat.name)}
                                                    className={`px-3 py-1.5  text-[10px] font-medium uppercase tracking-widest transition-all flex-shrink-0 ${activeEmojiTab === cat.name ? 'bg-base-100 text-primary shadow-sm' : 'opacity-40 hover:opacity-100'}`}
                                                >
                                                    {cat.name}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-6 gap-2 min-h-[100px] content-start">
                                            {CONFIG.COMMON_EMOJIS.find(c => c.name === activeEmojiTab)?.emojis.map((emoji) => (
                                                <button
                                                    key={emoji}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, icon: emoji })}
                                                    className={`w-10 h-10  flex items-center justify-center text-xl hover:bg-primary hover:text-white transition-all ${formData.icon === emoji ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 'bg-base-100/50'}`}
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        className="btn btn-ghost flex-1  font-bold"
                                        onClick={() => { setShowAddModal(false); setEditingLink(null); }}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary flex-1  font-medium shadow-lg shadow-primary/20">
                                        {editingLink ? "Save Changes" : "Create Link"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
