import axios from "axios";
const API_FRONTEND_PATH = `${process.env.NEXT_PUBLIC_SITE_URL}/api`;

const axiosInstance = axios.create({
    baseURL: API_FRONTEND_PATH,
    headers: {
        "Content-Type": "application/json",
    },
});


/*
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
*/
export default axiosInstance;
