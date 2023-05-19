import { useState, MouseEvent, useEffect, memo } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useLoggedInAuth } from '../../context/AuthContext';
import {
	styled,
	createTheme,
	ThemeProvider,
} from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, {
	AppBarProps as MuiAppBarProps,
} from '@mui/material/AppBar';
import {
	Link,
	Container,
	Avatar,
	Menu,
	MenuItem,
	Tooltip,
	CssBaseline,
	Box,
	Toolbar,
	Typography,
	Divider,
	IconButton,
	Collapse,
	Alert,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import defaultAvatar from '../../assets/images/default_avatar.png';
import CloseIcon from '@mui/icons-material/Close';
import SidebarList from '../../components/SidebarList';
import { useParams } from 'react-router-dom';


let drawerWidth: number = 240;
let loggedInSettings = ['Home', 'Logout'];
let notLoggedInSettings = ['Home', 'Login', 'Register'];

interface AppBarProps extends MuiAppBarProps {
	open?: boolean;
}

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(['width', 'margin'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(
			['width', 'margin'],
			{
				easing: theme.transitions.easing.sharp,
				duration:
					theme.transitions.duration.enteringScreen,
			},
		),
	}),
}));

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
	'& .MuiDrawer-paper': {
		position: 'relative',
		whiteSpace: 'nowrap',
		width: drawerWidth,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
		boxSizing: 'border-box',
		...(!open && {
			overflowX: 'hidden',
			transition: theme.transitions.create('width', {
				easing: theme.transitions.easing.sharp,
				duration:
					theme.transitions.duration.leavingScreen,
			}),
			width: theme.spacing(7),
			[theme.breakpoints.up('sm')]: {
				width: theme.spacing(9),
			},
		}),
	},
}));

const mdTheme = createTheme();

function DashboardContent() {
	const { user, profileOwner, logout, error } = useLoggedInAuth();

	if (!user) return <Navigate to='/login' />;


	const [open, setOpen] = useState(true);
	const [openError, setOpenError] = useState(error?.isError);
	const [anchorElUser, setAnchorElUser] =
		useState<null | HTMLElement>(null);

	const { profile_id } = useParams();

	const isUserTheOwner = user._id === profileOwner?._id

	const handleLogout = () => {
		logout(user?._id as string);
	};

	useEffect(() => {
		setOpenError(error?.isError);
		drawerWidth = isUserTheOwner ? 240 : 0
	}, [error]);

	const handleOpenUserMenu = (
		event: MouseEvent<HTMLElement>,
	) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const toggleDrawer = () => {
		setOpen(!open);
	};

	let settings;

	if (user != null) {
		settings = loggedInSettings;
	} else {
		settings = notLoggedInSettings;
	}

	return (
		<ThemeProvider theme={mdTheme}>
			<Box sx={{ display: 'flex' }}>
				<CssBaseline />
				<AppBar position='absolute' open={open}>
					<Toolbar
						sx={{
							pr: '24px', // keep right padding when drawer closed
						}}
					>
						<IconButton
							edge='start'
							color='inherit'
							aria-label='open drawer'
							onClick={toggleDrawer}
							sx={{
								marginRight: '36px',
								...(open && { display: 'none' }),
							}}
						>
							<MenuIcon />
						</IconButton>
						<Typography
							component='h1'
							variant='h6'
							color='inherit'
							noWrap
							sx={{
								flexGrow: 1,
								ml: '1rem',
							}}
						>
							{!isUserTheOwner ? `${profileOwner?.username}'s Products` : user.username}
						</Typography>
						<Tooltip title='Open settings'>
							<IconButton
								onClick={handleOpenUserMenu}
								sx={{ p: 0 }}
							>
								<Avatar
									alt="user's image"
									src={
										user?.image
											? user.image
											: defaultAvatar
									}
								/>
							</IconButton>
						</Tooltip>
						<Menu
							sx={{ mt: '45px' }}
							id='menu-appbar'
							anchorEl={anchorElUser}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={Boolean(anchorElUser)}
							onClose={handleCloseUserMenu}
						>


							{!isUserTheOwner &&
								<MenuItem
									key='profile'
									onClick={handleCloseUserMenu}
								>
									<Typography textAlign='center'>
										<Link
											href={`/profile/${user._id}`}
											sx={{
												textDecoration:
													'none',
												color: '#000',
											}}
										>
											Profile
										</Link>
									</Typography>
								</MenuItem>
							}

							
							{settings.map((setting) => (
								<MenuItem
									key={setting}
									onClick={handleCloseUserMenu}
								>
									{setting !== 'Logout' ? (
										<Typography textAlign='center'>
											<Link
												href='/'
												sx={{
													textDecoration:
														'none',
													color: '#000',
												}}
											>
												{setting}
											</Link>
										</Typography>
									) : (
										<Typography textAlign='center'>
											<Link
												onClick={
													handleLogout
												}
												sx={{
													textDecoration:
														'none',
													color: '#000',
												}}
											>
												{setting}
											</Link>
										</Typography>
									)}
								</MenuItem>
							))}
						</Menu>
					</Toolbar>
				</AppBar>
				{isUserTheOwner ?
					<Drawer variant='permanent' open={open}>
						<Toolbar
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'flex-end',
								px: [1],
							}}
						>
							<IconButton onClick={toggleDrawer}>
								<ChevronLeftIcon />
							</IconButton>
						</Toolbar>
						<Divider />
						<SidebarList
							profile_id={profile_id as string}
						/>
					</Drawer> : null
				}
				<Box
					component='main'
					sx={{
						backgroundColor: (theme) =>
							theme.palette.mode === 'light'
								? theme.palette.grey[100]
								: theme.palette.grey[900],
						flexGrow: 1,
						height: '100vh',
						overflow: 'auto',
					}}
				>
					<Toolbar />
					<Container
						maxWidth='lg'
						sx={{ mt: 4, mb: 4 }}
					>
						<Typography component='h1' variant='h5'>
							<Collapse in={openError}>
								<Alert
									severity='error'
									action={
										<IconButton
											aria-label='close'
											color='inherit'
											size='small'
											onClick={() => {
												setOpenError(
													false,
												);
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
						<Outlet />
					</Container>
				</Box>
			</Box>
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

export default memo(function ProfileLayout() {
	return <DashboardContent />;
})
