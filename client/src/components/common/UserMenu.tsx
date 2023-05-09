import { useUser } from '@/hooks/use-user';
import { useAppDispatch } from '@/redux/hooks';
import { logOut } from '@/redux/slices/authSlice';
import {
	createStyles,
	Group,
	Menu,
	rem,
	Text,
	UnstyledButton,
} from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FiChevronDown, FiLogOut, FiSettings, FiUser } from 'react-icons/fi';
import Avatar from '../ui/Avatar';

const useStyles = createStyles(theme => ({
	menu: {
		color: theme.black,
		padding: `${rem(4)} ${rem(8)}`,
		borderRadius: theme.radius.sm,
		transition: 'background-color 100ms ease',
		'&:hover': {
			backgroundColor: theme.colors.gray[1],
		},

		[theme.fn.smallerThan('lg')]: {
			display: 'none',
		},
	},
	menuActive: {
		backgroundColor: theme.colors.gray[1],
	},
}));

const UserMenu = () => {
	const router = useRouter();
	const { classes, cx } = useStyles();
	const [userMenuOpened, setUserMenuOpened] = useState(false);

	const { user, isLoading } = useUser();

	const dispatch = useAppDispatch();

	const handleLogout = () => {
		dispatch(logOut());
		router.replace('/');
	};

	return (
		<Menu
			width={200}
			position="bottom-end"
			transitionProps={{ transition: 'pop-top-right' }}
			onClose={() => setUserMenuOpened(false)}
			onOpen={() => setUserMenuOpened(true)}
			withinPortal
		>
			<Menu.Target>
				<UnstyledButton
					className={cx(classes.menu, { [classes.menuActive]: userMenuOpened })}
				>
					<Group spacing={7}>
						<Avatar size="sm" src={user?.avatar} alt={user?.name} />
						<Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
							{user?.name}
						</Text>
						<FiChevronDown size={rem(12)} />
					</Group>
				</UnstyledButton>
			</Menu.Target>
			<Menu.Dropdown>
				<Menu.Item
					h={32}
					component={Link}
					href={`/${user?.id}`}
					icon={<FiUser />}
				>
					Профиль
				</Menu.Item>
				<Menu.Divider />
				<Menu.Item h={32} component={Link} href="/edit" icon={<FiSettings />}>
					Настройки
				</Menu.Item>
				<Menu.Item h={32} onClick={handleLogout} icon={<FiLogOut />}>
					Выйти
				</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	);
};

export default UserMenu;
