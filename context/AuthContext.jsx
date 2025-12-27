"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "@/lib/axios";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-hot-toast";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [initialized, setInitialized] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    // Check if route requires auth
    const isProtectedRoute = useCallback(() => {
        const protectedPaths = ['/dashboard', '/admin'];
        return protectedPaths.some(path => pathname?.startsWith(path));
    }, [pathname]);

    // Fetch user session (called only once on mount or after login)
    const fetchUser = useCallback(async (force = false) => {
        // Skip if already initialized and not forced
        if (initialized && !force) return;

        try {
            setLoading(true);
            const res = await axios.get("/auth/me");

            if (res.data?.success) {
                const userData = res.data.data;
                setUser(userData);

                // Cache in localStorage for instant load
                localStorage.setItem("site_user", JSON.stringify(userData));
            }
        } catch (error) {
            // Clear cache on 401
            if (error.response?.status === 401) {
                setUser(null);
                localStorage.removeItem("site_user");

                // Redirect to login if on protected route
                if (isProtectedRoute()) {
                    router.push("/login");
                }
            }
        } finally {
            setLoading(false);
            setInitialized(true);
        }
    }, [initialized, isProtectedRoute, router]);

    // Initialize from cache first, then verify ONLY if needed
    useEffect(() => {
        // Try to load from cache immediately
        const cached = localStorage.getItem("site_user");

        if (cached) {
            try {
                const cachedUser = JSON.parse(cached);
                setUser(cachedUser);
                setLoading(false);
                // Verify cached data with server
                fetchUser();
            } catch (e) {
                localStorage.removeItem("site_user");
                setLoading(false);
                setInitialized(true);
            }
        } else {
            // No cached user
            // Only fetch if on protected route
            if (isProtectedRoute()) {
                fetchUser();
            } else {
                // Public page, no user - skip API call
                setLoading(false);
                setInitialized(true);
            }
        }
    }, []); // Empty deps - runs once on mount

    // Login function
    const login = useCallback(async (email, password) => {
        try {
            const res = await axios.post("/auth/login", { email, password });

            if (res.data?.success) {
                const userData = res.data.data;
                setUser(userData);
                localStorage.setItem("site_user", JSON.stringify(userData));
                toast.success("Welcome back!");

                // Redirect based on role
                if (userData.role === 'admin') {
                    router.push("/admin");
                } else {
                    router.push("/dashboard");
                }
                return { success: true };
            }
        } catch (error) {
            const message = error.response?.data?.error || "Login failed";
            toast.error(message);
            return { success: false, error: message };
        }
    }, [router]);

    // Register function
    const register = useCallback(async (name, email, password) => {
        try {
            const res = await axios.post("/auth/register", { name, email, password });

            if (res.data?.success) {
                toast.success("Registration successful! Please login.");
                router.push("/login");
                return { success: true };
            }
        } catch (error) {
            const message = error.response?.data?.error || "Registration failed";
            toast.error(message);
            return { success: false, error: message };
        }
    }, [router]);

    // Logout function
    const logout = useCallback(async () => {
        try {
            await axios.post("/auth/logout");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setUser(null);
            localStorage.removeItem("site_user");
            router.push("/login");
            toast.success("Logged out successfully");
        }
    }, [router]);

    // Refresh user data (call after profile updates)
    const refreshUser = useCallback(() => {
        return fetchUser(true);
    }, [fetchUser]);

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
