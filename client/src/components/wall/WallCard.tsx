import { formatDate } from '@/lib/format-date';
import {
	Post,
	useAddLikeMutation,
	useDeletePostMutation,
} from '@/redux/services/post';
import {
	createStyles,
	Card,
	ActionIcon,
	Group,
	Text,
	rem,
	Menu,
	Button,
} from '@mantine/core';
import {
	FiHeart,
	FiMessageSquare,
	FiMoreHorizontal,
	FiShare2,
	FiTrash2,
} from 'react-icons/fi';
import Avatar from '../ui/Avatar';
import { useUser } from '@/hooks/use-user';
import { modals } from '@mantine/modals';
import Link from 'next/link';

const useStyles = createStyles(theme => ({
	root: {
		backgroundColor:
			theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
	},

	header: {
		display: 'flex',
		alignItems: 'center',
	},

	infoWrapper: {
		display: 'flex',
		justifyContent: 'space-between',
		width: '100%',
	},

	info: {
		display: 'flex',
		flex: '1 1 auto',
		flexDirection: 'column',
	},

	author: {
		width: 'fit-content',
		'&:hover': {
			textDecoration: 'underline',
		},
	},

	mediaWrapper: {
		backgroundColor: theme.colors.gray[1],
		borderRadius: theme.spacing.md,
		overflow: 'hidden',
		marginTop: theme.spacing.xs,
	},

	media: {
		position: 'relative',
		width: '100%',
		margin: 'auto',
		maxHeight: rem(510),
		maxWidth: rem(510),
	},

	img: {
		objectFit: 'cover',
		height: '100%',
		width: '100%',
		top: 0,
		left: 0,
	},

	footer: {
		padding: `${theme.spacing.xs} ${theme.spacing.lg}`,
		marginTop: theme.spacing.md,
		borderTop: `${rem(1)} solid ${theme.colors.gray[2]}`,
	},

	like: {
		display: 'flex',
		gap: '',
	},
}));

interface WallCardProps {
	post: Post;
}

const WallCard = ({ post }: WallCardProps) => {
	const { classes, theme } = useStyles();

	const { user, isLoading } = useUser();

	const [deletePost, { isLoading: isDeletingPost }] = useDeletePostMutation();
	const [addLike, { isLoading: isAddingLike }] = useAddLikeMutation();

	const openDeletePostModal = () =>
		modals.openConfirmModal({
			title: `Удалить пост`,
			centered: true,
			children: (
				<Text size="sm">Вы уверены, что хотите удалить этот пост?</Text>
			),
			labels: { confirm: 'Да', cancel: 'Отмена' },
			confirmProps: { color: 'red' },
			onConfirm: async () => await deletePost(post.id),
		});

	const handlePostLike = async () => {
		await addLike(post.id);
	};

	return (
		<Card withBorder padding="lg" radius="md" className={classes.root}>
			<div className={classes.header}>
				<div className={classes.infoWrapper}>
					<Link href={`/${post.author.id}`}>
						<Avatar src={post.author?.avatar} radius="50%" mr="xs" />
					</Link>

					<div className={classes.info}>
						<Text
							component={Link}
							href={`/${post.author.id}`}
							fw={500}
							tt="capitalize"
							className={classes.author}
						>
							{post.author.name}
						</Text>
						<Text size="xs" c="dimmed">
							{formatDate(post.createdAt)}
						</Text>
					</div>
					{!isLoading && user && user.id === post.author.id && (
						<Menu
							width={180}
							position="bottom-end"
							trigger="hover"
							withArrow
							arrowPosition="center"
							withinPortal
							disabled={isDeletingPost}
						>
							<Menu.Target>
								<ActionIcon>
									<FiMoreHorizontal />
								</ActionIcon>
							</Menu.Target>

							<Menu.Dropdown>
								<Menu.Item
									onClick={openDeletePostModal}
									h={32}
									color="red"
									icon={<FiTrash2 />}
								>
									Удалить
								</Menu.Item>
							</Menu.Dropdown>
						</Menu>
					)}
				</div>
			</div>

			{post.content && <Text mt="xs">{post.content}</Text>}

			{post.photo && (
				<div className={classes.mediaWrapper}>
					<div className={classes.media}>
						<img src={post.photo} alt="photo" className={classes.img} />
					</div>
				</div>
			)}

			{!isLoading && user && (
				<Card.Section className={classes.footer}>
					<Button
						onClick={handlePostLike}
						size="xs"
						h={32}
						w={64}
						variant="light"
						color="gray"
						radius="lg"
					>
						{user.liked?.includes(post.id) ? (
							<FiHeart size={20} fill="red" color="red" />
						) : (
							<FiHeart size={20} color="red" />
						)}
						<Text ml={4} size="sm">
							{post.likes}
						</Text>
					</Button>
				</Card.Section>
			)}
		</Card>
	);
};

export default WallCard;
