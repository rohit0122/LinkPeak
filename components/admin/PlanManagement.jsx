"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/httpClient";
import { ENDPOINTS } from "@/constants/endpoints";
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiLoader4Line, RiCheckboxCircleLine, RiCloseCircleLine, RiSettings4Line } from "react-icons/ri";
import { toast } from "react-hot-toast";

export default function PlanManagement() {
    const [plans, setPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        razorpay_plan_id: "",
        price: 0,
        currency: "USD",
        billing_interval: "month",
        trial_days: 0,
        is_active: true,
        features: {
            links: 10,
            pages: 1,
            analyticsDays: 7,
            customTemplates: false,
            customThemes: false
        }
    });

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.get(ENDPOINTS.ADMIN.PLANS);
            if (data.success) {
                setPlans(data.data || []);
            }
        } catch (error) {
            toast.error("Failed to load plans");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (plan) => {
        setEditingPlan(plan);
        setFormData({
            ...plan,
            features: typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this plan? This cannot be undone if there are no active users.")) return;

        try {
            const { data } = await axios.delete(ENDPOINTS.ADMIN.PLAN_BY_ID(id));
            if (data.success) {
                toast.success("Plan deleted successfully");
                fetchPlans();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete plan");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const isEditing = !!editingPlan;
            const url = isEditing
                ? ENDPOINTS.ADMIN.PLAN_BY_ID(editingPlan.id)
                : ENDPOINTS.ADMIN.PLANS;

            const method = isEditing ? 'put' : 'post';

            // Only send changed fields when editing
            let payload = formData;
            if (isEditing) {
                payload = {};
                const originalFeatures = typeof editingPlan.features === 'string'
                    ? JSON.parse(editingPlan.features)
                    : editingPlan.features;

                // Compare top level fields
                Object.keys(formData).forEach(key => {
                    if (key === 'features') {
                        // Special handling for nested features object
                        const featuresChanged = JSON.stringify(formData.features) !== JSON.stringify(originalFeatures);
                        if (featuresChanged) {
                            payload.features = formData.features;
                        }
                    } else {
                        // Normalize blank states for comparison
                        const val1 = formData[key] ?? "";
                        const val2 = editingPlan[key] ?? "";
                        if (val1 !== val2) {
                            payload[key] = formData[key];
                        }
                    }
                });

                if (Object.keys(payload).length === 0) {
                    toast.error("No changes detected");
                    setIsSaving(false);
                    return;
                }
            }

            const { data } = await axios[method](url, payload);

            if (data.success) {
                toast.success(`Plan ${isEditing ? 'updated' : 'created'} successfully`);
                setShowModal(false);
                fetchPlans();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save plan");
        } finally {
            setIsSaving(false);
        }
    };

    const handleFeatureChange = (key, value) => {
        setFormData(prev => ({
            ...prev,
            features: {
                ...prev.features,
                [key]: value
            }
        }));
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 opacity-40">
                <RiLoader4Line className="text-4xl animate-spin mb-4" />
                <p className="text-sm font-medium uppercase tracking-widest">Loading Plans...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between bg-base-100 p-4 border border-base-200">
                <div>
                    <h2 className="text-lg font-medium">Subscription Plans</h2>
                    <p className="text-xs opacity-50">Manage tiers, pricing, and feature limits</p>
                </div>
                <button
                    onClick={() => {
                        setEditingPlan(null);
                        setFormData({
                            name: "",
                            slug: "",
                            razorpay_plan_id: "",
                            price: 0,
                            currency: "USD",
                            billing_interval: "month",
                            trial_days: 0,
                            is_active: true,
                            features: { links: 5, pages: 1, analyticsDays: 7 }
                        });
                        setShowModal(true);
                    }}
                    className="btn btn-primary btn-sm flex items-center gap-2"
                >
                    <RiAddLine className="text-lg" />
                    New Plan
                </button>
            </div>

            {/* Plans Table */}
            <div className="bg-base-100 border border-base-200 shadow-sm overflow-x-auto">
                <table className="table w-full whitespace-nowrap">
                    <thead>
                        <tr className="bg-base-200/30">
                            <th className="font-medium uppercase text-[10px] tracking-widest py-6">Plan Info</th>
                            <th className="font-medium uppercase text-[10px] tracking-widest">Pricing</th>
                            <th className="font-medium uppercase text-[10px] tracking-widest">Trial</th>
                            <th className="font-medium uppercase text-[10px] tracking-widest">Status</th>
                            <th className="font-medium uppercase text-[10px] tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plans.map((plan) => (
                            <tr key={plan.id} className="hover:bg-base-200/20 transition-colors">
                                <td>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm">{plan.name}</span>
                                        <span className="text-[10px] opacity-40 font-mono uppercase">{plan.slug || '—'}</span>
                                        <span className="text-[10px] opacity-30">RP_ID: {plan.razorpay_plan_id || 'N/A'}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="flex items-center gap-1 font-medium">
                                        <span className="text-xs opacity-50">{plan.currency}</span>
                                        <span className="text-lg tracking-tight">${plan.price}</span>
                                        <span className="text-[10px] opacity-30 mt-1">/{plan.billing_interval}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className="badge badge-sm badge-outline font-medium">{plan.trial_days} Days</span>
                                </td>
                                <td>
                                    <div className={`badge badge-sm gap-1 ${plan.is_active ? 'badge-success text-success-content' : 'badge-ghost opacity-40'}`}>
                                        {plan.is_active ? <RiCheckboxCircleLine /> : <RiCloseCircleLine />}
                                        {plan.is_active ? 'ACTIVE' : 'INACTIVE'}
                                    </div>
                                </td>
                                <td className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleEdit(plan)} className="btn btn-ghost btn-xs text-primary">
                                            <RiEditLine className="text-lg" />
                                        </button>
                                        <button onClick={() => handleDelete(plan.id)} className="btn btn-ghost btn-xs text-error">
                                            <RiDeleteBinLine className="text-lg" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-2xl p-0 overflow-hidden bg-base-100 rounded-none border border-base-300">
                        <form onSubmit={handleSubmit}>
                            <div className="p-6 border-b border-base-200 bg-base-200/20 flex justify-between items-center">
                                <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
                                    <RiSettings4Line className="text-primary" />
                                    {editingPlan ? 'Edit Plan' : 'Create New Plan'}
                                </h3>
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost btn-sm btn-circle">✕</button>
                            </div>

                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Info */}
                                <div className="space-y-4">
                                    <div className="form-control">
                                        <label className="label py-1"><span className="label-text text-xs font-bold uppercase tracking-widest opacity-40">Plan Name</span></label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="input input-bordered w-full rounded-none font-medium"
                                            placeholder="e.g. PRO"
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className="label py-1"><span className="label-text text-xs font-bold uppercase tracking-widest opacity-40">Slug</span></label>
                                        <input
                                            type="text"
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            className="input input-bordered w-full rounded-none font-medium"
                                            placeholder="e.g. pro"
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className="label py-1"><span className="label-text text-xs font-bold uppercase tracking-widest opacity-40">Razorpay Plan ID</span></label>
                                        <input
                                            type="text"
                                            value={formData.razorpay_plan_id}
                                            onChange={(e) => setFormData({ ...formData, razorpay_plan_id: e.target.value })}
                                            className="input input-bordered w-full rounded-none font-medium"
                                            placeholder="plan_K9..."
                                        />
                                    </div>
                                </div>

                                {/* Pricing Info */}
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="form-control">
                                            <label className="label py-1"><span className="label-text text-xs font-bold uppercase tracking-widest opacity-40">Price</span></label>
                                            <input
                                                required
                                                type="number"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                className="input input-bordered w-full rounded-none font-medium"
                                            />
                                        </div>
                                        <div className="form-control">
                                            <label className="label py-1"><span className="label-text text-xs font-bold uppercase tracking-widest opacity-40">Currency</span></label>
                                            <select
                                                value={formData.currency}
                                                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                                className="select select-bordered w-full rounded-none font-medium"
                                            >
                                                <option value="USD">USD</option>
                                                <option value="INR">INR</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="form-control">
                                            <label className="label py-1"><span className="label-text text-xs font-bold uppercase tracking-widest opacity-40">Billing Interval</span></label>
                                            <select
                                                value={formData.billing_interval}
                                                onChange={(e) => setFormData({ ...formData, billing_interval: e.target.value })}
                                                className="select select-bordered w-full rounded-none font-medium"
                                            >
                                                <option value="month">Monthly</option>
                                                <option value="year">Yearly</option>
                                            </select>
                                        </div>
                                        <div className="form-control">
                                            <label className="label py-1"><span className="label-text text-xs font-bold uppercase tracking-widest opacity-40">Trial Days</span></label>
                                            <input
                                                type="number"
                                                value={formData.trial_days}
                                                onChange={(e) => setFormData({ ...formData, trial_days: e.target.value })}
                                                className="input input-bordered w-full rounded-none font-medium"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-control pt-4">
                                        <label className="label cursor-pointer justify-start gap-3">
                                            <input
                                                type="checkbox"
                                                checked={formData.is_active}
                                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                                className="checkbox checkbox-primary rounded-none"
                                            />
                                            <span className="label-text text-xs font-bold uppercase tracking-widest opacity-60">Active & Published</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Features Section */}
                                <div className="md:col-span-2 mt-4 p-6 bg-base-200/30 border border-base-200 space-y-4">
                                    <span className="text-xs font-bold uppercase tracking-widest opacity-40 block mb-2">Feature Limits & Access</span>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                                        <div className="form-control">
                                            <label className="label py-1"><span className="label-text text-[10px] font-bold opacity-60">Link Limit</span></label>
                                            <input type="number" value={formData.features.links} onChange={(e) => handleFeatureChange('links', parseInt(e.target.value))} className="input input-sm input-bordered rounded-none w-full" />
                                        </div>
                                        <div className="form-control">
                                            <label className="label py-1"><span className="label-text text-[10px] font-bold opacity-60">Page Limit</span></label>
                                            <input type="number" value={formData.features.pages} onChange={(e) => handleFeatureChange('pages', parseInt(e.target.value))} className="input input-sm input-bordered rounded-none w-full" />
                                        </div>
                                        <div className="form-control">
                                            <label className="label py-1"><span className="label-text text-[10px] font-bold opacity-60">Analytics Days</span></label>
                                            <input type="number" value={formData.features.analyticsDays} onChange={(e) => handleFeatureChange('analyticsDays', parseInt(e.target.value))} className="input input-sm input-bordered rounded-none w-full" />
                                        </div>
                                    </div>
                                    <div className="flex gap-8 pt-2">
                                        <label className="label cursor-pointer justify-start gap-2">
                                            <input type="checkbox" checked={formData.features.customTemplates} onChange={(e) => handleFeatureChange('customTemplates', e.target.checked)} className="checkbox checkbox-xs rounded-none" />
                                            <span className="label-text text-[10px] font-bold opacity-60 uppercase">Custom Templates</span>
                                        </label>
                                        <label className="label cursor-pointer justify-start gap-2">
                                            <input type="checkbox" checked={formData.features.customThemes} onChange={(e) => handleFeatureChange('customThemes', e.target.checked)} className="checkbox checkbox-xs rounded-none" />
                                            <span className="label-text text-[10px] font-bold opacity-60 uppercase">Custom Themes</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-base-200 bg-base-200/10 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost btn-sm">Cancel</button>
                                <button disabled={isSaving} type="submit" className="btn btn-primary btn-sm px-8">
                                    {isSaving && <RiLoader4Line className="animate-spin" />}
                                    {editingPlan ? 'Save Changes' : 'Create Plan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
