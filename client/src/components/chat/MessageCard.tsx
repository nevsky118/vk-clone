import { Message } from '@/redux/services/chat';
import Avatar from '@/components/ui/Avatar';
import { formatDate } from '@/lib/format-date';
import { Text, createStyles, rem } from '@mantine/core';

const useStyles = createStyles(theme => ({
	wrapper: {
		display: 'flex',
		gap: theme.spacing.xs,
		padding: theme.spacing.xs,
		marginBottom: rem(4),
	},

	info: { wordBreak: 'break-all' },
}));

interface MessageCardProps {
	message: Message;
}

const MessageCard = ({ message }: MessageCardProps) => {
	const { classes } = useStyles();

	return (
		<li className={classes.wrapper} key={message.id}>
			<Avatar src={message.sender?.avatar} />
			<div className={classes.info}>
				<Text size="sm">
					{message.sender.name}
					<Text size="sm" span ml={4} color="dimmed">
						{formatDate(message.createdAt)}
					</Text>
				</Text>
				<Text size="sm">{message.text}</Text>
			</div>
		</li>
	);
};

export default MessageCard;
