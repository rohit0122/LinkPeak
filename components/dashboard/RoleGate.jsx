"use client";

// import { useUser } from "@clerk/nextjs"; // Assumes Clerk is set up later or mocked
// import { hasPermission } from "@/lib/roles"; 
// Note: Client-side role checks usually depend on user metadata being available in the session.
// For now we will mock the check or just render children until auth is fully hooked up.

import { PERMISSIONS, hasPermission } from "@/lib/roles";
import { HiLockClosed } from "react-icons/hi2";

export default function RoleGate({ children, permission, userRole }) {
    // In a real app, useUser() from Clerk would give us the role.
    // const { user } = useUser();
    // const userRole = user?.publicMetadata?.role || 'FREE_USER';

    // For dev/scaffolding, we accept userRole as prop or fallback
    const role = userRole || 'FREE_USER';

    if (hasPermission(role, permission)) {
        return <>{children}</>;
    }

    return (
        <div className="alert alert-warning shadow-lg">
            <HiLockClosed className="w-6 h-6" />
            <div>
                <h3 className="font-bold">Access Restricted</h3>
                <div className="text-xs">You need a higher plan to access this feature.</div>
            </div>
            <button className="btn btn-sm btn-primary">Upgrade</button>
        </div>
    );
}
