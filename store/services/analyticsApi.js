import { api } from './api';

export const analyticsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAnalytics: builder.query({
            query: ({ pageId, range }) => `/analytics?pageId=${pageId}${range ? `&range=${range}` : ''}`,
            transformResponse: (res) => res.data,
            providesTags: (result, error, { pageId }) => [{ type: 'Analytics', id: pageId }],
        }),
        getLifeTimeStats: builder.query({
            query: ({ pageId, lifetime }) => `/analytics?pageId=${pageId}&lifetime=${lifetime}`,
            transformResponse: (res) => res.data,
            providesTags: (result, error, { pageId }) => [{ type: 'Analytics', id: pageId }],
        }),
    }),
});

export const {
    useGetAnalyticsQuery,
    useGetLifeTimeStatsQuery,
} = analyticsApi;
