import { Burger, createStyles, rem } from '@mantine/core';
import { useState } from 'react';
import NavLink from './NavLink';
import Logo from '../ui/Logo';
import UserMenu from './UserMenu';
import { Navigation } from './Layout';
import { useUser } from '@/hooks/use-user';

const useStyles = createStyles((theme, { opened }: { opened: boolean }) => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		position: 'sticky',
		top: 0,
		zIndex: 50,

		width: '100%',
		background: theme.white,
		borderBottom: `${rem(1)} solid ${
			opened ? 'transparent' : theme.colors.gray[3]
		}`,
	},

	nav: {
		display: 'flex',
		height: rem(60),
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: theme.spacing.md,
	},

	menu: {
		display: 'flex',
		background: theme.white,
		flexDirection: 'column',
		gap: rem(4),
		paddingTop: 0,
		borderBottom: `${rem(1)} solid ${theme.colors.gray[3]}`,
	},

	hiddenDesktop: { [theme.fn.largerThan('lg')]: { display: 'none' } },
}));

const Header = ({ navigation }: { navigation: Navigation }) => {
	const [opened, setOpened] = useState(false);
	const { classes, cx } = useStyles({ opened });

	const { user, isLoading } = useUser();

	return (
		<header className={classes.root}>
			<nav className={classes.nav}>
				<Logo href="/feed" />
				<Burger
					className={classes.hiddenDesktop}
					opened={opened}
					onClick={() => setOpened(!opened)}
					aria-label="Menu"
				/>
				{!isLoading && user && <UserMenu />}
			</nav>

			{opened && (
				<div className={cx(classes.menu, classes.hiddenDesktop)}>
					{navigation.map(link => (
						<NavLink key={link.label} {...link} />
					))}
				</div>
			)}
		</header>
	);
};

export default Header;
