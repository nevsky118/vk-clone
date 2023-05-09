import Layout from '@/components/common/Layout';
import Head from 'next/head';
import { ReactElement } from 'react';
import FriendsLayout from '@/components/friends/FriendsLayout';
import dynamic from 'next/dynamic';
const DynamicFriendsList = dynamic(
	() => import('@/components/friends/FriendsList'),
	{
		loading: () => <p>Loading...</p>,
	}
);

const FriendsPage = () => {
	return <DynamicFriendsList />;
};

FriendsPage.getLayout = function getLayout(page: ReactElement) {
	return (
		<Layout>
			<Head>
				<title>Мои друзья – ABC</title>
			</Head>
			<FriendsLayout>{page}</FriendsLayout>
		</Layout>
	);
};

FriendsPage.auth = true;

export default FriendsPage;
