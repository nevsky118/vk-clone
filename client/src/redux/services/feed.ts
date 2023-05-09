import { ListResponse, PaginationQuery, api } from './api';
import { Post } from './post';

export const feedApi = api.injectEndpoints({
	endpoints: build => ({
		getFeed: build.query<ListResponse<Post>, PaginationQuery>({
			query: params => ({
				url: `/api/feed`,
				params,
			}),
			providesTags: result =>
				result
					? [
							...result.docs.map(({ id }) => ({ type: 'Feed', id } as const)),
							{ type: 'Feed', id: 'LIST' },
					  ]
					: [{ type: 'Feed', id: 'LIST' }],
		}),
	}),
});

export const { useGetFeedQuery } = feedApi;
