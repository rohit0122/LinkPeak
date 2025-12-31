import { createSlice } from "@reduxjs/toolkit";

const analyticsSlice = createSlice({
    name: "analytics",
    initialState: {
        range: 7,
    },
    reducers: {
        setRange(state, action) {
            state.range = action.payload;
        },
    },
});

export const { setRange } = analyticsSlice.actions;
export default analyticsSlice.reducer;
