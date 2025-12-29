import { api } from './api';

export const subscriptionApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getSubscriptionStatus: builder.query({
            query: () => '/subscriptions',
            providesTags: ['Subscription'],
        }),
        createPaymentLink: builder.mutation({
            query: (planId) => ({
                url: '/subscriptions/create-payment-link',
                method: 'POST',
                body: { planId },
            }),
            invalidatesTags: ['Subscription'],
        }),
    }),
});

export const {
    useGetSubscriptionStatusQuery,
    useCreatePaymentLinkMutation,
} = subscriptionApi;
