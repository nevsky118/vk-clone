import { rem, createStyles, UnstyledButton, Text } from '@mantine/core';
import Link from 'next/link';
import { IconType } from 'react-icons';

const useStyles = createStyles(theme => ({
	link: {
		display: 'flex',
		alignItems: 'center',
		padding: `${rem(8)} ${theme.spacing.xs}`,
		borderRadius: theme.radius.sm,
		color: theme.colors.gray[7],
		'&:hover': {
			backgroundColor: theme.colors.gray[0],
			color: theme.black,
		},
		[theme.fn.smallerThan('lg')]: {
			borderRadius: 0,
			height: rem(40),
			paddingLeft: theme.spacing.sm,
			paddingRight: 21,
			borderLeft: `${rem(4)} solid transparent`,
		},
	},

	wrapper: {
		display: 'flex',
		flex: 1,
	},

	icon: {
		marginRight: theme.spacing.sm,
		color:
			theme.colorScheme === 'dark'
				? theme.colors.dark[2]
				: theme.colors.gray[6],
	},
}));

interface NavLinkProps {
	icon: IconType;
	label: string;
	href: string;
}

const NavLink = ({ label, href, ...rest }: NavLinkProps) => {
	const { classes } = useStyles();

	return (
		<UnstyledButton
			component={Link}
			key={label}
			className={classes.link}
			href={href}
		>
			<div className={classes.wrapper}>
				<rest.icon size={20} className={classes.icon} />
				<Text size="md" lh="20px" fw={500}>
					{label}
				</Text>
			</div>
		</UnstyledButton>
	);
};

export default NavLink;
