import { useAppSelector } from '@/redux/hooks';
import { useSendMessageMutation } from '@/redux/services/chat';
import { selectActiveChat } from '@/redux/slices/chatSlice';
import { ActionIcon, Textarea, createStyles, rem } from '@mantine/core';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiSend } from 'react-icons/fi';

const useStyles = createStyles(theme => ({
	root: {
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing.xs,
		backgroundColor: theme.colors.gray[0],
		padding: theme.spacing.sm,
		borderTop: `${rem(1)} solid ${theme.colors.gray[3]} `,
	},
}));

interface FormsValues {
	text: string;
}

const ChatInput = () => {
	const { classes } = useStyles();

	const activeChat = useAppSelector(selectActiveChat);

	const [sendMessage, { isLoading, isSuccess }] = useSendMessageMutation();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
		reset,
	} = useForm<FormsValues>();

	const watchText = watch('text');

	const handleOnMessageSubmit = async (values: FormsValues) => {
		if (values.text && activeChat) {
			await sendMessage({ ...values, chatId: activeChat.id });
		}
	};

	// сброс формы после отправки сообщения
	useEffect(() => {
		reset();
	}, [isSuccess]);

	return (
		<form
			className={classes.root}
			onSubmit={handleSubmit(handleOnMessageSubmit)}
		>
			<Textarea
				placeholder="Напишите сообщение..."
				minRows={1}
				autosize
				size="sm"
				error={errors.text?.message}
				style={{ flex: 1 }}
				{...register('text', {
					maxLength: {
						value: 500,
						message: 'Максимальное кол-во символов - 500',
					},
				})}
			/>
			{watchText && (
				<ActionIcon type="submit" size="lg" variant="transparent">
					<FiSend size="1.625rem" />
				</ActionIcon>
			)}
		</form>
	);
};

export default ChatInput;
