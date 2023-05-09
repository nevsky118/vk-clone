import Layout from '@/components/common/Layout';
import { Alert, createStyles, rem } from '@mantine/core';
import Head from 'next/head';
import { ReactElement } from 'react';
import dynamic from 'next/dynamic';
const DynamicChatList = dynamic(() => import('@/components/chat/ChatList'));
const DynamicChatView = dynamic(() => import('@/components/chat/ChatView'));

const useStyles = createStyles(theme => ({
	root: {
		position: 'relative',
		height: '100%',
		borderRadius: rem(4),
	},

	split: {
		display: 'flex',
		gap: theme.spacing.md,
		[theme.fn.smallerThan('md')]: {
			flexDirection: 'column',
		},
	},
}));

const Im = () => {
	const { classes } = useStyles();

	return (
		<div className={classes.root}>
			<Alert mb="md" title="Баг 😀">
				Когда переключаешься между несколькими чата, а потом в одном отправляешь
				сообщение - получаешь его в каждом чате (только в виде кэша)
			</Alert>
			<div className={classes.split}>
				<DynamicChatList />
				<DynamicChatView />
			</div>
		</div>
	);
};

Im.getLayout = function getLayout(page: ReactElement) {
	return (
		<Layout>
			<Head>
				<title>Мессенджер – ABC</title>
			</Head>
			{page}
		</Layout>
	);
};

Im.auth = true;

export default Im;
