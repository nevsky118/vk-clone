import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Chat } from '../services/chat';

type ActiveChatState = {
	activeChat: Chat | null;
};

const initialState = {
	activeChat: null,
} as ActiveChatState;

const chatSlice = createSlice({
	name: 'chat',
	initialState,
	reducers: {
		setChat: (state, action: PayloadAction<Chat>) => {
			state.activeChat = action.payload;
		},
	},
});

export const { setChat } = chatSlice.actions;
export default chatSlice.reducer;

export const selectActiveChat = (state: RootState) => state.chat.activeChat;
