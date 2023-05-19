import {
	useContext,
	createContext,
	ReactNode,
	useState,
} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { Product } from './ProductContext';
import { ShoppingCart } from './ShoppingCartContext';

type AuthProviderProps = {
	children: ReactNode;
};

type AuthContext = {
	user?: User | null;
	setUser: (user: User) => void,
	profileOwner: User | null;
	register: (user: User) => void;
	login: (user: Partial<User>) => void;
	logout: (id: string) => void;
	error: ReqErr | undefined;
	cookies: Cookies;
	handleSetSelectedImage: (image: File | null) => void;
	updateUserInfo: (formData: FormData) => void;
	isLoading: boolean;
	userProducts: Product[] | null;
	getUserProducts: () => void;
	deleteUser: (password: string) => void;
	getProfileOwner: (profile_id: string) => void
};

export type User = {
	username: string;
	email: string;
	password: string;
	_id?: string;
	image?: string;
	shoppingCart?: ShoppingCart
};

export type ReqErr = {
	isError: boolean;
	msg: string;
};

const Context = createContext<AuthContext | null>(null);

export const useAuth = () => {
	return useContext(Context) as AuthContext;
};

export const useLoggedInAuth = () => {
	return useContext(Context) as AuthContext &
		Required<Pick<AuthContext, 'user'>>;
};

export const AuthProvider = ({
	children,
}: AuthProviderProps) => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [userProducts, setUserProducts] = useState<
		Product[] | null
	>(null);
	const [selectedImage, setSelectedImage] =
		useState<File | null>(null);
	const [error, setError] = useState<ReqErr | undefined>();
	const cookies: Cookies = new Cookies();
	const [user, setUser] = useState<User | null>(
		cookies.get('user'),
	);

	const [profileOwner, setProfileOwner] = useState<User | null>(null)

	const handleSetSelectedImage = (image: File | null) => {
		setSelectedImage(image);
	};

	const getProfileOwner = async (profile_id: string) => {
		try {
			setIsLoading(true)
			const res = await axios({
				url: `${import.meta.env.VITE_SERVER_URL}/getProfileOwner`,
				data: { profile_id },
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
				},
			})
			setProfileOwner(res.data)
			setError({
				isError: false,
				msg: '',
			});
			setIsLoading(false)
		} catch (e: any) {
			console.log(e)
			setError({
				isError: true,
				msg: e.response.data.err.message,
			})
			setProfileOwner(user)
			setIsLoading(false)
		}

	}

	const register = async (user: User) => {
		try {
			const formData = new FormData();
			formData.append('file', selectedImage ?? '');
			formData.append('username', user.username);
			formData.append('email', user.email);
			formData.append('password', user.password);
			setIsLoading(true);
			const res = await axios({
				url: `${import.meta.env.VITE_SERVER_URL}/signup`,
				data: formData,
				method: 'POST',
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
			const date = new Date();
			date.setTime(
				date.getTime() + 14 * 24 * 60 * 60 * 1000,
			);
			cookies.set('user', res.data.user, {
				path: '/',
				expires: date,
			});
			setUser(cookies.get('user'));
			setError({
				isError: false,
				msg: '',
			});
			setIsLoading(false);
			navigate(-1);
		} catch (e: any) {
			console.log(e)
			setError({
				isError: true,
				msg: e.response.data.err.message,
			});
			setIsLoading(false);
		}
	};

	const login = async (user: Partial<User>) => {
		try {
			setIsLoading(true);
			const res = await axios({
				url: `${import.meta.env.VITE_SERVER_URL}/login`,
				method: 'POST',
				data: user,
			})
			const date = new Date();
			date.setTime(
				date.getTime() + 14 * 24 * 60 * 60 * 1000,
			);
			cookies.set('user', res.data.user, {
				path: '/',
				expires: date,
			});
			setUser(cookies.get('user'));
			setError({
				isError: false,
				msg: '',
			});
			setIsLoading(false);
			navigate(-1);

		} catch (e: any) {
			setError({
				isError: true,
				msg: e.response.data.err.message,
			});
			setIsLoading(false);
		}
	};

	const logout = (id: string) => {
		setIsLoading(true);
		axios
			.post(`${import.meta.env.VITE_SERVER_URL}/logout`, {
				id,
			})
			.then(() => {
				cookies.remove('user', { path: '/' });
				setUser(cookies.get('user'));
				navigate('/');
				setIsLoading(false);
			});
	};

	const updateUserInfo = (formData: FormData) => {
		setIsLoading(true);
		axios({
			url: `${import.meta.env.VITE_SERVER_URL}/${
				user?._id
			}`,
			data: formData,
			method: 'PUT',
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
			.then((res) => {
				cookies.remove('user', { path: '/' });
				const date = new Date();
				date.setTime(
					date.getTime() + 14 * 24 * 60 * 60 * 1000,
				);
				cookies.set('user', res.data.user, {
					path: '/',
					expires: date,
				});
				setUser(cookies.get('user'));
				setError({
					isError: false,
					msg: '',
				});
				setIsLoading(false);
			})
			.catch((res) => {
				setError({
					isError: true,
					msg: res.response.data.err.message,
				});
				setIsLoading(false);
			});
	};

	const deleteUser = (password: string) => {
		setIsLoading(true);
		axios({
			url: `${import.meta.env.VITE_SERVER_URL}/${
				user?._id
			}`,
			data: { password },
			method: 'DELETE',
		})
			.then(() => {
				cookies.remove('user', { path: '/' });
				setUser(null);
				setError({
					isError: false,
					msg: '',
				});
				setIsLoading(false);
				navigate('/');
			})
			.catch((res) => {
				setError({
					isError: true,
					msg: res.response.data.err.message,
				});
				setIsLoading(false);
			});
	};

	const getUserProducts = () => {
		setIsLoading(true);
		axios({
			method: 'GET',
			url: `${import.meta.env.VITE_SERVER_URL}/${
				user?._id
			}/user_products`,
		})
			.then((res) => {
				setUserProducts(res.data);
				setError({
					isError: false,
					msg: '',
				});
				setIsLoading(false);
			})
			.catch((e) => {
				setError({
					isError: true,
					msg: e.response.data.err.message,
				});
				setIsLoading(false);
			});
	};

	return (
		<Context.Provider
			value={{
				user,
				setUser,
				register,
				login,
				logout,
				error,
				cookies,
				handleSetSelectedImage,
				updateUserInfo,
				isLoading,
				userProducts,
				getUserProducts,
				deleteUser,
				getProfileOwner,
				profileOwner
			}}
		>
			{children}
		</Context.Provider>
	);
};
