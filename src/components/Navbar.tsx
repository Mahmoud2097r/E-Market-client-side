import { useState, MouseEvent, useEffect } from 'react';
import {
	AppBar,
	Box,
	Toolbar,
	IconButton,
	Typography,
	Menu,
	Container,
	Avatar,
	Button,
	Tooltip,
	MenuItem,
	Link,
	Alert,
	Collapse,
	InputBase,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import defaultAvatar from '../assets/images/default_avatar.png';
import CloseIcon from '@mui/icons-material/Close';
import logo from '../assets/images/logo.png';
import { useLoggedInAuth } from '../context/AuthContext';
import { useProduct } from '../context/ProductContext';


const pages = ['Home', 'About US'];
let loggedInSettings = ['Profile', 'Logout'];
let notLoggedInSettings = ['Login', 'Register'];

function Navbar() {
	const { user, logout } = useLoggedInAuth();
	const { error } = useProduct();
	const { setQuery } = useProduct()
	const [open, setOpen] = useState(error?.isError);
	const [anchorElNav, setAnchorElNav] =
		useState<null | HTMLElement>(null);
	const [anchorElUser, setAnchorElUser] =
		useState<null | HTMLElement>(null);

	let settings: string[];

	if (user != null) {
		settings = loggedInSettings;
	} else {
		settings = notLoggedInSettings;
	}

	const handleOpenNavMenu = (
		event: MouseEvent<HTMLElement>,
	) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (
		event: MouseEvent<HTMLElement>,
	) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	useEffect(() => {
		setOpen(error?.isError);
	}, [error]);

	const handleLogout = () => {
		logout(user?._id as string);
	};

	return (
		<>
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
							<img
								src={logo}
								alt='logo'
								width={50}
							/>
						</Typography>

						<Box
							sx={{
								flexGrow: 1,
								display: {
									xs: 'flex',
									md: 'none',
								},
							}}
						>
							<IconButton
								size='large'
								aria-label='account of current user'
								aria-controls='menu-appbar'
								aria-haspopup='true'
								onClick={handleOpenNavMenu}
								sx={{ color: '#000' }}
							>
								<MenuIcon />
							</IconButton>
							<Menu
								id='menu-appbar'
								anchorEl={anchorElNav}
								anchorOrigin={{
									vertical: 'bottom',
									horizontal: 'left',
								}}
								keepMounted
								transformOrigin={{
									vertical: 'top',
									horizontal: 'left',
								}}
								open={Boolean(anchorElNav)}
								onClose={handleCloseNavMenu}
								sx={{
									display: {
										xs: 'block',
										md: 'none',
									},
								}}
							>
								{pages.map((page) => (
									<MenuItem
										key={page}
										onClick={
											handleCloseNavMenu
										}
									>
										<Typography textAlign='center'>
											<Link
												href={
													page.toLowerCase() ===
														'home'
														? '/'
														: `/${page.toLocaleLowerCase()}`
												}
												sx={{
													textDecoration:
														'none',
													color: '#000',
												}}
											>
												{page}
											</Link>
										</Typography>
									</MenuItem>
								))}
							</Menu>
						</Box>

						<Box
							sx={{
								flexGrow: 1,
								display: {
									xs: 'none',
									md: 'flex',
								},
							}}
						>
							{pages.map((page) => (
								<Button
									key={page}
									onClick={handleCloseNavMenu}
									sx={{
										my: 2,
										color: 'black',
										display: 'block',
									}}
								>
									<Link
										href={
											page.toLowerCase() ===
											'home'
												? '/'
												: `/${page.toLocaleLowerCase()}`
										}
										onClick={
											handleCloseNavMenu
										}
										sx={{
											textDecoration:
												'none',
											color: '#000',
										}}
									>
										{page}
									</Link>
								</Button>
							))}
						</Box>

						<Box
							sx={{
								flexGrow: 1,
								display: {
									md: 'flex',
								},
							}}
						>
							<IconButton
								type='button'
								sx={{ p: '10px' }}
								aria-label='search'
							>
								<SearchIcon />
							</IconButton>
							<InputBase
								sx={{ ml: 1, flex: 1 }}
								placeholder="Search for a product's name"
								inputProps={{
									'aria-label': 'search',
								}}
								onChange={(e) => setQuery(e.target.value)}
							/>
						</Box>

						<Box sx={{ flexGrow: 0 }}>
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
								{settings.map((setting) => (
									<MenuItem
										key={setting}
										onClick={
											handleCloseUserMenu
										}
									>
										{setting !== 'Logout' ? (
											<Typography textAlign='center'>
												<Link
													href={
														setting.toLocaleLowerCase() ===
														'profile'
															? `/${setting.toLocaleLowerCase()}/:${
																	user?._id
															  }`
															: `/${setting.toLocaleLowerCase()}`
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
						</Box>
					</Toolbar>
				</Container>
			</AppBar>
			<Typography
				component='h1'
				variant='h5'
				marginTop={1}
			>
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
		</>
	);
}
export default Navbar;
