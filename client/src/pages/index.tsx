import {
	TextInput,
	PasswordInput,
	Paper,
	Group,
	Button,
	Stack,
	createStyles,
	rem,
	Title,
	Anchor,
} from '@mantine/core';
import { useLoginMutation, useRegisterMutation } from '@/redux/services/auth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';
import { useToggle } from '@mantine/hooks';
import { FiAlertCircle } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { useAppSelector } from '@/redux/hooks';
import { selectIsAuthenticated } from '@/redux/slices/authSlice';

const useStyles = createStyles(theme => ({
	root: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: '100vh',
	},
	inner: {
		maxWidth: rem(420),
		width: '100%',
		marginLeft: 'auto',
		marginRight: 'auto',
	},
}));

interface FormValues {
	name: string;
	email: string;
	password: string;
}

const Home = () => {
	const { classes } = useStyles();
	const router = useRouter();
	const [type, toggle] = useToggle(['login', 'register']);

	const [login, { isLoading: isLoggingIn, isError: isLoginError }] =
		useLoginMutation();
	const [signUp, { isLoading: isRegistering, isError: isRegisterError }] =
		useRegisterMutation();

	const isAuthenticated = useAppSelector(selectIsAuthenticated);

	const { register, handleSubmit } = useForm<FormValues>({
		defaultValues: {
			name: '',
			email: '',
			password: '',
		},
	});

	const handleOnSubmit = async (values: FormValues) => {
		if (type === 'register') {
			// @ts-ignore
			const { data } = await signUp(values);
			await login(values);
			router.replace(`/${data.id}`);
		} else {
			await login(values);
			router.replace('/feed');
		}
	};

	useEffect(() => {
		if (isAuthenticated) {
			router.replace('/feed');
		}
	}, []);

	if (isAuthenticated) return null;

	return (
		<>
			<Head>
				<title>ABC-платформа</title>
			</Head>
			<div className={classes.root}>
				<Paper p="md" withBorder className={classes.inner} shadow="sm">
					<Title order={2} align="center" mb="xl">
						{type === 'register' ? 'Регистрация' : 'Вход в аккаунт'}
					</Title>

					<form onSubmit={handleSubmit(handleOnSubmit)}>
						<Stack>
							{type === 'register' && (
								<TextInput
									required
									label="Имя"
									placeholder="Иван"
									{...register('name')}
								/>
							)}

							<TextInput
								required
								label="Электронная почта"
								placeholder="test@test.com"
								{...register('email')}
							/>
							<PasswordInput
								required
								label="Пароль"
								placeholder="••••••"
								{...register('password')}
							/>
						</Stack>

						<Group position="apart" mt="xl">
							<Anchor
								component="button"
								type="button"
								color="dimmed"
								onClick={() => toggle()}
								size="xs"
							>
								{type === 'register'
									? 'Уже есть аккаунт? Войти'
									: 'Нет аккаунт? Зарегистрироваться'}
							</Anchor>

							{type === 'register' ? (
								<Button
									type="submit"
									color={!isRegisterError ? 'default' : 'red'}
									leftIcon={!isRegisterError ? null : <FiAlertCircle />}
									loading={isRegistering}
								>
									Создать аккаунт
								</Button>
							) : (
								<Button
									type="submit"
									color={!isLoginError ? 'default' : 'red'}
									leftIcon={!isLoginError ? null : <FiAlertCircle />}
									loading={isLoggingIn}
								>
									Войти
								</Button>
							)}
						</Group>
					</form>
				</Paper>
			</div>
		</>
	);
};

export default Home;
