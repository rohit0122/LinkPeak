import { api } from './api';

export const pageApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getPages: builder.query({
            query: () => '/pages',
            providesTags: ['Page'],
        }),
        getPageBySlug: builder.query({
            query: (slug) => `/pages/${slug}`,
            providesTags: (result, error, slug) => [{ type: 'Page', id: slug }],
        }),
        createPage: builder.mutation({
            query: (pageData) => ({
                url: '/pages',
                method: 'POST',
                body: pageData,
            }),
            invalidatesTags: ['Page'],
        }),
        updatePage: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/pages/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { slug }) => ['Page', { type: 'Page', id: slug }],
        }),
        deletePage: builder.mutation({
            query: (id) => ({
                url: `/pages/${id}`,
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
