import { useGetFriendsByUserQuery } from '@/redux/services/friends';
import { Paper, Text, createStyles, rem } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Avatar from '../ui/Avatar';
import { useUser } from '@/hooks/use-user';
import { HiOutlineExternalLink } from 'react-icons/hi';

const useStyles = createStyles(theme => ({
	root: {
		width: rem(350),
		height: 'fit-content',
		[theme.fn.smallerThan('md')]: {
			order: -1,
			width: '100%',
		},
	},

	friends: {
		display: 'flex',
	},

	friend: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		width: rem(80),
		borderRadius: rem(4),
		padding: rem(4),
		cursor: 'pointer',
		'&:hover': {
			backgroundColor: theme.colors.gray[0],
		},
	},

	empty: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		gap: theme.spacing.md,
	},

	link: {
		display: 'flex',
		alignItems: 'center',
		color: theme.primaryColor,
		'&:hover': {
			textDecoration: 'underline',
		},
	},
}));

const ProfileSidebar = () => {
	const { classes } = useStyles();
	const router = useRouter();

	const { user, isLoading } = useUser();

	const { data: friends, isLoading: isFriendsLoading } =
		useGetFriendsByUserQuery(
			{ page: 1, limit: 4, userId: router.query.id as string },
			{ skip: !router.isReady }
		);

	return (
		<Paper p="md" className={classes.root} withBorder>
			{!isFriendsLoading &&
				friends &&
				(friends.docs.length > 0 ? (
					<>
						<Text mb="xs" size="sm" fw={500}>
							Друзья
							<Text ml={4} span color="dimmed">
								{friends.totalDocs}
							</Text>
						</Text>
						<div className={classes.friends}>
							{friends.docs.map(friend => (
								<a
									key={friend.id}
									className={classes.friend}
									href={`/${friend.id}`}
								>
									<Avatar src={friend?.avatar} w={64} h={64} />
									<Text size="sm" color="dark">
										{friend.name}
									</Text>
								</a>
							))}
						</div>
					</>
				) : (
					<div className={classes.empty}>
						<Text size="sm" color="dimmed">
							Друзей нет
						</Text>
						{!isLoading && user && user.id === router.query.id && (
							<Text
								component={Link}
								href="/friends/find"
								className={classes.link}
								size="sm"
							>
								Найти друга <HiOutlineExternalLink />
							</Text>
						)}
					</div>
				))}
		</Paper>
	);
};

export default ProfileSidebar;
