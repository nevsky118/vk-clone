import { Text, Title, TitleProps, createStyles } from '@mantine/core';
import Link from 'next/link';

interface LogoProps extends TitleProps {}

const useStyles = createStyles(theme => ({
	root: { userSelect: 'none' },
}));

const Logo = ({
	className,
	order = 3,
	href,
	...rest
}: LogoProps & { href?: string }) => {
	const { classes, cx } = useStyles();

	const logo = (
		<Text
			size={32}
			variant="gradient"
			className={classes.root}
			gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
			fw={900}
		>
			ABC
		</Text>
	);

	if (href) {
		return (
			<Link href={href} style={{ textDecoration: 'none' }}>
				{logo}
			</Link>
		);
	}

	return logo;
};

export default Logo;
