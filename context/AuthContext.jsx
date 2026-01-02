"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "@/lib/axios";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-hot-toast";
import { ENDPOINTS } from "@/constants/endpoints";
import { useLoader } from "@/context/LoaderContext";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [initialized, setInitialized] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { showLoader, hideLoader } = useLoader();

    // Check if route requires auth
    const isProtectedRoute = useCallback(() => {
        const protectedPaths = ['/dashboard', '/admin'];
        return protectedPaths.some(path => pathname?.startsWith(path));
    }, [pathname]);

    // Fetch currentUser session (called only once on mount or after login)
    const fetchUser = useCallback(async (force = false) => {
        // Skip if already initialized and not forced
        if (initialized && !force) return;

        try {
            setLoading(true);
            const res = await axios.get(ENDPOINTS.AUTH.ME, { skipLoader: true });

            if (res.data?.success) {
                const userData = res.data.data;
                setCurrentUser(userData);

                // Cache in localStorage for instant load
                localStorage.setItem("lpkSiteCurrentUser", JSON.stringify(userData));
            }
        } catch (error) {
            // Clear cache on 401
            if (error.response?.status === 401) {
                setCurrentUser(null);
                localStorage.removeItem("lpkSiteCurrentUser");

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
        const userData = localStorage.getItem("lpkSiteCurrentUser");

        if (userData && userData !== "undefined" && userData !== "null") {
            try {
                const parsed = JSON.parse(userData);
                setCurrentUser(parsed);
            } catch (error) {
                console.error("❌ Failed to decrypt or parse currentUser data:", error);
                // localStorage.removeItem("currentUser");
            }
            setInitialized(true);
        }
        setLoading(false);
    }, []); // Empty deps - runs once on mount

    // Login function
    const login = useCallback(async (email, password) => {
        try {
            const res = await axios.post(ENDPOINTS.AUTH.LOGIN, { email, password });
            if (res.data?.success) {
                const userData = await res.data.data;
                localStorage.setItem("lpkSiteCurrentUser", JSON.stringify(userData));

                setCurrentUser(userData);
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

            const res = await axios.post(ENDPOINTS.AUTH.REGISTER, { name, email, password });

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
            showLoader();
            await axios.post(ENDPOINTS.AUTH.LOGOUT);
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setCurrentUser(null);
            localStorage.removeItem("lpkSiteCurrentUser");
            router.push("/login");
            toast.success("Logged out successfully");
            hideLoader();
        }
    }, [router]);

    const updateCurrentUserSession = (currentUser) => {
        if (currentUser) {
            const encryptedUser = (JSON.stringify(currentUser));
            localStorage.setItem("currentUser", encryptedUser);
            setCurrentUser(currentUser);
        }
    };


    // Refresh currentUser data (call after profile updates)
    const refreshUser = useCallback(() => {
        return fetchUser(true);
    }, [fetchUser]);

    const value = {
        currentUser,
        loading,
        isAuthenticated: !!currentUser,
        login,
        register,
        logout,
        refreshUser,
        updateCurrentUserSession
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
