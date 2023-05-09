import Layout from '@/components/common/Layout';
import Head from 'next/head';
import { ReactElement } from 'react';
import FriendsLayout from '@/components/friends/FriendsLayout';
import dynamic from 'next/dynamic';
const DynamicFriendsRequests = dynamic(
	() => import('@/components/friends/FriendsRequests'),
	{
		loading: () => <p>Loading...</p>,
	}
);

const FriendsRequestsPage = () => {
	return <DynamicFriendsRequests />;
};

FriendsRequestsPage.getLayout = function getLayout(page: ReactElement) {
	return (
		<Layout>
			<Head>
				<title>Мои друзья – ABC</title>
			</Head>
			<FriendsLayout>{page}</FriendsLayout>
		</Layout>
	);
};

FriendsRequestsPage.auth = true;

export default FriendsRequestsPage;
