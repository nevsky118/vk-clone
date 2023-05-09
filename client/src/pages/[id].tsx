import Layout from '@/components/common/Layout';
import { createStyles } from '@mantine/core';
import { ReactElement } from 'react';
import { useWindowScroll } from '@mantine/hooks';
import { Affix, Button, Transition, rem } from '@mantine/core';
import dynamic from 'next/dynamic';
import { FiArrowUp } from 'react-icons/fi';
const DynamicProfileInfo = dynamic(
	() => import('@/components/profile/ProfileInfo')
);
const DynamicProfileWall = dynamic(
	() => import('@/components/profile/ProfileWall')
);
const DynamicProfileSidebar = dynamic(
	() => import('@/components/profile/ProfileSidebar')
);

const useStyles = createStyles(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		gap: theme.spacing.md,
	},

	split: {
		display: 'flex',
		gap: theme.spacing.md,
		[theme.fn.smallerThan('md')]: {
			flexDirection: 'column',
		},
	},

	wall: {
		display: 'flex',
		flexDirection: 'column',
		flexGrow: 1,
		gap: theme.spacing.md,
	},
}));

const Profile = () => {
	const { classes } = useStyles();
	const [scroll, scrollTo] = useWindowScroll();

	return (
		<>
			<div className={classes.root}>
				<DynamicProfileInfo />
				<div className={classes.split}>
					<DynamicProfileWall />
					<DynamicProfileSidebar />
				</div>
			</div>
			<Affix position={{ bottom: rem(20), left: rem(20) }}>
				<Transition transition="slide-up" mounted={scroll.y > 0}>
					{transitionStyles => (
						<Button
							leftIcon={<FiArrowUp size="1rem" />}
							style={transitionStyles}
							onClick={() => scrollTo({ y: 0 })}
						>
							Наверх
						</Button>
					)}
				</Transition>
			</Affix>
		</>
	);
};

Profile.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

// Profile.auth = true;

export default Profile;
