import { api } from './api';

export const pageApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getPages: builder.query({
            query: () => '/pages',
            transformResponse: (response) => response.data,
            providesTags: ['Page'],
        }),
        getPageBySlug: builder.query({
            query: (slug) => `/pages?slug=${slug}`,
            transformResponse: (response) => response.data,
            providesTags: (result, error, slug) => [{ type: 'Page', id: slug }],
        }),
        createPage: builder.mutation({
            query: (pageData) => ({
                url: '/pages',
                method: 'POST',
                body: pageData,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ['Page'],
        }),
        updatePage: builder.mutation({
            query: ({ id, ...data }) => ({
                url: '/pages',
                method: 'PATCH',
                body: { id, ...data }, // Pass id in body for single-endpoint route
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: (result, error, { slug }) => ['Page', { type: 'Page', id: slug }],
        }),
        deletePage: builder.mutation({
            query: (id) => ({
                url: `/pages?id=${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Page'],
        }),
    }),
});

export const {
    useGetPagesQuery,
    useGetPageBySlugQuery,
    useCreatePageMutation,
    useUpdatePageMutation,
    useDeletePageMutation,
} = pageApi;
