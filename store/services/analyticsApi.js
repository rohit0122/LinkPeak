import { api } from './api';

export const analyticsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAnalytics: builder.query({
            query: ({ pageId, range }) => `/analytics?pageId=${pageId}${range ? `&range=${range}` : ''}`,
            providesTags: (result, error, { pageId }) => [{ type: 'Analytics', id: pageId }],
        }),
    }),
});

export const {
    useGetAnalyticsQuery,
} = analyticsApi;
