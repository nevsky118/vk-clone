import { rem, createStyles } from '@mantine/core';
import NavLink from './NavLink';
import { Navigation } from './Layout';

const useStyles = createStyles(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		width: '280px',
		flex: 'none',
		background: theme.white,
		padding: theme.spacing.md,
		borderRight: `${rem(1)} solid ${theme.colors.gray[3]}`,
	},

	links: {
		display: 'flex',
		flexDirection: 'column',
	},

	hiddenMobile: { [theme.fn.smallerThan('lg')]: { display: 'none' } },
}));

const Sidebar = ({ navigation }: { navigation: Navigation }) => {
	const { classes, cx } = useStyles();

	return (
		<aside className={cx(classes.root, classes.hiddenMobile)}>
			<div className={classes.links}>
				{navigation.map(link => (
					<NavLink key={link.label} {...link} />
				))}
			</div>
		</aside>
	);
};

export default Sidebar;
