import { useGetUserByIdQuery } from '@/redux/services/user';
import { Avatar, Paper, Text, createStyles, rem } from '@mantine/core';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FiBriefcase, FiMapPin } from 'react-icons/fi';
import ProfileActions from './ProfileActions';

const useStyles = createStyles(theme => ({
	root: {
		display: 'flex',
		gap: theme.spacing.xs,

		[theme.fn.smallerThan('md')]: {
			flexDirection: 'column',
			alignItems: 'center',
		},
	},

	avatar: {
		height: rem(150),
		width: rem(150),
		flex: 'none',
		[theme.fn.smallerThan('md')]: {
			height: rem(75),
			width: rem(75),
		},
	},

	wrapper: {
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		gap: theme.spacing.xs,
		alignSelf: 'flex-start',
		marginLeft: rem(32),
		[theme.fn.smallerThan('md')]: {
			width: '100%',
			textAlign: 'center',
			marginLeft: 0,
		},
	},

	info: {
		display: 'flex',
		gap: theme.spacing.xs,
		flexWrap: 'wrap',
		fontSize: rem(16),
		[theme.fn.smallerThan('md')]: {
			justifyContent: 'center',
			fontSize: rem(14),
		},
	},

	infoRow: {
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing.xs,
		color: theme.colors.gray[6],
	},

	icon: {
		flexShrink: 0,
	},

	name: {
		fontSize: rem(32),
		fontWeight: 500,
		lineHeight: rem(40),
		[theme.fn.smallerThan('md')]: {
			fontSize: rem(24),
		},
	},
}));

const ProfileInfo = () => {
	const { classes } = useStyles();
	const router = useRouter();

	const { data, isLoading } = useGetUserByIdQuery(router.query.id as string, {
		skip: !router.isReady,
	});

	return (
		<>
			<Head>
				<title>{data?.name} – ABC</title>
			</Head>
			<Paper className={classes.root} p="md" withBorder>
				<Avatar
					src={data?.avatar ? data.avatar : 'camera_empty.png'}
					alt="avatar"
					radius="50%"
					className={classes.avatar}
				/>

				<div className={classes.wrapper}>
					<ProfileActions />

					<div>
						<Text className={classes.name} tt="capitalize">
							{data?.name}
						</Text>

						{data?.about && (
							<Text color="dimmed" size="xs">
								{data.about}
							</Text>
						)}
					</div>

					<div className={classes.info}>
						{data?.city && (
							<div className={classes.infoRow}>
								<FiMapPin className={classes.icon} />
								<Text color="dimmed">{data.city}</Text>
							</div>
						)}
						{data?.university && (
							<div className={classes.infoRow}>
								<FiBriefcase className={classes.icon} />
								<Text color="dimmed">{data.university}</Text>
							</div>
						)}
					</div>
				</div>
			</Paper>
		</>
	);
};

export default ProfileInfo;
