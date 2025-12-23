import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import BioPage from "@/models/BioPage";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getAuthUser();
        if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        console.log('session ===== pages ', session)
        await dbConnect();
        const pages = await BioPage.find({ userId: session.id });

        // --- Plan-Based Data Filtering (Handle Downgrades) ---
        const User = (await import("@/models/User")).default;
        const { CONFIG } = await import("@/constants/config");
        const user = await User.findById(session.id);
        const plan = user?.plan || "FREE";
        const limits = CONFIG.PLAN_LIMITS[plan];

        // Filter each page's data based on current plan
        const filteredPages = pages.map(page => {
            const pageObj = page.toObject();

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

        await dbConnect();
        const { slug, title, bio } = await req.json();

        // Page Limit Check
        const User = (await import("@/models/User")).default;
        const { CONFIG } = await import("@/constants/config");
        const user = await User.findById(session.id);
        const limit = CONFIG.PLAN_LIMITS[user.plan || "FREE"].pages;
        const count = await BioPage.countDocuments({ userId: session.id });

        if (count >= limit) {
            return NextResponse.json({
                success: false,
                error: `Limit reached! Your ${user.plan} plan allows up to ${limit} page(s). Please upgrade for more.`
            }, { status: 403 });
        }

        const existingPage = await BioPage.findOne({ slug: slug.toLowerCase() });
        if (existingPage) {
            return NextResponse.json({ success: false, error: "Slug already taken" }, { status: 400 });
        }

        const page = await BioPage.create({
            userId: session.id,
            slug: slug.toLowerCase(),
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

        await dbConnect();
        const { id, ...updates } = await req.json();
        console.log("Processing Page Update:", updates);

        // --- RBAC & Security Check ---
        const User = (await import("@/models/User")).default;
        const { CONFIG } = await import("@/constants/config");
        const user = await User.findById(session.id);
        const plan = user?.plan || "FREE";
        const limits = CONFIG.PLAN_LIMITS[plan];

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
        // We check if 'seo' key exists in updates. Even empty object update is blocked for Free.
        if (updates.seo && plan === 'FREE') {
            return NextResponse.json({
                success: false,
                error: "SEO Optimization is a PRO feature."
            }, { status: 403 });
        }

        // 4. Validate Branding removewatermark, edit customText & edit customUrl (Agency Only)
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
        // -----------------------------

        const page = await BioPage.findOneAndUpdate(
            { _id: id, userId: session.id },
            updates,
            { new: true }
        );

        if (!page) {
            return NextResponse.json({ success: false, error: "Page not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: page });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
