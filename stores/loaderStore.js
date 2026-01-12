"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useLoaderStore = create(
  devtools(
    (set) => ({
      loading: false,

      showLoader: () => set({ loading: true }),
      hideLoader: () => set({ loading: false }),
      setLoading: (value) => set({ loading: value }),
    }),
    {
      name: "LoaderStore",
    }
  )
);
