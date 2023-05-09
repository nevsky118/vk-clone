import { Paper, Text, createStyles, rem } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';

const useStyles = createStyles(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		gap: theme.spacing.md,
		width: rem(350),
		[theme.fn.smallerThan('md')]: {
			order: -1,
			width: '100%',
		},
	},

	links: {
		display: 'flex',
		flexDirection: 'column',
	},
	link: {
		paddingInline: theme.spacing.sm,
		paddingTop: rem(4),
		paddingBottom: rem(4),
		borderRadius: rem(8),
		color: theme.black,
		'&:hover': {
			backgroundColor: theme.colors.gray[1],
		},
	},
	linkActive: {
		backgroundColor: theme.colors.gray[1],
	},
}));

const navigation = [
	{
		label: 'Мои друзья',
		href: '/friends',
	},
	{
		label: 'Заявки в друзья',
		href: '/friends/requests',
	},
	{
		label: 'Поиск друзей',
		href: '/friends/find',
	},
];

const FriendsSidebar = () => {
	const { classes, cx } = useStyles();
	const router = useRouter();

	return (
		<div className={classes.root}>
			<Paper className={classes.links} p="md" withBorder>
				{navigation.map(nav => (
					<Link
						key={nav.href}
						href={nav.href}
						className={cx(classes.link, {
							[classes.linkActive]: nav.href === router.pathname,
						})}
					>
						<Text size="sm">{nav.label}</Text>
					</Link>
				))}
			</Paper>
		</div>
	);
};

export default FriendsSidebar;
