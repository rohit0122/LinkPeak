"use client";

import { create } from "zustand";

export const useAnalyticsStore = create((set) => ({
  currentRange: 7,
  setCurrentRange: (range) => set({ currentRange: range }),
}));
