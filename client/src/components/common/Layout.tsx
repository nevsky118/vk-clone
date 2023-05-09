import { ReactNode } from 'react';
import { createStyles, rem } from '@mantine/core';
import Sidebar from './Sidebar';
import Header from './Header';
import { FiMessageSquare, FiUser, FiLayout, FiUsers } from 'react-icons/fi';
import { useUser } from '@/hooks/use-user';
import { IconType } from 'react-icons';

const useStyles = createStyles(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		minHeight: '100vh',
		background: theme.colors.gray[0],
	},
	wrapper: {
		display: 'flex',
		flex: 1,
		[theme.fn.smallerThan('lg')]: {
			flexDirection: 'column',
			paddingLeft: 0,
		},
	},
	main: {
		position: 'relative',
		padding: `${theme.spacing.md} ${rem(32)}`,
		flex: 1,
		maxWidth: rem(1440),
		margin: '0 auto',
		[theme.fn.smallerThan('lg')]: {
			maxWidth: '100%',
			margin: '0',
			padding: theme.spacing.md,
		},
	},
}));

export type Navigation = {
	icon: IconType;
	label: string;
	href: string;
}[];

const Layout = ({ children }: { children: ReactNode }) => {
	const { classes } = useStyles();
	const { user, isLoading } = useUser();

	const navigation: Navigation = [
		{ icon: FiUser, label: 'Моя страница', href: `/${user?.id}` },
		{ icon: FiLayout, label: 'Новости', href: '/feed' },
		{ icon: FiMessageSquare, label: 'Мессенджер', href: '/im' },
		{ icon: FiUsers, label: 'Друзья', href: '/friends' },
	];

	return (
		<div className={classes.root}>
			<Header navigation={navigation} />
			<div className={classes.wrapper}>
				{!isLoading && user && <Sidebar navigation={navigation} />}
				<main className={classes.main}>{children}</main>
			</div>
		</div>
	);
};

export default Layout;
