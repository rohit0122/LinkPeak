import { api } from './api';

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getProfile: builder.query({
            query: () => '/auth/profile', // Assuming there's a profile route or we create one
            providesTags: ['User'],
        }),
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['User'],
        }),
        register: builder.mutation({
            query: (userData) => ({
                url: '/auth/register',
                method: 'POST',
                body: userData,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const {
    useGetProfileQuery,
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
} = authApi;
