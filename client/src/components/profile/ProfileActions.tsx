import { useUser } from '@/hooks/use-user';
import { useCreateChatMutation } from '@/redux/services/chat';
import {
	useAddFriendMutation,
	useDeleteFriendMutation,
	useGetFriendRequestStatusQuery,
} from '@/redux/services/friends';
import { ActionIcon, Button, Text, createStyles } from '@mantine/core';
import { modals } from '@mantine/modals';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiMessageCircle, FiUserCheck, FiUserPlus } from 'react-icons/fi';

const useStyles = createStyles(theme => ({
	root: {
		display: 'flex',
		justifyContent: 'flex-end',
		gap: theme.spacing.xs,
		[theme.fn.smallerThan('md')]: {
			justifyContent: 'center',
		},
	},

	actions: {
		display: 'flex',
		gap: theme.spacing.xs,
	},
}));

const ProfileActions = () => {
	const { classes } = useStyles();
	const router = useRouter();

	const { user, isLoading: isUserLoading } = useUser();

	const [createChat, { isLoading: isCreatingChat }] = useCreateChatMutation();
	const [addFriend, { isLoading: isAddingFriend }] = useAddFriendMutation();
	const [deleteFriend, { isLoading: isDeletingFriend }] =
		useDeleteFriendMutation();

	const { data: friendRequestStatus, isLoading: isFriendRequestStatusLoading } =
		useGetFriendRequestStatusQuery(router.query.id as string, {
			skip: !router.isReady || router.query.id === user?.id,
		});

	const handleAddFriendRequest = async () => {
		if (user) {
			await addFriend({ to: router.query.id as string });
		}
	};

	const openCancelFriendRequestModal = () =>
		modals.openConfirmModal({
			title: `Отменить запрос`,
			centered: true,
			children: (
				<Text size="sm">
					Вы уверены, что хотите отменить запрос на добавление в друзья?
				</Text>
			),
			labels: { confirm: 'Отменить', cancel: 'Назад' },
			confirmProps: { color: 'red' },
			onConfirm: async () =>
				friendRequestStatus && (await deleteFriend(friendRequestStatus.id)),
		});

	const openDeleteFriendModal = () =>
		modals.openConfirmModal({
			title: `Удалить из друзей`,
			centered: true,
			children: (
				<Text size="sm">Вы уверены, что хотите удалить из списка друзей?</Text>
			),
			labels: { confirm: 'Удалить', cancel: 'Отмена' },
			confirmProps: { color: 'red' },
			onConfirm: async () =>
				friendRequestStatus && (await deleteFriend(friendRequestStatus.id)),
		});

	const handleMessageClick = async () => {
		if (user) {
			// @ts-ignore
			const { data } = await createChat({
				members: [router.query.id as string, user.id],
			});
			router.push(`/im/${data.id}`);
		}
	};

	const renderFriendStatusBtn = () => {
		if (!isFriendRequestStatusLoading) {
			if (!friendRequestStatus) {
				return (
					<ActionIcon
						size="lg"
						color="blue"
						variant="light"
						h={36}
						w={36}
						onClick={handleAddFriendRequest}
						loading={isAddingFriend}
					>
						<FiUserPlus />
					</ActionIcon>
				);
			} else {
				if (friendRequestStatus.pending) {
					return (
						<Button
							onClick={openCancelFriendRequestModal}
							size="sm"
							color="blue"
							variant="light"
						>
							Запрос отправлен
						</Button>
					);
				} else {
					return (
						<ActionIcon
							onClick={openDeleteFriendModal}
							size="lg"
							color="blue"
							variant="light"
							h={36}
							w={36}
						>
							<FiUserCheck />
						</ActionIcon>
					);
				}
			}
		}
	};

	return (
		<>
			{!isUserLoading && user && router.isReady && (
				<div className={classes.root}>
					{router.query.id === user.id ? (
						<>
							<Button component={Link} href="/edit" size="sm">
								Редактировать профиль
							</Button>
						</>
					) : (
						<div className={classes.actions}>
							<Button
								onClick={handleMessageClick}
								leftIcon={<FiMessageCircle />}
								size="sm"
								disabled={isCreatingChat}
							>
								Сообщение
							</Button>
							{renderFriendStatusBtn()}
						</div>
					)}
				</div>
			)}
		</>
	);
};

export default ProfileActions;
