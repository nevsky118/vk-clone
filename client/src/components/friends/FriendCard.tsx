import Avatar from '@/components/ui/Avatar';
import { useDeleteFriendMutation } from '@/redux/services/friends';
import { ActionIcon, Menu, Text, createStyles, rem } from '@mantine/core';
import Link from 'next/link';
import { ReactNode } from 'react';
import { FiMoreHorizontal } from 'react-icons/fi';
import { modals } from '@mantine/modals';
import { User } from '@/redux/services/user';

const useStyles = createStyles(theme => ({
	friend: {
		display: 'flex',
		gap: theme.spacing.xs,
	},

	friendInfoWrapper: {
		display: 'flex',
		justifyContent: 'space-between',
		width: '100%',
	},

	friendInfo: {
		display: 'flex',
		flexDirection: 'column',
		gap: rem(4),
		padding: rem(4),
	},

	underline: {
		'&:hover': {
			textDecoration: 'underline',
		},
	},
}));

interface FriendCardProps {
	friendRequestId: string;
	friend: User;
	withActionsMenu?: boolean;
	children?: ReactNode;
}

const FriendCard = ({
	friendRequestId,
	friend,
	children,
	withActionsMenu = false,
}: FriendCardProps) => {
	const { classes } = useStyles();

	const [deleteFriend, { isLoading: isDeletingFriend }] =
		useDeleteFriendMutation();

	const openDeleteFriendModal = () =>
		modals.openConfirmModal({
			title: `Удалить из друзей`,
			centered: true,
			children: (
				<Text size="sm">
					Вы уверены, что хотите удалить <b>{friend.name}</b> из списка друзей?
				</Text>
			),
			labels: { confirm: 'Удалить', cancel: 'Отмена' },
			confirmProps: { color: 'red' },
			onConfirm: async () => await deleteFriend(friendRequestId),
		});

	return (
		<div className={classes.friend}>
			<Avatar src={friend?.avatar} w={80} h={80} />
			<div className={classes.friendInfoWrapper}>
				<div className={classes.friendInfo}>
					<Text
						component={Link}
						href={`/${friend.id}`}
						className={classes.underline}
						fw={500}
						size="sm"
					>
						{friend.name}
					</Text>
					{friend?.university && (
						<Text size="xs" color="dimmed">
							{friend.university}
						</Text>
					)}

					{children ? (
						children
					) : (
						<Text
							size="xs"
							color="blue"
							component={Link}
							href="/im"
							className={classes.underline}
						>
							Написать сообщение
						</Text>
					)}
				</div>

				{withActionsMenu && (
					<Menu
						offset={2}
						position="bottom-end"
						disabled={isDeletingFriend}
						withArrow
					>
						<Menu.Target>
							<ActionIcon>
								<FiMoreHorizontal />
							</ActionIcon>
						</Menu.Target>
						<Menu.Dropdown>
							<Menu.Item fz="xs" h={32} disabled>
								Посмотреть друзей
							</Menu.Item>
							<Menu.Item onClick={openDeleteFriendModal} fz="xs" h={32}>
								Удалить из друзей
							</Menu.Item>
							<Menu.Item fz="xs" h={32} disabled>
								Настроить списки
							</Menu.Item>
						</Menu.Dropdown>
					</Menu>
				)}
			</div>
		</div>
	);
};

export default FriendCard;
