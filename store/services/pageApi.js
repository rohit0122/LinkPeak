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
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                // Determine how to update cache. Since we list pages (getPages) and get items (getPageBySlug).
                // Updating LIST cache is easy if we scan for 'getPages'.
                const patchResult = dispatch(
                    pageApi.util.updateQueryData('getPages', undefined, (draft) => {
                        const page = draft.find((p) => p._id === id);
                        if (page) {
                            Object.assign(page, patch);
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
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
