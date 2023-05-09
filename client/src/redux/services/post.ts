import { ListResponse, PaginationQuery, api } from './api';
import { User } from './user';

export interface Post {
	id: string;
	content?: string;
	photo?: string;
	createdAt: string;
	author: User;
	likes: number;
}

interface PostPaginationQuery extends PaginationQuery {
	author: string;
}

export const postApi = api.injectEndpoints({
	endpoints: build => ({
		getPosts: build.query<ListResponse<Post>, PostPaginationQuery>({
			query: ({ author, ...rest }) => ({
				url: `/api/posts/${author}`,
				params: rest,
			}),
			providesTags: result =>
				result
					? [
							...result.docs.map(({ id }) => ({ type: 'Posts', id } as const)),
							{ type: 'Posts', id: 'LIST' },
					  ]
					: [{ type: 'Posts', id: 'LIST' }],
		}),
		addPost: build.mutation<Post, FormData>({
			query(body) {
				return {
					url: `/api/posts`,
					method: 'POST',
					body,
				};
			},
			invalidatesTags: (result, error, id) => [{ type: 'Posts', id: 'LIST' }],
		}),
		getPost: build.query<Post, number>({
			query: id => `/api/posts/${id}`,
			providesTags: (result, error, id) => [{ type: 'Posts', id }],
		}),
		deletePost: build.mutation<Post, string>({
			query(id) {
				return {
					url: `/api/posts/${id}`,
					method: 'DELETE',
				};
			},
			invalidatesTags: (result, error, id) => [
				{ type: 'Posts', id },
				{ type: 'Posts', id: 'LIST' },
			],
		}),
		addLike: build.mutation<Post, string>({
			query: postId => ({
				url: `/api/posts/${postId}/like`,
				method: 'POST',
			}),
			// Optimistic Updates
			async onQueryStarted(postId, { dispatch, queryFulfilled }) {
				let isLiked = false;

				const userPatchResult = dispatch(
					// @ts-ignore
					api.util.updateQueryData('getUser', undefined, draft => {
						// @ts-ignore
						if (!draft.liked.includes(postId)) {
							// @ts-ignore
							draft.liked.push(postId);

							isLiked = false;
						} else {
							// @ts-ignore
							draft.liked = draft.liked.filter(id => id !== postId);

							isLiked = true;
						}
					})
				);

				const postPatchResult = dispatch(
					// @ts-ignore
					api.util.updateQueryData('getPosts', undefined, draft => {
						// @ts-ignore
						const post = draft.docs.find(post => post.id === postId);

						if (post) {
							if (isLiked) {
								post.likes--;
							} else {
								post.likes++;
							}
						}
					})
				);

				try {
					await queryFulfilled;
				} catch {
					postPatchResult.undo();
					userPatchResult.undo();
				}
			},
			invalidatesTags: (result, error, id) => [
				{ type: 'Posts', id },
				{ type: 'Posts', id: 'LIST' },
				{ type: 'Feed', id: 'LIST' },
				'Auth',
			],
		}),
	}),
});

export const {
	useGetPostsQuery,
	useAddPostMutation,
	useGetPostQuery,
	useDeletePostMutation,
	useAddLikeMutation,
} = postApi;
