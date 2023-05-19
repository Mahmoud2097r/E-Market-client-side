import { FormEvent, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useLoggedInAuth } from '../context/AuthContext';
import {
	Avatar,
	TextField,
	Link,
	Grid,
	Typography,
	Container,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

function Login() {
	const { login, user, isLoading } = useLoggedInAuth();
	if (user != null) return <Navigate to='/' />;

	const usernameRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		const username = usernameRef.current?.value;
		const password = passwordRef.current?.value;

		if (username == null || password == null) return;

		login({ username, password });
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
					required
					fullWidth
					id='username'
					label='username'
					inputRef={usernameRef}
					autoFocus
				/>
				<TextField
					margin='normal'
					required
					fullWidth
					inputRef={passwordRef}
					label='Password'
					type='password'
					id='password'
					autoComplete='current-password'
				/>

				<LoadingButton
					loading={isLoading}
					loadingPosition='end'
					variant='contained'
					sx={{ mt: 3, mb: 2 }}
					fullWidth
					type='submit'
					endIcon={<LockOutlinedIcon />}
				>
					Login
				</LoadingButton>
			</form>
			<Grid container>
				<Grid item xs>
					<Link href='#' variant='body2'>
						Forgot password?
					</Link>
				</Grid>
				<Grid item>
					<Link href='/register' variant='body2'>
						Don't have an Account? Register
					</Link>
				</Grid>
			</Grid>
		</Container>
	);
}

export default Login;
