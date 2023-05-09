import Layout from '@/components/common/Layout';
import WallCard from '@/components/wall/WallCard';
import { ListResponse } from '@/redux/services/api';
import { useGetFeedQuery } from '@/redux/services/feed';
import { Post } from '@/redux/services/post';
import { Affix, Button, Transition, createStyles, rem } from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';
import Head from 'next/head';
import { ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { FiArrowUp } from 'react-icons/fi';
var debounce = require('lodash.debounce');

const useStyles = createStyles(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
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
	const [limit, setLimit] = useState(10);
	const { data: feed, isLoading } = useGetFeedQuery({ page: index, limit });

	useEffect(() => {
		if (feed) {
			callback(feed);
		}
	}, [feed]);

	if (isLoading) return <div>Loadingg</div>;

	if (!feed) return <div>No data</div>;

	if (!feed.docs.length) {
		return null;
	}

	return (
		<>
			{feed.docs.map(post => (
				<WallCard key={post.id} post={post} />
			))}
		</>
	);
};

const Feed = () => {
	const { classes } = useStyles();
	const [scroll, scrollTo] = useWindowScroll();

	const [page, setPage] = useState(1);
	const [hasNextPage, setHasNextPage] = useState(true);

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
		<>
			<div className={classes.root}>{pages}</div>

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

Feed.getLayout = function getLayout(page: ReactElement) {
	return (
		<Layout>
			<Head>
				<title>Новости – ABC</title>
			</Head>
			{page}
		</Layout>
	);
};

Feed.auth = true;

export default Feed;
