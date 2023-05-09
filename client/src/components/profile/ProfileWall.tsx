import { Paper, Text, createStyles } from '@mantine/core';

import { useEffect, useState } from 'react';
import { Post, useGetPostsQuery } from '@/redux/services/post';
import { useRouter } from 'next/router';
import WallCardAdd from '../wall/WallCardAdd';
import { useUser } from '@/hooks/use-user';
import WallCard from '../wall/WallCard';
import { ListResponse } from '@/redux/services/api';
var debounce = require('lodash.debounce');

const useStyles = createStyles(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		flexGrow: 1,
		gap: theme.spacing.md,
	},
}));

const Page = ({
	index,
	callback,
}: {
	index: number;
	callback: (data: ListResponse<Post>) => void;
}) => {
	const router = useRouter();
	const [limit, setLimit] = useState(4);
	const { data: posts, isLoading } = useGetPostsQuery(
		{
			page: index,
			limit,
			author: router.query.id as string,
		},
		{ skip: !router.isReady }
	);

	useEffect(() => {
		if (posts) {
			callback(posts);
		}
	}, [posts]);

	if (isLoading) return <div>Loadingg</div>;

	if (!posts) return <div>No data</div>;

	if (!posts.docs.length) {
		if (index === 1) {
			return (
				<Paper p="md" withBorder>
					<Text size="sm" color="dimmed">
						На стене пока нет ни одной записи
					</Text>
				</Paper>
			);
		}

		return null;
	}

	return (
		<>
			{posts.docs.map(post => (
				<WallCard key={post.id} post={post} />
			))}
		</>
	);
};

const ProfileWall = () => {
	const router = useRouter();
	const { classes } = useStyles();
	const [page, setPage] = useState(1);
	const [hasNextPage, setHasNextPage] = useState(true);

	const { user, isLoading } = useUser();

	const pages = [];
	for (let i = 1; i <= page; i++) {
		pages.push(
			<Page
				index={i}
				callback={data => setHasNextPage(data.hasNextPage)}
				key={i}
			/>
		);
	}

	const handleScroll = debounce(() => {
		const scrollOffset = 100;
		const scrolledToBottom =
			window.innerHeight + window.scrollY >=
			document.body.offsetHeight - scrollOffset;
		if (scrolledToBottom && hasNextPage) {
			setPage(prevPage => prevPage + 1);
		}
	}, 200);

	useEffect(() => {
		document.addEventListener('scroll', handleScroll);
		return () => {
			document.removeEventListener('scroll', handleScroll);
		};
	}, [handleScroll]);

	return (
		<div className={classes.root}>
			{!isLoading && user && user.id === (router.query.id as string) && (
				<WallCardAdd />
			)}

			{pages}
		</div>
	);
};

export default ProfileWall;
