import {
	Avatar,
	Button,
	Container,
	TextField,
	Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import { useLoggedInAuth } from '../context/AuthContext';

function UpdateUserInfoForm() {
	const { user, updateUserInfo, isLoading } =
		useLoggedInAuth();
	const usernameRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);
	const currentPasswordRef = useRef<HTMLInputElement>(null);
	const newPasswordRef = useRef<HTMLInputElement>(null);
	const confirmNewPasswordRef = useRef<HTMLInputElement>(null);
	const [selectedImage, setSelectedImage] =
		useState<File | null>(null);
	const [reviewImage, setReviewImage] = useState(user?.image);
	const [disableSubmit, setDisableSubmit] = useState(true);

	const onChangePassword = () => {
		setDisableSubmit(
			currentPasswordRef.current?.value === null ||
				currentPasswordRef.current?.value === ''
				? true
				: newPasswordRef.current?.value ===
				  confirmNewPasswordRef.current?.value
				? false
				: true,
		);
	};
	const handleFileChange = (
		e: ChangeEvent<HTMLInputElement>,
	) => {
		if (!e.target.files) return;
		const files: FileList | null = e.target.files;
		setSelectedImage(files[0]);
		setReviewImage(URL.createObjectURL(files[0]));
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		const username = usernameRef.current?.value;
		const email = emailRef.current?.value;
		const currentPassword =
			currentPasswordRef.current?.value;
		const newPassword = newPasswordRef.current?.value;
		const confirmNewPassword =
			confirmNewPasswordRef.current?.value;

		if (currentPassword == null || currentPassword === '')
			return;

		if (newPassword !== confirmNewPassword) return;

		const formData = new FormData();

		formData.append('username', username ?? '');
		formData.append('email', email ?? '');
		formData.append('currentPassword', currentPassword);
		formData.append('newPassword', newPassword ?? '');
		formData.append(
			'confirmNewPassword',
			confirmNewPassword ?? '',
		);
		formData.append('file', selectedImage ?? '');

		updateUserInfo(formData);

		currentPasswordRef.current!.value = '';
		newPasswordRef.current!.value = '';
		confirmNewPasswordRef.current!.value = '';
		setDisableSubmit(true);
	};

	return (
		<Container
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
				<LockOutlinedIcon />
			</Avatar>
			<Typography component='h1' variant='h5'>
				Login
			</Typography>
			<form onSubmit={handleSubmit}>
				<TextField
					margin='normal'
					fullWidth
					id='username'
					name='username'
					defaultValue={user?.username}
					inputRef={usernameRef}
					autoFocus
				/>

				<TextField
					margin='normal'
					fullWidth
					type='email'
					id='email'
					defaultValue={user?.email}
					name='email'
					inputRef={emailRef}
				/>

				<TextField
					margin='normal'
					fullWidth
					inputRef={currentPasswordRef}
					label='Current Password'
					type='password'
					id='currentPassword'
					autoComplete='current-password'
					onChange={onChangePassword}
				/>

				<TextField
					margin='normal'
					fullWidth
					inputRef={newPasswordRef}
					label='New Password'
					type='password'
					id='newPassword'
					onChange={onChangePassword}
				/>

				<TextField
					margin='normal'
					fullWidth
					inputRef={confirmNewPasswordRef}
					label='Confirm New Password'
					type='password'
					id='confirmNewPassword'
					onChange={onChangePassword}
				/>

				<TextField
					margin='normal'
					fullWidth
					type='file'
					id='file'
					onChange={handleFileChange}
				/>
				<img
					src={reviewImage}
					alt='profile photo'
					width={100}
				/>

				<Button
					type='submit'
					fullWidth
					variant='contained'
					sx={{ mt: 3, mb: 2 }}
					disabled={disableSubmit || isLoading}
				>
					{isLoading
						? 'Updating Your Info...'
						: 'Update'}
				</Button>
			</form>
		</Container>
	);
}

export default UpdateUserInfoForm;
