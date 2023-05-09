import {
	ActionIcon,
	Button,
	Card,
	FileButton,
	FocusTrap,
	Text,
	Textarea,
	UnstyledButton,
	createStyles,
	rem,
} from '@mantine/core';
import { FiPaperclip } from 'react-icons/fi';
import { useState } from 'react';
import { useAddPostMutation } from '@/redux/services/post';
import { useForm } from 'react-hook-form';
import { useUser } from '@/hooks/use-user';
import Avatar from '../ui/Avatar';
import { useClickOutside } from '@mantine/hooks';

const useStyles = createStyles(theme => ({
	input: {
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing.sm,
		backgroundColor: theme.white,
		border: `1px solid ${theme.colors.gray[3]}`,
		borderRadius: rem(4),
		gap: theme.spacing.xs,
		cursor: 'text',
	},

	wrapper: {
		display: 'flex',
		flexDirection: 'column',
		gap: theme.spacing.xs,
	},

	content: {
		borderBottom: `${rem(1)} solid ${theme.colors.gray[3]}`,
		padding: theme.spacing.sm,
	},

	inputActive: {
		display: 'flex',
		gap: theme.spacing.xs,
	},

	fileButtonWrapper: {
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing.sm,
	},

	postFooter: {
		display: 'flex',
		justifyContent: 'space-between',
		gap: theme.spacing.xs,
	},
}));

interface FormValues {
	content?: string;
	photo?: File | null;
}

const WallCardAdd = () => {
	const { classes, cx } = useStyles();

	const { user, isLoading } = useUser();

	const [opened, setOpened] = useState(false);
	const ref = useClickOutside(() => setOpened(false));

	const [addPost, { isLoading: isAddingPost, isError }] = useAddPostMutation();

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		setError,
		formState: { errors },
		reset,
	} = useForm<FormValues>();

	const watchPhoto = watch('photo');

	const handlePostSubmit = async (values: FormValues) => {
		if (!values.content && !values.photo) {
			setError('root', { message: 'Добавьте текст или фотографию' });
		} else {
			const formData = new FormData();
			if (values.content) {
				formData.append('content', values.content);
			}

			if (values.photo) {
				formData.append('photo', values.photo);
			}

			await addPost(formData);

			reset();
		}
	};

	return (
		<Card
			component="form"
			className={cx(classes.wrapper)}
			p="md"
			onSubmit={handleSubmit(handlePostSubmit)}
			withBorder
			ref={ref}
		>
			<Card.Section className={classes.content}>
				<div className={classes.inputActive}>
					<Avatar size="sm" src={user?.avatar} />

					<Textarea
						size="sm"
						style={{ width: '100%' }}
						styles={{ input: { padding: '0 !important' } }}
						variant="unstyled"
						placeholder="Что у вас нового?"
						{...register('content', {
							minLength: 0,
							maxLength: {
								value: 500,
								message: 'Максимальное кол-во символов - 500',
							},
						})}
						autosize
						onFocusCapture={() => setOpened(true)}
						error={errors.content?.message}
					/>
				</div>
			</Card.Section>

			{opened && (
				<div className={classes.postFooter}>
					<div className={classes.fileButtonWrapper}>
						<FileButton
							onChange={v => setValue('photo', v)}
							accept="image/png,image/jpeg"
						>
							{props => (
								<ActionIcon {...props} variant="light" color="blue" size={30}>
									<FiPaperclip />
								</ActionIcon>
							)}
						</FileButton>
						{watchPhoto && (
							<Text size="sm" color="dimmed" maw={150} truncate>
								{watchPhoto.name}
							</Text>
						)}
						{errors.root?.message && !watchPhoto && (
							<Text size="xs" color="red">
								{errors.root.message}
							</Text>
						)}
					</div>

					<Button type="submit" size="xs" loading={isAddingPost}>
						Опубликовать
					</Button>
				</div>
			)}
		</Card>
	);
};

export default WallCardAdd;
