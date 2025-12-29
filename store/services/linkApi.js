import { api } from './api';

export const linkApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getLinks: builder.query({
            query: (pageId) => `/links?pageId=${pageId}`,
            transformResponse: (response) => response.data,
            providesTags: (result) =>
                result
                    ? [...result.map(({ _id }) => ({ type: 'Link', id: _id })), { type: 'Link', id: 'LIST' }]
                    : [{ type: 'Link', id: 'LIST' }],
        }),
        createLink: builder.mutation({
            query: (data) => ({
                url: '/links',
                method: 'POST',
                body: data,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: [{ type: 'Link', id: 'LIST' }],
        }),
        updateLink: builder.mutation({
            query: (data) => ({
                url: '/links',
                method: 'PATCH',
                body: data,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: (result, error, { id }) => [{ type: 'Link', id }],
        }),
        deleteLink: builder.mutation({
            query: (id) => ({
                url: `/links?id=${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Link', id: 'LIST' }],
        }),
        reorderLinks: builder.mutation({
            query: (links) => ({
                url: '/links',
                method: 'PUT',
                body: { links },
            }),
            invalidatesTags: [{ type: 'Link', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetLinksQuery,
    useCreateLinkMutation,
    useUpdateLinkMutation,
    useDeleteLinkMutation,
    useReorderLinksMutation,
} = linkApi;
