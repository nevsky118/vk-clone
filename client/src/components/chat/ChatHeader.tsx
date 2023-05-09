import { Text, createStyles, rem } from '@mantine/core';
import Avatar from '../ui/Avatar';
import { useAppSelector } from '@/redux/hooks';
import { selectActiveChat } from '@/redux/slices/chatSlice';
import { useUser } from '@/hooks/use-user';
import Link from 'next/link';

const useStyles = createStyles(theme => ({
	root: {
		display: 'flex',
		justifyContent: 'space-between',
		padding: theme.spacing.sm,
		alignItems: 'center',
		borderBottom: `${rem(1)} solid ${theme.colors.gray[3]} `,
	},
}));

const ChatHeader = () => {
	const { classes } = useStyles();
	const activeChat = useAppSelector(selectActiveChat);

	const { user, isLoading } = useUser();

	if (isLoading) return null;

	const renderedChatRecipient = () => {
		if (user && activeChat) {
			// собеседник (fix)
			const recipient = activeChat.members.filter(
				member => member.id !== user.id
			)[0];

			return (
				<>
					<Text component={Link} href={`/${recipient.id}`} size="sm" fw={500}>
						{recipient.name}
					</Text>
					<Link href={`/${recipient.id}`}>
						<Avatar src={recipient?.avatar} size="sm" />
					</Link>
				</>
			);
		} else {
			return null;
		}
	};

	return <div className={classes.root}>{renderedChatRecipient()}</div>;
};

export default ChatHeader;
