import { useUser } from '@/hooks/use-user';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useGetChatsQuery } from '@/redux/services/chat';
import { selectActiveChat, setChat } from '@/redux/slices/chatSlice';
import {
	Paper,
	Text,
	TextInput,
	UnstyledButton,
	createStyles,
	rem,
} from '@mantine/core';
import { FiSearch } from 'react-icons/fi';
import Avatar from '../ui/Avatar';
import { formatRelativeTime } from '@/lib/format-relative-time';

const useStyles = createStyles(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		flexShrink: 0,
		width: rem(350),
		borderRight: `${rem(1)} solid ${theme.colors.gray[3]}`,
		height: '100%',
		[theme.fn.smallerThan('md')]: {
			order: -1,
			width: '100%',
		},
	},

	header: {
		borderBottom: `${rem(1)} solid ${theme.colors.gray[3]}`,
	},

	chat: {
		display: 'flex',
		padding: theme.spacing.md,
		gap: theme.spacing.xs,
		cursor: 'pointer',
		'&:not(:last-of-type)': {
			borderBottom: `${rem(1)} solid ${theme.colors.gray[3]}`,
		},
		'&:hover': {
			backgroundColor: theme.fn.variant({
				variant: 'light',
				color: theme.primaryColor,
			}).background,
		},
	},

	chatActive: {
		backgroundColor: theme.fn.variant({
			variant: 'light',
			color: theme.primaryColor,
		}).background,
	},

	infoWrapper: {
		display: 'flex',
		flexDirection: 'column',
		overflow: 'hidden',
		textOverFlow: 'ellipsis',
		whiteSpace: 'nowrap',
		width: '100%',
	},

	info: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
}));

const ChatList = () => {
	const { classes, cx } = useStyles();

	const dispatch = useAppDispatch();
	const activeChat = useAppSelector(selectActiveChat);

	const { user, isLoading } = useUser();

	const { data: chats, isLoading: isChatsLoading } = useGetChatsQuery();

	return (
		<Paper className={classes.root} withBorder>
			<div className={classes.header}>
				<TextInput
					icon={<FiSearch />}
					placeholder="Поиск"
					variant="unstyled"
					disabled
				/>
			</div>
			<>
				{!isChatsLoading &&
					chats &&
					user &&
					chats.map(chat => {
						// собеседник
						const recipient = chat.members.filter(
							member => member.id !== user.id
						)[0];

						// TODO: fix type
						const sender = chat?.lastMessage?.sender as unknown as string;

						return (
							<UnstyledButton
								onClick={async () => dispatch(setChat(chat))}
								className={cx(classes.chat, {
									[classes.chatActive]: activeChat?.id === chat.id,
								})}
								key={chat.id}
							>
								<Avatar src={recipient?.avatar} />

								<div className={classes.infoWrapper}>
									<div className={classes.info}>
										<Text size="sm" fw={500}>
											{recipient?.name}
										</Text>

										{sender && (
											<Text size="xs" color="dimmed">
												{formatRelativeTime(chat.lastMessage.createdAt)}
											</Text>
										)}
									</div>
									{sender && (
										<Text size="xs" color="dimmed" truncate>
											{sender === user.id
												? `Вы: ${chat.lastMessage.text}`
												: chat.lastMessage.text}
										</Text>
									)}
								</div>
							</UnstyledButton>
						);
					})}
			</>
		</Paper>
	);
};

export default ChatList;
