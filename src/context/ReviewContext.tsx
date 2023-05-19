import {
	useContext,
	createContext,
	ReactNode,
	useState,
} from 'react';
import axios from 'axios';
import { ReqErr, User } from './AuthContext';
import { Product, useProduct } from './ProductContext';


type ReviewsProviderProps = {
	children: ReactNode;
};

export type Review = {
	_id: string;
	body: string;
	rating: number | null;
	product: Product;
	user: User;
	isEditing: boolean
};

type ReviewContext = {
	postReview: (
		product_id: string,
		user_id: string,
		review: Partial<Review>,
	) => void;
	editReview: (
		product_id: string,
		review_id: string,
		user_id: string,
		review: Partial<Review>
	) => void;
	deleteReview: (
		product_id: string,
		user_id: string,
		review_id: string
	) => void,
	error: ReqErr;
	isLoading: boolean
};

const Context = createContext<ReviewContext | null>(null);

export const useReviews = () => {
	return useContext(Context) as ReviewContext;
};

export const ReviewsProvider = ({
	children,
}: ReviewsProviderProps) => {
	const { showProduct } = useProduct()
	const [error, setError] = useState<ReqErr>({
		isError: false,
		msg: '',
	});
	const [isLoading, setIsLoading] = useState(false);

	const postReview = async (
		product_id: string,
		user_id: string,
		review: Partial<Review>,
	) => {
		try {
			setIsLoading(true);
			await axios({
				url: `${
					import.meta.env.VITE_SERVER_PRODUCTS_URL
				}/${product_id}/reviews`,
				method: 'POST',
				data: { review, user_id },
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
				},
			});
			showProduct(product_id)
		} catch (e: any) {
			setError({ isError: true, msg: e.response.data.err.message });
			console.log(e.response.data.err.message)
			setIsLoading(false);
		}
	};

	const editReview = async (
		product_id: string,
		user_id: string,
		review_id: string,
		review: Partial<Review>
	) => {
		try {
			setIsLoading(true)
			await axios({
				url: `${import.meta.env.VITE_SERVER_PRODUCTS_URL
					}/${product_id}/reviews/${review_id}`,
				method: 'PATCH',
				data: {
					review, user_id,
				},
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
				},
			})
			showProduct(product_id)
		} catch (e: any) {
			setError({ isError: true, msg: e.response.data.err.message });
			console.log(e.response.data.err.message)
			setIsLoading(false);
		}
	}


	const deleteReview = async (
		product_id: string,
		user_id: string,
		review_id: string,
	) => {
		try {
			setIsLoading(true)
			await axios({
				url: `${import.meta.env.VITE_SERVER_PRODUCTS_URL
					}/${product_id}/reviews/${review_id}`,
				method: 'DELETE',
				data: {
					 user_id,
				},
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
				},
			})
			showProduct(product_id)
		} catch (e: any) {
			setError({ isError: true, msg: e.response.data.err.message });
			console.log(e.response.data.err.message)
			setIsLoading(false);
		}
	}
	return (
		<Context.Provider value={{ postReview, error, isLoading, editReview, deleteReview }}>
			{children}
		</Context.Provider>
	);
};
