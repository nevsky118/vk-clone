import { Button, Text, UnstyledButton, createStyles, rem } from '@mantine/core';
import { useState } from 'react';
import {
	useAcceptFriendRequestMutation,
	useGetIncomingFriendsQuery,
	useGetOutgoingFriendsQuery,
	useRejectFriendRequestMutation,
} from '@/redux/services/friends';
import FriendCard from './FriendCard';

const useStyles = createStyles(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		gap: theme.spacing.md,
	},

	requests: {
		display: 'flex',
		flexDirection: 'column',
		'&:not(:last-of-type)': {
			borderBottom: `1px solid ${theme.colors.gray[3]}`,
			paddingBottom: theme.spacing.xs,
		},
	},

	controls: {
		display: 'flex',
		gap: theme.spacing.md,
	},

	tabs: {
		display: 'flex',
		gap: theme.spacing.xs,
	},

	tab: {
		paddingInline: rem(8),
		paddingTop: rem(4),
		paddingBottom: rem(4),
		borderRadius: rem(8),
		border: `1px solid ${theme.colors.gray[3]}`,
		cursor: 'pointer',
		'&:hover': {
			backgroundColor: theme.colors.gray[1],
		},
	},

	tabActive: {
		backgroundColor: theme.colors.gray[1],
	},
}));

const IncomingRequests = () => {
	const { classes } = useStyles();

	const [accept, { isLoading: isAccepting }] = useAcceptFriendRequestMutation();
	const [reject, { isLoading: isRejecting }] = useRejectFriendRequestMutation();

	const { data: requests, isLoading: isRequestsLoading } =
		useGetIncomingFriendsQuery();

	const handleAcceptRequest = async (id: string) => {
		await accept(id);
	};

	const handleRejectRequest = async (id: string) => {
		await reject(id);
	};

	return (
		<>
			{!isRequestsLoading && requests && (
				<>
					{requests.length > 0 ? (
						<div className={classes.requests}>
							{requests.map(request => (
								<FriendCard
									key={request.id}
									friend={request.from}
									friendRequestId={request.id}
								>
									<div className={classes.controls}>
										<Button
											size="xs"
											onClick={() => handleAcceptRequest(request.id)}
											loading={isAccepting}
											compact
										>
											Принять заявку
										</Button>
										<Button
											variant="subtle"
											onClick={() => handleRejectRequest(request.id)}
											size="xs"
											loading={isRejecting}
											compact
										>
											Удалить подписчика
										</Button>
									</div>
								</FriendCard>
							))}
						</div>
					) : (
						<Text size="sm" color="dimmed">
							У вас нет вхоящих запросов
						</Text>
					)}
				</>
			)}
		</>
	);
};

const OutgoingRequests = () => {
	const { classes } = useStyles();

	const [reject, { isLoading: isRejecting }] = useRejectFriendRequestMutation();

	const { data: requests, isLoading: isRequestsLoading } =
		useGetOutgoingFriendsQuery();

	const handleRejectRequest = async (id: string) => {
		await reject(id);
	};

	return (
		<>
			{!isRequestsLoading && requests && (
				<>
					{requests.length > 0 ? (
						<div className={classes.requests}>
							{requests.map(request => (
								<FriendCard
									key={request.id}
									friend={request.to}
									friendRequestId={request.id}
								>
									<div className={classes.controls}>
										<Button
											size="xs"
											onClick={() => handleRejectRequest(request.id)}
											loading={isRejecting}
											compact
										>
											Отменить запрос
										</Button>
									</div>
								</FriendCard>
							))}
						</div>
					) : (
						<Text size="sm" color="dimmed">
							Вы пока не отправляли ни одного запроса в друзья
						</Text>
					)}
				</>
			)}
		</>
	);
};

const tabs = [
	{
		label: 'Входящие',
		value: 'incoming',
		node: <IncomingRequests />,
	},
	{
		label: 'Исходящие',
		value: 'outgoing',
		node: <OutgoingRequests />,
	},
];

const FriendsRequests = () => {
	const { classes, cx } = useStyles();

	const [activeTab, setActiveTab] = useState<(typeof tabs)[0]>(tabs[0]);

	return (
		<>
			<div className={classes.root}>
				<div className={classes.tabs}>
					{tabs.map(tab => (
						<UnstyledButton
							key={tab.value}
							onClick={() => setActiveTab(tab)}
							className={cx(classes.tab, {
								[classes.tabActive]: tab.value === activeTab.value,
							})}
						>
							<Text size="sm" fw={500}>
								{tab.label}
							</Text>
						</UnstyledButton>
					))}
				</div>
				{activeTab.node}
			</div>
		</>
	);
};

export default FriendsRequests;
