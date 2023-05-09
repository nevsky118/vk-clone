import { useAppSelector } from '@/redux/hooks';
import { useGetMessagesQuery } from '@/redux/services/chat';
import { selectActiveChat } from '@/redux/slices/chatSlice';
import { Center, Paper, Text, createStyles, rem } from '@mantine/core';
import { useEffect, useRef } from 'react';
import { HiOutlineChatBubbleLeftRight } from 'react-icons/hi2';
import MessageCard from './MessageCard';
import ChatInput from './ChatInput';
import ChatHeader from './ChatHeader';

const useStyles = createStyles(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		flexGrow: 1,
		minHeight: rem(750),
		maxHeight: rem(750),
	},

	messages: {
		position: 'relative',
		flexGrow: 1,
		overflowY: 'scroll',
	},

	empty: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		marginInline: 'auto',
		maxWidth: '100%',
		height: '100%',
		gap: theme.spacing.xs,
		color: theme.colors.gray[5],
	},
}));

const ChatView = () => {
	const { classes } = useStyles();
	const chatWindowRef = useRef<HTMLDivElement>(null);

	const activeChat = useAppSelector(selectActiveChat);

	const { data: messages, isLoading: isMessagesLoading } = useGetMessagesQuery(
		activeChat?.id as string,
		{ skip: !activeChat }
	);

	useEffect(() => {
		// скролл вниз при новом сообщении
		if (chatWindowRef.current) {
			chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
		}
	}, [messages]);

	return (
		<Paper className={classes.root} withBorder>
			{activeChat ? (
				<>
					<ChatHeader />
					<div ref={chatWindowRef} className={classes.messages}>
						{!isMessagesLoading && messages && messages.length > 0 ? (
							<ul>
								{messages.map(msg => (
									<MessageCard key={msg.id} message={msg} />
								))}
							</ul>
						) : (
							<Center w="100%" h="100%" mx="auto">
								<Text size="sm" color="dimmed">
									Пока нет сообщений
								</Text>
							</Center>
						)}
					</div>

					<ChatInput />
				</>
			) : (
				<div className={classes.empty}>
					<HiOutlineChatBubbleLeftRight size={48} />
					<Text size="sm">Выберите чат</Text>
				</div>
			)}
		</Paper>
	);
};

export default ChatView;
