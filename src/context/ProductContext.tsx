import {
	useContext,
	createContext,
	ReactNode,
	useState,
} from 'react';
import axios from 'axios';
import { ReqErr, useLoggedInAuth } from './AuthContext';
import useLocalStorage from '../hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';
import { Review } from './ReviewContext';

type ProductProviderProps = {
	children: ReactNode;
};

type Image = {
	_id: string;
	filename: string;
	path: string;
};

export type Product = {
	name: string;
	price: string;
	stock: string;
	_id: string;
	description: string;
	images?: Image[];
	user: string;
	reviews: Review[],
	avgRating: number | null
};

type ProductContext = {
	products: Product[] | null | undefined;
	getProducts: () => void;
	postProduct: (product: Partial<Product>) => void;
	showProduct: (id: string) => void;
	editProduct: (product: Partial<Product>) => void;
	deleteProduct: (id: string) => void;
	product: Product | null | undefined;
	error: ReqErr | undefined;
	handleSetSelectedImages: (images: any) => void;
	isLoading: boolean;
	setQuery: (query: string) => void,
	query: string
};

const Context = createContext<ProductContext | null>(null);

export const useProduct = () => {
	return useContext(Context) as ProductContext;
};

export const ProductProvider = ({
	children,
}: ProductProviderProps) => {
	const { user } = useLoggedInAuth();
	const [selectedImages, setSelectedImages] = useState<
		File[] | null
		>();
	const [query, setQuery] = useState('')
	const [error, setError] = useState<ReqErr | undefined>();

	const [products, setProducts] = useState<Product[] | null>(
		null,
	);
	const { getUserProducts } = useLoggedInAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [product, setProduct] =
		useLocalStorage<Product | null>('product', null);
	const navigate = useNavigate();

	const handleSetSelectedImages = (images: File[]) => {
		setSelectedImages(images);
	};


	const getProducts = async () => {
		try {
			setIsLoading(true);
			const res = await axios({
				method: 'GET',
				url: `${import.meta.env.VITE_SERVER_PRODUCTS_URL}`,
			})
			setProducts(res.data);
			setError({
				isError: false,
				msg: '',
			});
			setIsLoading(false);
		} catch (e: any) {
			setError({
				isError: true,
				msg: e.response.data.err.message,
			});
			setIsLoading(false);
		}
	};

	const postProduct = async (product: Partial<Product>) => {
		try {
			setIsLoading(true);
			const formData = new FormData();
			if (selectedImages != null) {
				for (let selectedImage of selectedImages) {
					formData.append('files', selectedImage);
				}
			}
			formData.append('name', product.name ?? '');
			formData.append('price', product.price ?? '');
			formData.append('stock', product.stock ?? '');
			formData.append(
				'description',
				product.description ?? '',
			);
			formData.append('user_id', product.user ?? '');
			const res = await axios({
				method: 'POST',
				url: `${import.meta.env.VITE_SERVER_PRODUCTS_URL}`,
				data: formData,
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
			if (products) {
				setProducts((prevProducts: any) => [
					res.data,
					...prevProducts,
				]);
			} else {
				getUserProducts();
			}
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

	const showProduct = async (product_id: string) => {
		try {
			setIsLoading(true);
			const res = await axios({
				method: 'GET',
				url: `${import.meta.env.VITE_SERVER_PRODUCTS_URL
					}/${product_id}`,
			})
			setProduct(res.data)
			setIsLoading(false);
		} catch (e: any) {
			setError({
				isError: true,
				msg: e.response.data.err.message,
			});
			setIsLoading(false);
		}
	};

	const editProduct = async (product: Partial<Product>) => {
		try {
			setIsLoading(true);
			const formData = new FormData();
			if (selectedImages != null) {
				for (let selectedImage of selectedImages) {
					formData.append('files', selectedImage);
				}
			}
			formData.append('name', product.name ?? '');
			formData.append('price', product.price ?? '');
			formData.append('stock', product.stock ?? '');
			formData.append('user_id', user?._id ?? '');
			formData.append(
				'description',
				product.description ?? '',
			);
			const res = await axios({
				method: 'PUT',
				url: `${import.meta.env.VITE_SERVER_PRODUCTS_URL}/${product._id
					}`,
				data: formData,
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
			setProduct(res.data);
			setIsLoading(false);
		} catch (e: any) {
			console.log(e)
			setError({
				isError: true,
				msg: e.response.data.err.message,
			});
			setIsLoading(false);
		}
	};

	const deleteProduct = (id: string) => {
		axios({
			method: 'DELETE',
			url: `${
				import.meta.env.VITE_SERVER_PRODUCTS_URL
			}/${id}`,
			data: { id, userId: user?._id },
		})
			.then(() => {
				setProduct(null);
				setIsLoading(false);
				navigate(-1);
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
				products,
				getProducts,
				error,
				handleSetSelectedImages,
				postProduct,
				showProduct,
				editProduct,
				product,
				isLoading,
				deleteProduct,
				setQuery,
				query
			}}
		>
			{children}
		</Context.Provider>
	);
};
