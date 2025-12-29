import { NextResponse } from "next/server";
import BioPageRepository from "@/lib/repositories/BioPageRepository";
import UserRepository from "@/lib/repositories/UserRepository";
import { getAuthUser } from "@/lib/auth";
import { CONFIG } from "@/constants/config";

export async function GET() {
    try {
        const session = await getAuthUser();
        if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

        const pages = await BioPageRepository.findByUserId(session.id);

        // --- Plan-Based Data Filtering (Handle Downgrades) ---
        const user = await UserRepository.findById(session.id);
        const plan = user?.plan || "FREE";
        const limits = CONFIG.PLAN_LIMITS[plan];

        // Filter each page's data based on current plan
        const filteredPages = pages.map(page => {
            const pageObj = page.toObject ? page.toObject() : page;

            // Reset template if not allowed by current plan
            const allowedTemplates = limits.allowedTemplates;
            if (allowedTemplates !== "ALL" && !allowedTemplates.includes(pageObj.template)) {
                pageObj.template = "classic"; // Default to FREE template
            }

            // Reset theme if not allowed by current plan
            const allowedThemes = limits.themes;
            if (allowedThemes !== "ALL" && !allowedThemes.includes(pageObj.theme)) {
                pageObj.theme = "light"; // Default to FREE theme
            }

            // Clear SEO data for FREE users (preserve in DB, hide in response)
            if (plan === 'FREE' && pageObj.seo) {
                pageObj.seo = { title: "", description: "", keywords: "" };
            }

            // Clear branding for non-AGENCY users (preserve in DB, hide in response)
            if (plan !== 'AGENCY' && pageObj.branding) {
                pageObj.branding = { removeWatermark: false, customText: "", customUrl: "" };
            }

            return pageObj;
        });
        // -----------------------------------------------------

        return NextResponse.json({ success: true, data: filteredPages });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getAuthUser();
        if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

        const { slug, title, bio } = await req.json();

        // Page Limit Check
        const user = await UserRepository.findById(session.id);
        const plan = user?.plan || "FREE";
        const limit = CONFIG.PLAN_LIMITS[plan].pages;
        const count = await BioPageRepository.countByUserId(session.id);

        if (count >= limit) {
            return NextResponse.json({
                success: false,
                error: `Limit reached! Your ${plan} plan allows up to ${limit} page(s). Please upgrade for more.`
            }, { status: 403 });
        }

        const normalizedSlug = slug.toLowerCase().trim();
        const existingPage = await BioPageRepository.findBySlug(normalizedSlug);
        if (existingPage) {
            return NextResponse.json({ success: false, error: "Slug already taken" }, { status: 400 });
        }

        const page = await BioPageRepository.create({
            userId: session.id,
            slug: normalizedSlug,
            title,
            bio,
        });

        return NextResponse.json({ success: true, data: page });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const session = await getAuthUser();
        if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

        const { id, ...updates } = await req.json();

        // --- RBAC & Security Check ---
        const user = await UserRepository.findById(session.id);
        const plan = user?.plan || "FREE";
        const limits = CONFIG.PLAN_LIMITS[plan];

        if (!plan) {
            return NextResponse.json({
                success: false,
                error: "User not found or plan not specified."
            }, { status: 404 });
        }

        // Validation logic
        if (updates.title && updates.title.length < 3) {
            return NextResponse.json({
                success: false,
                error: "Title must be at least 3 characters long."
            }, { status: 400 });
        }

        if (updates.slug) {
            if (updates.slug.length < 3) {
                return NextResponse.json({
                    success: false,
                    error: "Slug must be at least 3 characters long."
                }, { status: 400 });
            }
            const normalizedSlug = updates.slug.toLowerCase().trim();
            const existingPage = await BioPageRepository.findBySlug(normalizedSlug);
            if (existingPage && existingPage._id.toString() !== id) {
                return NextResponse.json({
                    success: false,
                    error: "This slug already taken. Please try another slug."
                }, { status: 400 });
            }
            updates.slug = normalizedSlug;
        }

        // 1. Validate Template
        if (updates.template) {
            const allowed = limits.allowedTemplates;
            if (allowed !== "ALL" && !allowed.includes(updates.template)) {
                return NextResponse.json({
                    success: false,
                    error: `Template '${updates.template}' requires an upgrade to PRO plan.`
                }, { status: 403 });
            }
        }

        // 2. Validate Theme
        if (updates.theme) {
            const allowed = limits.themes;
            if (allowed !== "ALL" && !allowed.includes(updates.theme)) {
                return NextResponse.json({
                    success: false,
                    error: `Theme '${updates.theme}' requires an upgrade to PRO plan.`
                }, { status: 403 });
            }
        }

        // 3. Validate SEO (Block for FREE users)
        if (updates.seo && (updates.seo.title || updates.seo.description || updates.seo.keywords) && plan === 'FREE') {
            return NextResponse.json({
                success: false,
                error: "SEO Optimization is a PRO feature."
            }, { status: 403 });
        }

        // 4. Validate Branding (Agency Only)
        if (updates.branding && plan !== 'AGENCY') {
            if ((updates.branding.customText || updates.branding.customUrl)) {
                return NextResponse.json({
                    success: false,
                    error: "White-labeling is a AGENCY feature."
                }, { status: 403 });
            } else if (updates.branding.removeWatermark && plan !== 'PRO') {
                return NextResponse.json({
                    success: false,
                    error: "White-labeling is a PRO feature."
                }, { status: 403 });
            }
        }

        const page = await BioPageRepository.updateWithUserCheck(id, session.id, updates);

        if (!page) {
            return NextResponse.json({ success: false, error: "Page not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: page });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
