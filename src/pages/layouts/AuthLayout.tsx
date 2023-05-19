import { Outlet, useNavigate } from 'react-router-dom';
import {
	CssBaseline,
	Box,
	Typography,
	Container,
	Alert,
	IconButton,
	Collapse,
	AppBar,
	Toolbar,
	Button,
	createTheme,
	ThemeProvider,
	Link,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const theme = createTheme();

function AuthLayout() {
	const { error } = useAuth();

	const [open, setOpen] = useState(error?.isError);
	const navigate = useNavigate();

	useEffect(() => {
		setOpen(error?.isError);
	}, [error]);

	return (
		<ThemeProvider theme={theme}>
			<AppBar
				position='static'
				sx={{ backgroundColor: 'white' }}
			>
				<Container maxWidth='xl'>
					<Toolbar disableGutters>
						<Typography
							variant='h6'
							noWrap
							component='a'
							href='/'
							sx={{
								mr: 2,
								display: {
									xs: 'none',
									md: 'flex',
								},
								fontFamily: 'monospace',
								fontWeight: 700,
								letterSpacing: '.3rem',
								color: 'inherit',
								textDecoration: 'none',
							}}
						>
							<Button onClick={() => navigate(-1)}>
								<ChevronLeftIcon /> Go Back
							</Button>
						</Typography>
					</Toolbar>
				</Container>
			</AppBar>
			<Typography component='h1' variant='h5'>
				<Collapse in={open}>
					<Alert
						severity='error'
						action={
							<IconButton
								aria-label='close'
								color='inherit'
								size='small'
								onClick={() => {
									setOpen(false);
								}}
							>
								<CloseIcon fontSize='inherit' />
							</IconButton>
						}
						sx={{ mb: 2 }}
					>
						{error?.msg}
					</Alert>
				</Collapse>
			</Typography>
			<Container
				component='main'
				maxWidth='xs'
				sx={{ height: '70vh' }}
			>
				<CssBaseline />
				<Box>
					<Outlet />
				</Box>
			</Container>
			<Copyright />
		</ThemeProvider>
	);
}

function Copyright(props: any) {
	return (
		<Typography
			variant='body2'
			color='text.secondary'
			align='center'
			{...props}
		>
			{'Copyright © ALL RIGHT RESERVED '}
			<Link color='inherit' href='https://mui.com/'>
				Your Website
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}

export default AuthLayout;
