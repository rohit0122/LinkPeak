"use client";

import { createContext, useContext, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import {
    setCredentials,
    logout as logoutAction,
    selectCurrentUser
} from "@/store/slices/authSlice";

import {
    startLoading,
    stopLoading,
    resetLoading
} from "@/store/slices/loaderSlice";

import {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation
} from "@/store/services/authApi";

import { api } from "@/store/services/api";
import axios from "@/lib/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const dispatch = useDispatch();
    const user = useSelector(selectCurrentUser);

    const router = useRouter();
    const pathname = usePathname();

    const [loginMutation] = useLoginMutation();
    const [registerMutation] = useRegisterMutation();
    const [logoutMutation] = useLogoutMutation();

    const isProtectedRoute = useCallback(() => {
        return pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");
    }, [pathname]);

    // ───────── Fetch user ─────────
    const fetchUser = useCallback(async () => {
        dispatch(startLoading());
        try {
            const res = await axios.get("/auth/me", { skipLoader: true });

            if (res.data?.success) {
                dispatch(setCredentials(res.data.data));
                localStorage.setItem("site_user", JSON.stringify(res.data.data));
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
            dispatch(stopLoading());
        }
    }, [dispatch, router, isProtectedRoute]);

    // ───────── Init ─────────
    useEffect(() => {
        const cached = localStorage.getItem("site_user");

        if (cached) {
            try {
                dispatch(setCredentials(JSON.parse(cached)));
                fetchUser();
            } catch {
                localStorage.removeItem("site_user");
            }
        } else if (isProtectedRoute()) {
            fetchUser();
        }
    }, [dispatch, fetchUser, isProtectedRoute]);

    // ───────── Login ─────────
    const login = useCallback(async (email, password) => {
        dispatch(startLoading());
        try {
            const res = await loginMutation({ email, password }).unwrap();

            if (res.success) {
                dispatch(setCredentials(res.data));
                localStorage.setItem("site_user", JSON.stringify(res.data));
                toast.success("Welcome back!");

                router.push(res.data.role === "admin" ? "/admin" : "/dashboard");
                return { success: true };
            }
        } catch (err) {
            toast.error(err.data?.error || "Login failed");
            return { success: false };
        } finally {
            dispatch(stopLoading());
        }
    }, [dispatch, loginMutation, router]);

    // ───────── Register ─────────
    const register = useCallback(async (name, email, password) => {
        dispatch(startLoading());
        try {
            const res = await registerMutation({ name, email, password }).unwrap();
            if (res.success) {
                toast.success("Registration successful!");
                router.push("/login");
            }
        } catch (err) {
            toast.error(err.data?.error || "Registration failed");
        } finally {
            dispatch(stopLoading());
        }
    }, [dispatch, registerMutation, router]);

    // ───────── Logout ─────────
    const logout = useCallback(async () => {
        dispatch(startLoading());
        try {
            dispatch(logoutAction());
            localStorage.removeItem("site_user");
            dispatch(api.util.resetApiState());
            await logoutMutation().unwrap();
        } catch (err) {
            console.error(err);
        } finally {
            dispatch(resetLoading());
            router.push("/login");
            toast.success("Logged out");
        }
    }, [dispatch, logoutMutation, router]);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login,
                register,
                logout,
                refreshUser: fetchUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
