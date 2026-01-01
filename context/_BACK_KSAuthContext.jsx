"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_FRONTEND_LOGIN } from "@/constants/endpoints";

const AuthContext = createContext(undefined);

export const KsAuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [initialized, setInitialized] = useState(false);

    // Restore session from localStorage on mount
    useEffect(() => {
        const userData = localStorage.getItem("currentUser");

        if (userData && userData !== "undefined" && userData !== "null") {
            try {
                const parsed = JSON.parse(userData);
                setCurrentUser(parsed);
            } catch (error) {
                console.error("❌ Failed to decrypt or parse currentUser data:", error);
                // localStorage.removeItem("currentUser");
            }
        }

        setInitialized(true);
    }, []);

    const login = async (identifier, password) => {
        try {
            const variables = {
                input: { identifier, password },
            };

            const response = await axios.post(API_FRONTEND_LOGIN, variables);

            if (!response.data.success) {
                const errorMessage =
                    response.data.message ||
                    "Login failed. Please check your credentials.";
                throw new Error(errorMessage);
            }

            const resObj = response.data.data;

            // Save encrypted currentUser
            localStorage.setItem("currentUser", resObj.currentUser);

            setCurrentUser(JSON.parse((resObj.currentUser)));

            return { success: true };
        } catch (err) {
            return {
                success: false,
                message:
                    err?.response?.data?.message ||
                    err.message ||
                    "Login failed",
            };
        }
    };

    const logout = async () => {
        localStorage.removeItem("currentUser");
        setCurrentUser(null);

        try {
            await axios.get(API_FRONTEND_LOGOUT);
        } catch (err) {
            console.error("Logout failed:", err);
        }

        localStorage.removeItem("currentUser");
        sessionStorage.clear();
        window.location.href = "/login";
    };

    const updateSessionUser = (currentUser) => {
        if (currentUser) {
            const encryptedUser = (JSON.stringify(currentUser));
            localStorage.setItem("currentUser", encryptedUser);
            setCurrentUser(currentUser);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                initialized,
                login,
                logout,
                updateSessionUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within KsAuthProvider");
    }
    return context;
};
