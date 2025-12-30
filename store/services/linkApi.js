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
            invalidatesTags: ['Link', { type: 'Link', id: 'LIST' }],
            // Optimistic Update
            async onQueryStarted(data, { dispatch, queryFulfilled }) {
                // We can't easily optimistically add a link because we don't have the ID yet.
                // But we can eagerly invalidate or just wait for the response. 
                // For creation, standard invalidation is usually acceptable, or we create a temp ID.
                // Let's stick to invalidation for creation, but optimistic for others.
            },
        }),
        updateLink: builder.mutation({
            query: (data) => ({
                url: '/links',
                method: 'PATCH',
                body: data,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: (result, error, { id }) => ['Link', { type: 'Link', id }],
            async onQueryStarted({ id, pageId, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    linkApi.util.updateQueryData('getLinks', pageId, (draft) => {
                        const link = draft.find((l) => l._id === id);
                        if (link) {
                            Object.assign(link, patch);
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
        deleteLink: builder.mutation({
            query: (id) => ({
                url: `/links?id=${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Link', { type: 'Link', id: 'LIST' }],
            async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
                // We need pageId to update the cache. It might be passed or we might scan caches.
                // Simpler approach: if we don't have pageId easily, optimistic delete is harder.
                // But typically delete accepts an ID.
                for (const { endpointName, originalArgs } of linkApi.util.selectInvalidatedBy(getState(), [{ type: 'Link', id: 'LIST' }])) {
                    if (endpointName !== 'getLinks') continue;
                    dispatch(
                        linkApi.util.updateQueryData('getLinks', originalArgs, (draft) => {
                            return draft.filter((l) => l._id !== id);
                        })
                    );
                }
                try {
                    await queryFulfilled;
                } catch {
                    // Invalidation will restore it anyway
                }
            },
        }),
        reorderLinks: builder.mutation({
            query: (links) => ({
                url: '/links',
                method: 'PUT',
                body: { links },
            }),
            invalidatesTags: ['Link', { type: 'Link', id: 'LIST' }],
            async onQueryStarted(links, { dispatch, queryFulfilled, getState }) {
                // links passed here is the new array of IDs or objects? 
                // Based on usage: usually just the reordered list.
                // We need to know which pageId this belongs to. 
                // Assuming 'links' contains objects with pageId or we scan caches.
                if (links.length > 0) {
                    const pageId = links[0].pageId;
                    if (pageId) {
                        const patchResult = dispatch(
                            linkApi.util.updateQueryData('getLinks', pageId, (draft) => {
                                // Replace draft with new order, assuming links is full object array
                                // If links is just IDs, we can't do this easily.
                                // Assuming 'links' is the full reordered array as is common.
                                return links;
                            })
                        );
                        try {
                            await queryFulfilled;
                        } catch {
                            patchResult.undo();
                        }
                    }
                }
            },
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
