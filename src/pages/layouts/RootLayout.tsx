import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import {
	Box,
	ThemeProvider,
	Toolbar,
	Container,
	Typography,
	Link,
    createTheme,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import FloatingButton from '../../components/FloatingButton';
import { useLoggedInAuth } from '../../context/AuthContext';
import { ReviewsProvider } from '../../context/ReviewContext';
import { useState } from 'react';
import ShoppingCartDialog from '../../components/ShoppingCartDialog'

const RootLayout = () => {
	const { user } = useLoggedInAuth();
	const [openCart, setOpenCart] = useState(false);

	const handleShoppingCartOpen = () => {
		setOpenCart(true);
	};

	const handleShoppingCartClose = () => {
		setOpenCart(false);
	};


	const theme = createTheme();

	return (
		<ReviewsProvider>
			<ThemeProvider theme={theme}>
				<Box>
					<Navbar />

					<Box
						component='main'
						sx={{
							backgroundColor: (theme) =>
								theme.palette.mode === 'light'
									? theme.palette.grey[100]
									: theme.palette.grey[900],
							height: '100%',
						}}
					>
						<Toolbar />
						<Container
							maxWidth='lg'
							sx={{ mt: 4, mb: 4 }}
						>
							<Outlet />
							{user && (
								<FloatingButton
									children={<AddIcon />}
									position='40px'
									bg='green'
									href='/products/new'
								/>
							)}

							<FloatingButton
								children={<ShoppingCartIcon />}
								position='110px'
								bg='rgb(0, 0, 200)'
								handleClick={handleShoppingCartOpen}
							/>
							
						</Container>
					</Box>
				</Box>
				<Copyright />
				<ShoppingCartDialog openCart={openCart} handleClose={handleShoppingCartClose} />
			</ThemeProvider>
		</ReviewsProvider>
	);
};

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

export default RootLayout;
