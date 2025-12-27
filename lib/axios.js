import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor for global loading (can be handled in a state provider later)
axiosInstance.interceptors.request.use((config) => {
    // Check if we should skip the global loader for this request
    if (config.skipLoader) return config;

    if (typeof window !== 'undefined' && window.setGlobalLoading) {
        window.setGlobalLoading(true);
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => {
        if (typeof window !== 'undefined' && window.setGlobalLoading) {
            window.setGlobalLoading(false);
        }
        return response;
    },
    (error) => {
        if (typeof window !== 'undefined' && window.setGlobalLoading) {
            window.setGlobalLoading(false);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
