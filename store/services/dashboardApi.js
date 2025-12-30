import { api } from './api';

export const dashboardApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardInit: builder.query({
            query: () => '/dashboard/init',
            transformResponse: (response) => response.data,
            providesTags: ['User', 'Subscription', 'Page', 'Link', 'Analytics'],
        }),
    }),
});

export const {
    useGetDashboardInitQuery,
} = dashboardApi;
