"use client";

// import { useUser } from "@clerk/nextjs"; // Assumes Clerk is set up later or mocked
// Note: Client-side role checks usually depend on user metadata being available in the session.
// For now we will mock the check or just render children until auth is fully hooked up.

import { useAuth } from "@/context/AuthContext";
import { PERMISSIONS, hasPermission } from "@/lib/roles";
import { HiSparkles, HiLockClosed } from "react-icons/hi2";
import Link from "next/link";

export default function RoleGate({ children, permission }) {
    const { user, loading } = useAuth();

    if (loading) return null;

    const role = user?.role || "FREE_USER";
    const canAccess = hasPermission(role, permission);

    if (canAccess) {
        return <>{children}</>;
    }

    return (
        <div className="alert alert-warning shadow-lg rounded-2xl border-none bg-warning/10 text-warning-content">
            <HiLockClosed className="w-6 h-6" />
            <div>
                <h3 className="font-bold">Access Restricted</h3>
                <div className="text-xs">You need a higher plan to access this feature.</div>
            </div>
            <button className="btn btn-sm btn-primary">Upgrade</button>
        </div>
    );
}
