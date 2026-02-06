"use client";

import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";
import axios from "@/lib/httpClient";
import { ENDPOINTS } from "@/constants/endpoints";
import { toast } from "react-hot-toast";
import { useLoaderStore } from "@/stores/loaderStore";

export const useAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
        // ======================
        // STATE
        // ======================
        currentUser: null,
        currentBioPage: null,
        currentSubscription: null,
        allBioPages: null,

        loading: false,
        isAuthenticated: false,
        tempBioPageConfig: {},
        dirtyFields: {},

        // ======================
        //  LOGIN
        // ======================
        login: async (email, password, router) => {
          try {
            set({ loading: true });

            const res = await axios.post(ENDPOINTS.AUTH.LOGIN, {
              email,
              password,
            });

            if (res?.data?.success) {
              const { user, subscription, bio_page, all_page_ids } =
                res?.data?.data;

              const userObj = {
                ...user,
                plan: subscription?.plan_name,
              };
              set(
                {
                  currentUser: userObj,
                  currentSubscription: subscription,
                  currentBioPage: bio_page,
                  allBioPages: all_page_ids,
                  isAuthenticated: true,
                  loading: false,
                },
                false,
                "auth/loginSuccess"
              );

              // Show global loader until dashboard mounts
              useLoaderStore.getState().showLoader();

              if (router) {
                const targetPath = user.role === "admin" ? "/admin" : "/dashboard";
                router.push(`${targetPath}?welcome=true`);
              }

              return { success: true };
            }
          } catch (error) {
            const message =
              error.response?.data?.message ||
              error.response?.data?.error ||
              "Login failed";

            toast.error(message);
            set({ loading: false }, false, "auth/loginError");

            return { success: false, message };
          }
        },

        // ======================
        // 📝 REGISTER
        // ======================
        register: async (name, email, password, plan, router) => {
          try {
            const res = await axios.post(ENDPOINTS.AUTH.REGISTER, {
              name,
              email,
              password,
              plan,
            });

            if (res.data?.success) {
              toast.success("Registration successful! Please login.");
              // if (router) router.push("/login");
              return { success: true };
            }
          } catch (error) {
            const resData = error.response?.data;
            let message =
              resData?.message || resData?.error || "Registration failed";

            // Extract specific validation error if available
            if (resData?.data && typeof resData.data === "object") {
              const validationMsg = Object.values(resData.data)[0]?.[0];
              if (validationMsg) message = validationMsg;
            }

            toast.error(message);
            return { success: false, message };
          }
        },

        // ======================
        // 🚪 LOGOUT
        // ======================
        logout: async (router) => {
          try {
            await axios.post(ENDPOINTS.AUTH.LOGOUT);
            useLoaderStore.getState().showLoader(); // Show loader during logout redirect
          } catch (error) {
            console.error("Logout error:", error);
          } finally {
            set(
              {
                currentUser: null,
                currentSubscription: null,
                currentBioPage: null,
                allBioPages: null,
                isAuthenticated: false,
                loading: false,
                tempBioPageConfig: {},
                dirtyFields: {},
              },
              false,
              "auth/logout"
            );
            if (router) router.push("/login?logged_out=true"); // Ensure redirect happens after state clear
          }
        },

        // ======================
        // 🔄 SESSION UPDATERS
        // ======================
        updateCurrentUserSession: (user) =>
          set(
            {
              currentUser: user,
              isAuthenticated: !!user,
            },
            false,
            "auth/updateUser"
          ),
        resetAuthStore: () =>
          set(
            {
              currentUser: null,
              currentBioPage: null,
              currentSubscription: null,
              allBioPages: null,
              isAuthenticated: false,
              loading: false,
              tempBioPageConfig: {},
              dirtyFields: {},
            },
            false,
            "auth/reset"
          ),

        updateCurrentBioPageSession: (page) =>
          set({ currentBioPage: page }, false, "auth/updateBioPage"),

        updateCurrentSubscriptionSession: (subscription) =>
          set(
            { currentSubscription: subscription },
            false,
            "auth/updateSubscription"
          ),

        updateAllBioPagesSession: (pages) =>
          set({ allBioPages: pages }, false, "auth/updateAllPages"),

        updateTempBioPageConfigSession: (partial) =>
          set(
            (state) => {
              const updatedTemp = { ...state.tempBioPageConfig };
              const updatedDirty = { ...state.dirtyFields };

              Object.entries(partial).forEach(([key, value]) => {
                const originalValue = state.currentBioPage?.[key];

                if (value === originalValue) {
                  // User reverted back to original → not dirty anymore
                  delete updatedTemp[key];
                  delete updatedDirty[key];
                } else {
                  // Actual change
                  updatedTemp[key] = value;
                  updatedDirty[key] = true;
                }
              });

              return {
                tempBioPageConfig: updatedTemp,
                dirtyFields: updatedDirty,
              };
            },
            false,
            "auth/updateTempBioPageConfig"
          ),
        clearTempBioPage: () =>
          set(
            { tempBioPageConfig: {}, dirtyFields: {} },
            false,
            "auth/clearTempBioPage"
          ),
      }),

      {
        name: "lpkAuthStorage",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          currentUser: state.currentUser,
          currentBioPage: state.currentBioPage,
          currentSubscription: state.currentSubscription,
          allBioPages: state.allBioPages,
          isAuthenticated: state.isAuthenticated,
          tempBioPageConfig: state.tempBioPageConfig,
        }),
      }
    ),
    {
      name: "Auth Store",
      enabled: process.env.NODE_ENV === "development",
    }
  )
);
