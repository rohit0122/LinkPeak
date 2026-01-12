import axios from "axios";
import { cookies } from "next/headers";
import { BACKEND_URL } from "@/constants/endpoints";

/**
 * Server-Side HTTP Client for fetching data from Laravel Backend.
 * Automatically injects the Authorization header from the HttpOnly cookie.
 */
const restClient = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
    // Prevent axios from throwing on 4xx/5xx so we can handle them gracefully in the proxy
    validateStatus: () => true,
});

// Request Interceptor: Attach Token from Cookies
restClient.interceptors.request.use(async (config) => {
    // We utilize the `next/headers` cookies function which works in App Router (Server Components & Route Handlers)
    const cookieStore = await cookies();
    const token = cookieStore.get("lpkSiteToken");

    if (token) {
        config.headers.Authorization = `Bearer ${token.value}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default restClient;
