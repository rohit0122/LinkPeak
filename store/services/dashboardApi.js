import { api } from './api';

export const dashboardApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardInit: builder.query({
            query: () => '/dashboard/init',
            providesTags: ['User', 'Page', 'Subscription', 'Link', 'Analytics'],
        }),
    }),
});

export const {
    useGetDashboardInitQuery,
} = dashboardApi;
