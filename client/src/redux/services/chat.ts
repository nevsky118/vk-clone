import { api } from './api';
import { User } from './user';
import { getSocket } from '../socket';

export interface Chat {
	id: string;
	members: User[];
	lastMessage: Message;
}

enum ChatEvent {
	JoinedChat = 'joinedChat',
	SendMessage = 'sendMessage',
	NewMessage = 'newMessage',
	JoinChat = 'joinChat',
}

export interface Message {
	id: string;
	chatId: string;
	sender: User;
	text: string;
	createdAt: string;
}

type ChatsResponse = Chat[];

type MessageRequest = Pick<Message, 'chatId' | 'text'>;

export const chatApi = api.injectEndpoints({
	endpoints: build => ({
		createChat: build.mutation<
			Chat,
			{
				members: string[];
			}
		>({
			query(body) {
				return {
					url: `/api/chats`,
					method: 'POST',
					body,
				};
			},
		}),
		getChats: build.query<ChatsResponse, void>({
			query: () => '/api/chats',
			providesTags: result =>
				result
					? [
							...result.map(({ id }) => ({ type: 'Chat', id } as const)),
							{ type: 'Chat', id: 'LIST' },
					  ]
					: [{ type: 'Chat', id: 'LIST' }],
		}),
		sendMessage: build.mutation<boolean, MessageRequest>({
			queryFn: (arg, { getState }) => {
				const socket = getSocket(getState);
				socket.emit(ChatEvent.SendMessage, arg);
				return { data: true };
			},
		}),
		getMessages: build.query<Message[], string>({
			query: chatId => `/api/chats/${chatId}`,
			async onCacheEntryAdded(
				chatId,
				{ updateCachedData, cacheDataLoaded, cacheEntryRemoved, getState }
			) {
				try {
					await cacheDataLoaded;

					const socket = getSocket(getState);

					socket.on('connect', () => {
						console.log('connected');
					});

					socket.on('connect_error', e => {
						console.log('connect_error', e);
					});

					socket.emit(ChatEvent.JoinChat, chatId);

					socket.on(ChatEvent.NewMessage, (message: Message) => {
						updateCachedData(draft => {
							draft.push(message);
						});
					});

					await cacheEntryRemoved;

					socket.off('connect');
					socket.off(ChatEvent.NewMessage);
					socket.off(ChatEvent.JoinedChat);
				} catch {
					// if cacheEntryRemoved resolved before cacheDataLoaded,
					// cacheDataLoaded throws
				}
			},
		}),
	}),
});

export const {
	useCreateChatMutation,
	useGetChatsQuery,
	useGetMessagesQuery,
	useSendMessageMutation,
} = chatApi;
