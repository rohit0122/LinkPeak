"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const res = await fetch("/api/auth/me");
            const data = await res.json();
            if (data.success) {
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (data.success) {
                setUser(data.user);
                toast.success("Welcome back!");
                router.push("/dashboard");
                return { success: true };
            } else {
                toast.error(data.error || "Login failed");
                return { success: false, error: data.error };
            }
        } catch (error) {
            toast.error("Something went wrong");
            return { success: false, error: "Network error" };
        }
    };

    const register = async (email, password, name) => {
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, name }),
            });
            const data = await res.json();
            if (data.success) {
                setUser(data.user);
                toast.success("Account created successfully!");
                router.push("/dashboard");
                return { success: true };
            } else {
                toast.error(data.error || "Registration failed");
                return { success: false, error: data.error };
            }
        } catch (error) {
            toast.error("Something went wrong");
            return { success: false, error: "Network error" };
        }
    };

    const logout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            setUser(null);
            toast.success("Logged out");
            router.push("/");
        } catch (error) {
            toast.error("Logout failed");
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, checkUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
