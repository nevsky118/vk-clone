import Layout from '@/components/common/Layout';
import Head from 'next/head';
import { ReactElement } from 'react';
import FriendsLayout from '@/components/friends/FriendsLayout';
import dynamic from 'next/dynamic';
const DynamicFriendsFind = dynamic(
	() => import('@/components/friends/FriendsFind'),
	{
		loading: () => <p>Loading...</p>,
	}
);

const FriendsFindPage = () => {
	return <DynamicFriendsFind />;
};

FriendsFindPage.getLayout = function getLayout(page: ReactElement) {
	return (
		<Layout>
			<Head>
				<title>Мои друзья – ABC</title>
			</Head>
			<FriendsLayout>{page}</FriendsLayout>
		</Layout>
	);
};

FriendsFindPage.auth = true;

export default FriendsFindPage;
