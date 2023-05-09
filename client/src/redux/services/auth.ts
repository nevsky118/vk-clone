import { User } from './user';
import { api } from './api';

export type AuthResponse = {
	access_token: string;
	refresh_token: string;
	user: User;
};

export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	name: string;
	email: string;
	password: string;
}

export const authApi = api.injectEndpoints({
	endpoints: build => ({
		login: build.mutation<AuthResponse, LoginRequest>({
			query: credentials => ({
				url: '/api/auth/login',
				method: 'POST',
				body: credentials,
			}),
			invalidatesTags: ['Auth'],
		}),
		register: build.mutation<AuthResponse, RegisterRequest>({
			query: credentials => ({
				url: '/api/auth/register',
				method: 'POST',
				body: credentials,
			}),
			// invalidatesTags: ['Auth'],
		}),
		getUser: build.query<User, void>({
			query: () => `/api/auth/profile`,
			providesTags: ['Auth'],
		}),
	}),
});

export const { useLoginMutation, useGetUserQuery, useRegisterMutation } =
	authApi;
