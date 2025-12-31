import { startLoading, stopLoading } from "@/store/slices/loaderSlice";

export const createWithLoading = (dispatch) => {
    return (asyncFn) => {
        return async (...args) => {
            dispatch(startLoading());
            try {
                return await asyncFn(...args);
            } finally {
                dispatch(stopLoading());
            }
        };
    };
};
