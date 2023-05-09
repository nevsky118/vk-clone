import { api } from './api';

export interface User {
	id: string;
	name: string;
	email: string;
	age?: number;
	avatar?: string;
	city?: string;
	about?: string;
	university?: string;
	liked?: string[];
	friends?: string[];
}

export const userApi = api.injectEndpoints({
	endpoints: build => ({
		getUserById: build.query<User, string>({
			query: id => `/api/users/${id}`,
			providesTags: (result, error, id) => [{ type: 'User', id }],
		}),
		updateUser: build.mutation<User, Partial<User>>({
			query: ({ id, ...body }) => ({
				url: `/api/users/${id}`,
				method: 'PUT',
				body,
			}),
			invalidatesTags: (result, error, { id }) => [
				{ type: 'User', id },
				'Auth',
			],
		}),
		updateAvatar: build.mutation<User, FormData>({
			query: body => ({
				url: `/api/users/avatar`,
				method: 'PATCH',
				body,
			}),
			invalidatesTags: ['Auth'],
		}),
		deleteAvatar: build.mutation<User, void>({
			query() {
				return {
					url: `/api/users/avatar`,
					method: 'DELETE',
				};
			},
			invalidatesTags: ['Auth'],
		}),
	}),
});

export const {
	useGetUserByIdQuery,
	useUpdateUserMutation,
	useUpdateAvatarMutation,
	useDeleteAvatarMutation,
} = userApi;
