// store/slices/loaderSlice.js
import { createSlice } from "@reduxjs/toolkit";

const loaderSlice = createSlice({
    name: "loader",
    initialState: { count: 0 },
    reducers: {
        startLoading: (state) => {
            state.count += 1;
        },
        stopLoading: (state) => {
            state.count = Math.max(0, state.count - 1);
        },
        resetLoading: (state) => {
            state.count = 0;
        }
    },
});

export const {
    startLoading,
    stopLoading,
    resetLoading
} = loaderSlice.actions;

export const selectGlobalLoading = (state) => state.loader.count > 0;

export default loaderSlice.reducer;
