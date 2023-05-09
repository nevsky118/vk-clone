import Layout from '@/components/common/Layout';
import { useUser } from '@/hooks/use-user';
import { Paper, Text, createStyles, rem } from '@mantine/core';
import Head from 'next/head';
import { ReactElement } from 'react';
import dynamic from 'next/dynamic';
const DynamicEditProfileInfo = dynamic(
	() => import('@/components/edit/EditProfileInfo')
);
const DynamicEditProfileAvatar = dynamic(
	() => import('@/components/edit/EditProfileAvatar')
);

const useStyles = createStyles(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		gap: theme.spacing.md,
	},

	header: {
		display: 'flex',
		alignItems: 'center',
		paddingInline: theme.spacing.md,
		paddingBottom: theme.spacing.md,
		gap: theme.spacing.md,
	},

	infoWrapper: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
	},

	name: {
		fontSize: rem(32),
		[theme.fn.smallerThan('md')]: {
			fontSize: rem(20),
		},
	},
}));

const Edit = () => {
	const { classes } = useStyles();
	const { user, isLoading } = useUser();

	return (
		<div className={classes.root}>
			<Paper withBorder>
				<Text size="sm" p="md" fw={500}>
					Профиль
				</Text>
				<div className={classes.header}>
					<DynamicEditProfileAvatar />

					<div className={classes.infoWrapper}>
						<Text fw={500} className={classes.name} tt="capitalize">
							{user?.name}
						</Text>
					</div>
				</div>
			</Paper>
			<DynamicEditProfileInfo />
		</div>
	);
};

Edit.getLayout = function getLayout(page: ReactElement) {
	return (
		<Layout>
			<Head>
				<title>Настройки – ABC</title>
			</Head>
			{page}
		</Layout>
	);
};

Edit.auth = true;

export default Edit;
