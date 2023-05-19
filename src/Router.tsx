import { createBrowserRouter, Outlet } from 'react-router-dom';
import AuthLayout from './pages/layouts/AuthLayout';
import { AuthProvider } from './context/AuthContext';
import RootLayout from './pages/layouts/RootLayout';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import ProfileLayout from './pages/layouts/ProfileLayout';
import Dashboard from './pages/Dashboard';
import UpdateUserInfoForm from './pages/UpdateUserInfoForm';
import { Box, createTheme, ThemeProvider } from '@mui/material';
import { motion } from 'framer-motion';
import ShowProduct from './pages/ShowProduct';
import { ProductProvider } from './context/ProductContext';
import NewProductForm from './components/NewProductForm';
import ShoppingCartProvider from './context/ShoppingCartContext';
import ErrorPage from './pages/ErrorPage'

export const Router = createBrowserRouter([
	{
		element: <ContextWrapper />,
		path: '/',
		children: [
			{
				path: '/',
				element: <RootLayout />,
				children: [
					{ index: true, element: <Home /> },
					{
						path: 'products/:product_id',
						element: <ShowProduct />,
					},
					{
						path: 'products/new',
						element: <NewProductForm />,
					},
				],
			},
			{
				element: <AuthLayout />,
				path: 'register',
				children: [
					{
						index: true,
						element: <Register />,
					},
					{ path: 'login', element: <Login /> },
				],
			},
			{
				path: 'profile',
				element: <ProfileLayout />,
				children: [
					{
						path: ':profile_id',
						element: <Dashboard />,
					},
					{
						path: ':profile_id/edit',
						element: <UpdateUserInfoForm />,
					},
				],
			},

		],
	},
	{
		path: '*',
		element: <ErrorPage />,
	}
]);

const theme = createTheme();

function ContextWrapper() {
	return (
		<motion.div
			initial={{ x: -2000, opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			exit={{ x: 2000, opacity: 0 }}
		>
			<AuthProvider>
				<ShoppingCartProvider>
					<ProductProvider>
						<ThemeProvider theme={theme}>
							<Box
								component='main'
								sx={{
									backgroundColor: (theme) =>
										theme.palette.mode ===
										'light'
											? theme.palette.grey[100]
											: theme.palette
													.grey[900],
									height: '100vh',
								}}
							>
								<Outlet />
							</Box>
						</ThemeProvider>
					</ProductProvider>
				</ShoppingCartProvider>
			</AuthProvider>
		</motion.div>
	);
}
