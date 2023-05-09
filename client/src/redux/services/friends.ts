import { ListResponse, PaginationQuery, api } from './api';
import { User } from './user';

export interface Friend {
	id: string;
	from: string | User; // от кого запрос
	to: string | User; // кому запрос
	pending: boolean; // true - заявка ожидает рассмотрения, false - принята
	createdAt: string;
	updatedAt: string;
}

interface IncomingFriendRequestsResponse extends Friend {
	from: User;
	to: string;
}

interface OutgoingFriendRequestsResponse extends Friend {
	from: string;
	to: User;
}

interface FriendListResponse
	extends Pick<
		ListResponse<User & { friendShipId: string }>,
		'docs' | 'page' | 'totalDocs'
	> {}

export const friendApi = api.injectEndpoints({
	endpoints: build => ({
		getFriendRequestStatus: build.query<Friend, string>({
			query: id => `/api/friends/status/${id}`,
			providesTags: (result, error, id) => [{ type: 'Friends', id }],
		}),
		addFriend: build.mutation<Friend, { to: string }>({
			query(body) {
				return {
					url: `/api/friends/create`,
					method: 'POST',
					body,
				};
			},
			invalidatesTags: (result, error, id) => [
				{ type: 'Friends', id: 'FRIEND-LIST' },
				{ type: 'Friends', id: 'LIST' },
				{ type: 'Friends', id: result?.to as string },
			],
		}),
		deleteFriend: build.mutation<Friend, string>({
			query(friendRequestId) {
				return {
					url: `/api/friends/${friendRequestId}`,
					method: 'DELETE',
				};
			},
			invalidatesTags: (result, error, id) => [
				{ type: 'Friends', id: 'FRIEND-LIST' },
				{ type: 'Friends', id: 'LIST' },
				{ type: 'Friends', id: result?.to as string },
			],
		}),
		acceptFriendRequest: build.mutation<Friend, string>({
			query(friendRequestId) {
				return {
					url: `/api/friends/${friendRequestId}/accept`,
					method: 'PATCH',
				};
			},
			invalidatesTags: (result, error, id) => [
				{ type: 'Friends', id: 'FRIEND-LIST' },
				{ type: 'Friends', id: 'LIST' },
				{ type: 'Friends', id: 'INCOMING-LIST' },
			],
		}),
		rejectFriendRequest: build.mutation<Friend, string>({
			query(id) {
				return {
					url: `/api/friends/${id}/reject`,
					method: 'PATCH',
				};
			},
			invalidatesTags: [{ type: 'Friends', id: 'OUTGOING-LIST' }],
		}),
		getIncomingFriends: build.query<IncomingFriendRequestsResponse[], void>({
			query: () => `/api/friends/incoming`,
			providesTags: result =>
				result
					? [
							...result.map(({ id }) => ({ type: 'Friends', id } as const)),
							{ type: 'Friends', id: 'INCOMING-LIST' },
					  ]
					: [{ type: 'Friends', id: 'INCOMING-LIST' }],
		}),
		getOutgoingFriends: build.query<OutgoingFriendRequestsResponse[], void>({
			query: () => `/api/friends/outgoing`,
			providesTags: result =>
				result
					? [
							...result.map(({ id }) => ({ type: 'Friends', id } as const)),
							{ type: 'Friends', id: 'OUTGOING-LIST' },
					  ]
					: [{ type: 'Friends', id: 'OUTGOING-LIST' }],
		}),
		getFriendsList: build.query<FriendListResponse, PaginationQuery>({
			query: params => ({
				url: `/api/friends/list`,
				params,
			}),
			providesTags: result =>
				result
					? [
							...result.docs.map(
								({ id }) => ({ type: 'Friends', id } as const)
							),
							{ type: 'Friends', id: 'FRIEND-LIST' },
					  ]
					: [{ type: 'Friends', id: 'FRIEND-LIST' }],
		}),
		getFriendsFindList: build.query<ListResponse<User>, PaginationQuery>({
			query: params => ({
				url: `/api/friends/find`,
				params,
			}),
			providesTags: result =>
				result
					? [
							...result.docs.map(
								({ id }) => ({ type: 'Friends', id } as const)
							),
							{ type: 'Friends', id: 'FRIEND-FIND-LIST' },
					  ]
					: [{ type: 'Friends', id: 'FRIEND-FIND-LIST' }],
		}),
		getFriendsByUser: build.query<
			FriendListResponse,
			PaginationQuery & {
				userId: string;
			}
		>({
			query: ({ userId, ...rest }) => ({
				url: `/api/friends/list/${userId}`,
				params: rest,
			}),
			providesTags: result =>
				result
					? [
							...result.docs.map(
								({ id }) => ({ type: 'Friends', id } as const)
							),
							{ type: 'Friends', id: 'LIST' },
					  ]
					: [{ type: 'Friends', id: 'LIST' }],
		}),
	}),
});

export const {
	useAddFriendMutation,
	useDeleteFriendMutation,
	useAcceptFriendRequestMutation,
	useRejectFriendRequestMutation,
	useGetIncomingFriendsQuery,
	useGetOutgoingFriendsQuery,
	useGetFriendsByUserQuery,
	useGetFriendsListQuery,
	useGetFriendRequestStatusQuery,
	useGetFriendsFindListQuery,
} = friendApi;
