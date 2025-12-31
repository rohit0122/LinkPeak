import useSWR from "swr";
import axios from "@/lib/axios";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "@/store/slices/loaderSlice";
import { useEffect } from "react";

// Fetcher function for SWR
const fetcher = (url) => axios.get(url).then((res) => res.data);

// Custom hooks for data fetching with caching

export function useAnalytics(pageId, range = "7D") {
    const { data, error, isLoading, mutate } = useSWR(
        pageId ? `/analytics?pageId=${pageId}&range=${range}` : null,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            dedupingInterval: 60000, // 1 minute
        }
    );

    return {
        analytics: data?.data,
        totals: data?.totals,
        lifetime: data?.lifetime,
        isLoading,
        isError: error,
        refresh: mutate,
    };
}

export function useDashboardInit() {
    const { data, error, isLoading, mutate } = useSWR(
        "/dashboard/init",
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 300000, // 5 minutes
        }
    );

    return {
        user: data?.user,
        pages: data?.pages,
        links: data?.links,
        subscription: data?.subscription,
        isLoading,
        isError: error,
        refresh: mutate,
    };
}

export function useLinks(pageId) {
    const { data, error, isLoading, mutate } = useSWR(
        pageId ? `/links?pageId=${pageId}` : null,
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 30000, // 30 seconds
        }
    );

    return {
        links: data?.data || [],
        isLoading,
        isError: error,
        refresh: mutate,
    };
}

export function useSubscription() {
    const { data, error, isLoading, mutate } = useSWR(
        "/subscriptions",
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000, // 1 minute
        }
    );

    return {
        subscription: data?.data,
        isLoading,
        isError: error,
        refresh: mutate,
    };
}



/**
 * Hook to sync multiple RTK Query queries with global loader
 * queries: array of objects with { isFetching, data }
 */
export function useQueryLoader(queries) {
    const dispatch = useDispatch();

    useEffect(() => {
        const isAnyFetching = queries.some(q => q.isFetching);
        const allResolved = queries.every(q => !q.isFetching && (q.data !== undefined));

        if (isAnyFetching) {
            dispatch(startLoading());
        } else if (allResolved) {
            dispatch(stopLoading());
        }
    }, [queries, dispatch]);
}
