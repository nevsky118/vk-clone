import {
	Avatar as AvatarComponent,
	AvatarProps as AvatarComponentProps,
	createStyles,
} from '@mantine/core';

interface AvatarProps extends AvatarComponentProps {
	src?: string;
}
const useStyles = createStyles(theme => ({
	root: { flex: 'none' },
}));

const Avatar = ({ src, radius = '50%', className, ...rest }: AvatarProps) => {
	const { classes, cx } = useStyles();
	return (
		<AvatarComponent
			src={src ? src : '/camera_empty.png'}
			className={cx(classes.root, className)}
			{...rest}
			radius={radius}
		/>
	);
};

export default Avatar;
