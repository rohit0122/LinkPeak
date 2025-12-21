"use client";

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
    Plus,
    Trash2,
    Save,
    Eye,
    EyeOff,
    GripVertical,
    Sparkles,
    Calendar,
    Link as LinkIcon,
    ArrowUpRight
} from 'lucide-react';
import { QRModal } from './QRModal';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import ThemeSelector from './ThemeSelector';

export default function LinkEditor({ initialLinks, pageId, initialTheme }) {
    const [activeTab, setActiveTab] = useState("links");
    const [links, setLinks] = useState(initialLinks);
    const [theme, setTheme] = useState(initialTheme);
    const [isSaving, setIsSaving] = useState(false);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const router = useRouter();

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(links);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const updatedItems = items.map((item, index) => ({
            ...item,
            priorityScore: items.length - index
        }));

        setLinks(updatedItems);
    };

    const addLink = () => {
        const newLink = {
            title: "New Link",
            url: "https://",
            isActive: true,
            priorityScore: links.length > 0 ? Math.max(...links.map(l => l.priorityScore || 0)) + 1 : 1,
            clicks: 0
        };
        setLinks([newLink, ...links]);
        toast.success("Link added! Remember to save.");
    };

    const updateLink = (index, field, value) => {
        const updated = [...links];
        updated[index] = { ...updated[index], [field]: value };
        setLinks(updated);
    };

    const deleteLink = async (index) => {
        const linkToDelete = links[index];
        if (linkToDelete._id && !linkToDelete._id.startsWith('temp-')) {
            try {
                await fetch(`/api/links?id=${linkToDelete._id}`, { method: 'DELETE' });
            } catch (e) {
                toast.error("Failed to delete link from database");
            }
        }
        setLinks(links.filter((_, i) => i !== index));
        toast.success("Link removed!");
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Save Links
            for (const link of links) {
                const payload = { ...link, pageId };
                if (link._id && !link._id.toString().startsWith('temp-')) {
                    await fetch(`/api/links`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: link._id, ...payload }),
                    });
                } else {
                    const res = await fetch('/api/links', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    });
                    const savedLink = await res.json();
                    link._id = savedLink._id;
                }
            }

            // Save Theme
            await fetch('/api/bio/update', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme }),
            });

            toast.success("Identity pulse synchronized!");
            router.refresh();
        } catch (error) {
            toast.error("Failed to save pulse");
        } finally {
            setIsSaving(false);
        }
    };

    const handleOptimize = async () => {
        setIsOptimizing(true);
        try {
            const res = await fetch('/api/ai/optimize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pageId }),
            });
            const data = await res.json();
            if (data.reorderedLinks) {
                const optimizedLinks = [...links].sort((a, b) => {
                    const aIndex = data.reorderedLinks.indexOf(a.title);
                    const bIndex = data.reorderedLinks.indexOf(b.title);
                    return aIndex - bIndex;
                }).map((item, index) => ({
                    ...item,
                    priorityScore: links.length - index
                }));
                setLinks(optimizedLinks);
                toast.success("AI Reordering applied!");
            }
        } catch (error) {
            toast.error("AI fails to resonate.");
        } finally {
            setIsOptimizing(false);
        }
    };

    const formatForDateTimeInput = (dateValue) => {
        if (!dateValue) return '';
        const d = new Date(dateValue);
        if (isNaN(d.getTime())) return '';
        const offset = d.getTimezoneOffset() * 60000;
        return new Date(d.getTime() - offset).toISOString().slice(0, 16);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <LoadingOverlay isLoading={isSaving} message="Synchronizing Pulse..." />
            <LoadingOverlay isLoading={isOptimizing} message="AI Resonating..." />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight">Your Link Peaks</h1>
                    <div className="flex items-center gap-6 mt-4">
                        <button
                            onClick={() => setActiveTab("links")}
                            className={`text-[10px] font-black uppercase tracking-[0.2em] pb-1 border-b-2 transition-all ${activeTab === "links" ? 'border-primary text-primary' : 'border-transparent opacity-30 hover:opacity-100'}`}
                        >
                            Links Logic
                        </button>
                        <button
                            onClick={() => setActiveTab("theme")}
                            className={`text-[10px] font-black uppercase tracking-[0.2em] pb-1 border-b-2 transition-all ${activeTab === "theme" ? 'border-primary text-primary' : 'border-transparent opacity-30 hover:opacity-100'}`}
                        >
                            Peak Appearance
                        </button>
                    </div>
                </div>
                {activeTab === "links" && (
                    <div className="flex gap-2">
                        <button onClick={handleOptimize} className="btn btn-ghost border-base-300 rounded-xl px-6 font-bold" disabled={isOptimizing}>
                            <Sparkles className="w-4 h-4 mr-2 text-primary" />
                            {isOptimizing ? 'Resonating...' : 'AI Optimize'}
                        </button>
                        <button onClick={addLink} className="btn btn-primary rounded-xl px-6 font-bold shadow-lg shadow-primary/20">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Peak
                        </button>
                    </div>
                )}
            </div>

            {activeTab === "links" ? (
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="links">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                                <AnimatePresence>
                                    {links.map((link, index) => (
                                        <Draggable key={link._id || `temp-${index}`} draggableId={link._id || `temp-${index}`} index={index}>
                                            {(provided) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps} className="group">
                                                    <div className={`card bg-base-100 shadow-xl shadow-base-200/50 border border-base-200 group transition-all duration-300 ${!link.isActive && 'opacity-60 grayscale'}`}>
                                                        <div className="card-body p-6">
                                                            <div className="flex items-start gap-4 sm:gap-6">
                                                                <div {...provided.dragHandleProps} className="mt-4 text-base-300 group-hover:text-base-content transition-colors cursor-grab active:cursor-grabbing">
                                                                    <GripVertical className="text-2xl" />
                                                                </div>

                                                                <div className="flex-1 space-y-6">
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                        <div className="form-control w-full">
                                                                            <label className="label py-1">
                                                                                <span className="label-text text-[10px] font-black uppercase tracking-widest opacity-40">Peak Title</span>
                                                                            </label>
                                                                            <input
                                                                                type="text"
                                                                                className="input input-ghost bg-base-200/30 focus:bg-base-100 focus:border-primary border-transparent transition-all font-black w-full"
                                                                                value={link.title}
                                                                                onChange={(e) => updateLink(index, 'title', e.target.value)}
                                                                            />
                                                                        </div>
                                                                        <div className="form-control w-full">
                                                                            <label className="label py-1">
                                                                                <span className="label-text text-[10px] font-black uppercase tracking-widest opacity-40">Destination Pulse</span>
                                                                            </label>
                                                                            <input
                                                                                type="text"
                                                                                className="input input-ghost bg-base-200/30 focus:bg-base-100 focus:border-primary border-transparent transition-all font-medium text-sm w-full opacity-70"
                                                                                value={link.url}
                                                                                onChange={(e) => updateLink(index, 'url', e.target.value)}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-base-200">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="p-2 rounded-xl bg-base-200 text-base-content/40">
                                                                                <Calendar className="w-4 h-4" />
                                                                            </div>
                                                                            <div className="flex flex-col gap-1">
                                                                                <label className="text-[9px] font-black uppercase tracking-widest opacity-30">Visible From</label>
                                                                                <input
                                                                                    type="datetime-local"
                                                                                    className="bg-transparent text-[11px] font-bold outline-none cursor-pointer"
                                                                                    value={formatForDateTimeInput(link.visibleFrom)}
                                                                                    onChange={(e) => updateLink(index, 'visibleFrom', e.target.value)}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="p-2 rounded-xl bg-base-200 text-base-content/40">
                                                                                <Calendar className="w-4 h-4" />
                                                                            </div>
                                                                            <div className="flex flex-col gap-1">
                                                                                <label className="text-[9px] font-black uppercase tracking-widest opacity-30">Visible Until</label>
                                                                                <input
                                                                                    type="datetime-local"
                                                                                    className="bg-transparent text-[11px] font-bold outline-none cursor-pointer"
                                                                                    value={formatForDateTimeInput(link.visibleUntil)}
                                                                                    onChange={(e) => updateLink(index, 'visibleUntil', e.target.value)}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="flex flex-col gap-2">
                                                                    <QRModal
                                                                        url={typeof window !== 'undefined' ? `${window.location.origin}/api/qr/${link._id}` : ''}
                                                                        title={link.title || link._id}
                                                                    />
                                                                    <button
                                                                        className={`btn btn-circle btn-sm ${link.isActive ? 'btn-primary bg-primary/10 text-primary border-primary/20' : 'btn-ghost opacity-30'}`}
                                                                        onClick={() => updateLink(index, 'isActive', !link.isActive)}
                                                                    >
                                                                        {link.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                                    </button>
                                                                    <button className="btn btn-circle btn-sm btn-ghost text-error hover:bg-error/10" onClick={() => deleteLink(index)}>
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-base-200 px-1 opacity-40">
                                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
                                                                    <LinkIcon className="w-3 h-3" /> {link.clicks || 0} Peak Interactions
                                                                </div>
                                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
                                                                    <div className={`w-2 h-2 rounded-full ${link.isActive ? 'bg-success animate-pulse' : 'bg-base-300'}`}></div>
                                                                    {link.isActive ? 'Active Now' : 'Draft Pulse'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                </AnimatePresence>
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            ) : (
                <div className="card bg-base-100 border border-base-200 shadow-2xl p-8 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight mb-2">Peak Appearance</h2>
                            <p className="font-bold opacity-30 text-xs uppercase tracking-widest">Select the vibe for your digital peak</p>
                        </div>
                        <ThemeSelector currentTheme={theme} onThemeSelect={setTheme} isSaving={isSaving} />
                    </div>
                </div>
            )}

            {links.length === 0 && (
                <div className="text-center py-24 bg-base-100 rounded-3xl border-2 border-dashed border-base-300">
                    <div className="bg-base-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LinkIcon className="text-3xl opacity-20" />
                    </div>
                    <p className="font-bold opacity-30 italic">No links yet. Click "Add Peak" to start your growth.</p>
                </div>
            )}

            {links.length > 0 && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-10 shadow-2xl">
                    <button
                        className="btn btn-primary rounded-full px-12 h-16 font-black text-lg gap-3 shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <div className="w-5 h-5 border-2 border-primary-content/20 border-t-primary-content rounded-full animate-spin" />
                                Synchronizing...
                            </>
                        ) : (
                            <><Save className="w-5 h-5" /> Save Changes</>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
