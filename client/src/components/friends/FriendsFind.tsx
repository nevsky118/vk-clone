import { useGetFriendsFindListQuery } from '@/redux/services/friends';
import {
	ActionIcon,
	Pagination,
	Text,
	TextInput,
	createStyles,
	rem,
} from '@mantine/core';
import { useState } from 'react';
import { FiSearch, FiUserPlus } from 'react-icons/fi';
import Link from 'next/link';
var debounce = require('lodash.debounce');

const useStyles = createStyles(theme => ({
	root: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},

	friends: {
		display: 'grid',
		gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
		gap: theme.spacing.md,
		[theme.fn.smallerThan('lg')]: {
			gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
		},
		[theme.fn.smallerThan('sm')]: {
			gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
		},
	},

	friend: {
		display: 'flex',
		flexDirection: 'column',
		gridColumn: 'span 1 / span 1',
	},

	friendInfo: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginTop: rem(4),
	},

	friendName: {
		fontWeight: 500,
		'&:hover': {
			textDecoration: 'underline',
		},
	},

	friendAvatar: {
		height: rem(160),
		width: '100%',
		objectFit: 'cover',
	},

	pagination: {
		alignSelf: 'flex-end',
	},
}));

const FriendsFind = () => {
	const { classes } = useStyles();

	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(12);
	const [q, setQ] = useState('');

	const { data: users, isLoading: isFriendsLoading } =
		useGetFriendsFindListQuery({
			page,
			limit,
			...(q && { q }),
		});

	const debouncedSetSearch = debounce((value: string) => {
		setPage(1);
		setQ(value);
	}, 500);

	return (
		<>
			<div className={classes.root}>
				<Text size="sm" fw={500}>
					Поиск друзей
				</Text>
			</div>

			<TextInput
				size="xs"
				placeholder="Введите запрос"
				icon={<FiSearch />}
				onChange={e => debouncedSetSearch(e.target.value)}
			/>

			{!isFriendsLoading && users && users.docs.length > 0 && (
				<div className={classes.friends}>
					{users.docs.map(user => (
						<div key={user.id} className={classes.friend}>
							<Link href={`/${user.id}`}>
								<img
									src={user?.avatar ? user.avatar : '/camera_empty.png'}
									className={classes.friendAvatar}
								/>
							</Link>
							<div className={classes.friendInfo}>
								<Text
									component={Link}
									href={`/${user.id}`}
									className={classes.friendName}
									size="sm"
								>
									{user.name}
								</Text>
								<ActionIcon variant="subtle" color="blue" ml="xs" disabled>
									<FiUserPlus />
								</ActionIcon>
							</div>
						</div>
					))}
				</div>
			)}

			<Pagination
				className={classes.pagination}
				value={users?.page}
				onChange={setPage}
				total={users?.totalPages ?? 0}
				disabled={isFriendsLoading || !users}
			/>
		</>
	);
};

export default FriendsFind;
