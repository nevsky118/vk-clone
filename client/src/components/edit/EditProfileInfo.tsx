import { useUser } from '@/hooks/use-user';
import { User, useUpdateUserMutation } from '@/redux/services/user';
import {
	Button,
	Paper,
	Text,
	TextInput,
	Textarea,
	createStyles,
	rem,
} from '@mantine/core';
import { useForm } from 'react-hook-form';
import { FiCheckCircle } from 'react-icons/fi';

const useStyles = createStyles(theme => ({
	form: {
		display: 'flex',
		flexDirection: 'column',
		gap: theme.spacing.md,
	},

	notification: {
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing.xs,
		backgroundColor: theme.colors.green[0],
	},

	icon: { flex: 'none' },

	grid: {
		display: 'grid',
		gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
		gap: theme.spacing.md,
		[theme.fn.smallerThan('md')]: {
			gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
		},
	},

	about: {
		gridColumn: '1 / span 2',
		[theme.fn.smallerThan('md')]: {
			gridColumn: '1 / span 1',
		},
	},

	save: {
		width: 'fit-content',
		alignSelf: 'flex-end',
	},
}));

type FormValues = Omit<User, 'id' | 'email' | 'avatar' | 'liked' | 'friends'>;

const EditProfileInfo = () => {
	const { classes } = useStyles();
	const { user, isLoading } = useUser();

	const [updateUser, { isLoading: isUpdatingUser, isSuccess, isError }] =
		useUpdateUserMutation();

	const {
		register,
		handleSubmit,
		formState: { isDirty, isValid, errors },
		reset,
	} = useForm<FormValues>({
		defaultValues: {
			name: user?.name,
			age: user?.age,
			university: user?.university || '',
			city: user?.city || '',
			about: user?.about || '',
		},
		mode: 'onChange',
	});

	const handleUserUpdate = async (values: FormValues) => {
		// @ts-ignore
		const { data } = await updateUser(values);

		reset(data);
	};

	return (
		<Paper
			component="form"
			onSubmit={handleSubmit(handleUserUpdate)}
			className={classes.form}
			p="md"
			withBorder
		>
			{isSuccess && (
				<Paper className={classes.notification} withBorder p="xs">
					<FiCheckCircle className={classes.icon} size={24} color="teal" />
					<div>
						<Text size="sm" fw={500}>
							Изменения сохранены
						</Text>
						<Text c="dimmed" size="xs">
							Новые данные будут отражены на вашей странице.
						</Text>
					</div>
				</Paper>
			)}

			<div className={classes.grid}>
				<TextInput
					error={errors.name?.message}
					label="Имя"
					{...register('name', { required: 'Имя не может быть пустым' })}
				/>

				<TextInput
					error={errors.age?.message}
					label="Возраст"
					type="number"
					{...register('age', {
						min: {
							value: 14,
							message: 'Минимальный возраст - 14 лет',
						},
						max: {
							value: 100,
							message: 'Максимальный возраст - 100 лет',
						},
						maxLength: 3,
						valueAsNumber: true,
					})}
				/>

				<TextInput
					error={errors.university?.message}
					label="Университет"
					{...register('university')}
				/>
				<TextInput
					error={errors.city?.message}
					label="Родной город"
					{...register('city')}
				/>

				<Textarea
					label="Краткая информация"
					placeholder="Расскажите о себе"
					className={classes.about}
					error={errors.about?.message}
					{...register('about')}
				/>
			</div>
			<Button
				type="submit"
				className={classes.save}
				color={isError ? 'red' : 'default'}
				disabled={!isDirty || !isValid}
				loading={isUpdatingUser}
			>
				Сохранить
			</Button>
		</Paper>
	);
};

export default EditProfileInfo;
