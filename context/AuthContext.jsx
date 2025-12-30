"use client";

import { createContext, useContext, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
    setCredentials,
    logout as logoutAction,
    selectCurrentUser,
    selectAuthLoading,
    setLoading
} from "@/store/slices/authSlice";
import {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation
} from "@/store/services/authApi";
import axios from "@/lib/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const dispatch = useDispatch();
    const user = useSelector(selectCurrentUser);
    const loading = useSelector(selectAuthLoading);

    const router = useRouter();
    const pathname = usePathname();

    const [loginMutation] = useLoginMutation();
    const [registerMutation] = useRegisterMutation();
    const [logoutMutation] = useLogoutMutation();

    // Check if route requires auth
    const isProtectedRoute = useCallback(() => {
        const protectedPaths = ['/dashboard', '/admin'];
        return protectedPaths.some(path => pathname?.startsWith(path));
    }, [pathname]);

    // Fetch user session
    const fetchUser = useCallback(async (force = false) => {
        try {
            dispatch(setLoading(true));
            const res = await axios.get("/auth/me", { skipLoader: true });

            if (res.data?.success) {
                const userData = res.data.data;
                dispatch(setCredentials(userData));
                localStorage.setItem("site_user", JSON.stringify(userData));
            }
        } catch (error) {
            if (error.response?.status === 401) {
                dispatch(logoutAction());
                localStorage.removeItem("site_user");
                if (isProtectedRoute()) {
                    router.push("/login");
                }
            }
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch, isProtectedRoute, router]);

    // Initialize from cache first
    useEffect(() => {
        const cached = localStorage.getItem("site_user");
        if (cached) {
            try {
                const cachedUser = JSON.parse(cached);
                dispatch(setCredentials(cachedUser));
                fetchUser(); // Verify with server
            } catch (e) {
                localStorage.removeItem("site_user");
                dispatch(setLoading(false));
            }
        } else {
            if (isProtectedRoute()) {
                fetchUser();
            } else {
                dispatch(setLoading(false));
            }
        }
    }, [dispatch, isProtectedRoute, fetchUser]);

    // Login function
    const login = useCallback(async (email, password) => {
        if (typeof window !== 'undefined' && window.setGlobalLoading) {
            window.setGlobalLoading(true);
        }
        try {
            const res = await loginMutation({ email, password }).unwrap();

            if (res.success) {
                const userData = res.data;
                dispatch(setCredentials(userData));
                localStorage.setItem("site_user", JSON.stringify(userData));
                toast.success("Welcome back!");

                if (typeof window !== 'undefined' && window.setGlobalLoading) {
                    window.setGlobalLoading(true);
                }

                if (userData.role === 'admin') {
                    router.push("/admin");
                } else {
                    router.push("/dashboard");
                }
                return { success: true };
            }
        } catch (error) {
            const message = error.data?.error || "Login failed";
            toast.error(message);
            return { success: false, error: message };
        }
    }, [dispatch, loginMutation, router]);

    // Register function
    const register = useCallback(async (name, email, password) => {
        try {
            const res = await registerMutation({ name, email, password }).unwrap();
            if (res.success) {
                toast.success("Registration successful! Please login.");
                router.push("/login");
                return { success: true };
            }
        } catch (error) {
            const message = error.data?.error || "Registration failed";
            toast.error(message);
            return { success: false, error: message };
        }
    }, [registerMutation, router]);

    // Logout function
    const logout = useCallback(async () => {
        try {
            await logoutMutation().unwrap();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            dispatch(logoutAction());
            localStorage.removeItem("site_user");
            router.push("/login");
            toast.success("Logged out successfully");
        }
    }, [dispatch, logoutMutation, router]);

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
