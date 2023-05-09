import { io, Socket } from 'socket.io-client';
import { RootState } from './store';

let socket: Socket;

export const getSocket = (getState: () => any): Socket => {
	const { accessToken } = (getState() as RootState).auth;

	if (!socket) {
		socket = io(process.env.NEXT_PUBLIC_SERVER_URL as string, {
			extraHeaders: {
				...(accessToken && { Authorization: `Bearer ${accessToken}` }),
			},
		});
	}
	return socket;
};
