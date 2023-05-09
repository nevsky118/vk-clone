import { useGetFriendsListQuery } from '@/redux/services/friends';
import { Button, Text, TextInput, createStyles } from '@mantine/core';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import FriendCard from './FriendCard';
import Link from 'next/link';
var debounce = require('lodash.debounce');

const useStyles = createStyles(theme => ({
	root: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},

	list: {
		display: 'flex',
		flexDirection: 'column',
		gap: theme.spacing.xs,
		'&:not(:last-of-type)': {
			borderBottom: `1px solid ${theme.colors.gray[3]}`,
			paddingBottom: theme.spacing.xs,
		},
	},

	controls: {
		display: 'flex',
		gap: theme.spacing.md,
	},
}));

const FriendsList = () => {
	const { classes } = useStyles();

	const [page, setPage] = useState(1);

	const { data: friends, isLoading: isFriendsLoading } = useGetFriendsListQuery(
		{
			page,
			limit: 10,
		}
	);

	return (
		<>
			<div className={classes.root}>
				<Text size="sm" fw={500}>
					Все друзья
					{!isFriendsLoading && friends && friends.totalDocs > 0 && (
						<Text ml={4} span color="dimmed">
							{friends.totalDocs}
						</Text>
					)}
				</Text>
				<Button component={Link} href="/friends/find" size="xs">
					Найти друзей
				</Button>
			</div>

			<TextInput
				size="xs"
				placeholder="Поиск друзей"
				icon={<FiSearch />}
				disabled
			/>

			{!isFriendsLoading && friends && (
				<>
					{friends.totalDocs > 0 ? (
						<div className={classes.list}>
							{friends.docs.map(doc => (
								<FriendCard
									key={doc.id}
									friend={doc}
									friendRequestId={doc.friendShipId}
									withActionsMenu
								/>
							))}
						</div>
					) : (
						<Text size="sm" color="dimmed">
							У вас пока нет друзей
						</Text>
					)}
				</>
			)}
		</>
	);
};

export default FriendsList;
