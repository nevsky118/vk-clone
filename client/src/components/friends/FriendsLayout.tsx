import { ReactNode } from 'react';
import { Paper, createStyles } from '@mantine/core';
import FriendsSidebar from './FriendsSidebar';

const useStyles = createStyles(theme => ({
	root: {
		display: 'flex',
		gap: theme.spacing.md,
		[theme.fn.smallerThan('md')]: {
			flexDirection: 'column',
		},
	},

	grid: {
		display: 'flex',
		flexDirection: 'column',
		flexGrow: 1,
		gap: theme.spacing.md,
		height: 'fit-content',
	},
}));

const FriendsLayout = ({ children }: { children: ReactNode }) => {
	const { classes } = useStyles();

	return (
		<div className={classes.root}>
			<Paper className={classes.grid} p="md" withBorder>
				{children}
			</Paper>
			<FriendsSidebar />
		</div>
	);
};

export default FriendsLayout;
