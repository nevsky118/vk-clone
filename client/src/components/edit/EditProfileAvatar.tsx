import Avatar from '@/components/ui/Avatar';
import { useUser } from '@/hooks/use-user';
import {
	useDeleteAvatarMutation,
	useUpdateAvatarMutation,
} from '@/redux/services/user';
import { Menu, UnstyledButton } from '@mantine/core';
import { ChangeEvent, useRef } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const EditProfileAvatar = () => {
	const { user, isLoading } = useUser();

	const avatarInputRef = useRef<HTMLInputElement>(null);

	const [updateAvatar, { isLoading: isUpdatingAvatar }] =
		useUpdateAvatarMutation();
	const [deleteAvatar, { isLoading: isDeletingAvatar }] =
		useDeleteAvatarMutation();

	const handleAvatarUpdate = async (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const avatar = e.target.files[0];

			const formData = new FormData();
			formData.set('avatar', avatar);
			await updateAvatar(formData);
		}
		e.target.value = '';
	};

	const handleAvatarDelete = async () => {
		await deleteAvatar();
	};

	return (
		<>
			<Menu
				width={180}
				trigger="hover"
				disabled={isDeletingAvatar || isUpdatingAvatar}
			>
				<Menu.Target>
					<UnstyledButton>
						<Avatar size="xl" src={user?.avatar} />
					</UnstyledButton>
				</Menu.Target>

				<Menu.Dropdown>
					<Menu.Item
						h={32}
						onClick={() => avatarInputRef.current?.click()}
						icon={<FiEdit2 />}
					>
						Изменить аватар
					</Menu.Item>

					<Menu.Item
						h={32}
						onClick={handleAvatarDelete}
						color="red"
						icon={<FiTrash2 />}
					>
						Удалить
					</Menu.Item>
				</Menu.Dropdown>
			</Menu>
			<input
				ref={avatarInputRef}
				type="file"
				accept="image/png,image/jpeg"
				onChange={handleAvatarUpdate}
				hidden
			/>
		</>
	);
};

export default EditProfileAvatar;
