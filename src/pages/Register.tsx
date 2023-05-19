import { FormEvent, useRef, useState, ChangeEvent } from 'react';
import { useLoggedInAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import {
	Avatar,
	Box,
	Button,
	Grid,
	Link,
	TextField,
	Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { LoadingButton } from '@mui/lab';
import AddIcon from '@mui/icons-material/Add';

function Register() {
	const { register, user, handleSetSelectedImage, isLoading } =
		useLoggedInAuth();

	if (user != null) return <Navigate to='/' />;

	const usernameRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);

	const [reviewImage, setReviewImage] = useState('');

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;
		const files: FileList | null = e.target.files;
		handleSetSelectedImage(files[0]);
		setReviewImage(URL.createObjectURL(files[0]));
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		const username = usernameRef.current?.value;
		const email = emailRef.current?.value;
		const password = passwordRef.current?.value;

		if (
			username == null ||
			email == null ||
			password == null
		)
			return;

		await register({
			username,
			email,
			password,
		});
	};

	return (
		<Box
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
				Register
			</Typography>
			<form onSubmit={handleSubmit}>
				<TextField
					margin='normal'
					required
					fullWidth
					id='email'
					label='Email Address'
					inputRef={emailRef}
					autoComplete='email'
					autoFocus
				/>
				<TextField
					type='text'
					margin='normal'
					required
					fullWidth
					id='username'
					label='Username'
					inputRef={usernameRef}
				/>
				<TextField
					margin='normal'
					required
					fullWidth
					label='Password'
					type='password'
					inputRef={passwordRef}
					id='password'
					autoComplete='current-password'
				/>

				<Button
					variant='contained'
					component='label'
					color='success'
					sx={{ mb: 0.5 }}
				>
					<AddIcon /> Upload image
					<input
						type='file'
						hidden
						id='image'
						onChange={handleChange}
					/>
				</Button>
				<br />
				{reviewImage && (
					<img
						src={reviewImage}
						alt='selectedImage'
						width={100}
					/>
				)}

				<LoadingButton
					loading={isLoading}
					loadingPosition='end'
					variant='contained'
					sx={{ mt: 1, mb: 5 }}
					fullWidth
					type='submit'
					endIcon={<LockOutlinedIcon />}
				>
					Register
				</LoadingButton>
			</form>
			<Grid container>
				<Grid item xs>
					<Link href='#' variant='body2'>
						Forgot password?
					</Link>
				</Grid>
				<Grid item>
					<Link href='/login' variant='body2'>
						Already Registered? Login
					</Link>
				</Grid>
			</Grid>
		</Box>
	);
}

export default Register;
