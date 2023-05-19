import {
	useContext,
	createContext,
	ReactNode,
	useState,
} from 'react';
import axios from 'axios';
import { Product } from './ProductContext';
import { ShoppingCart } from '@mui/icons-material';
import useLocalStorage from '../hooks/useLocalStorage';

type ShoppingCartProviderProps = {
	children: ReactNode;
}

type ShoppingCartContext = {
	shoppingCart: ShoppingCart | null | undefined,
	addProductToCart: (product_id: string, shoppingCart_id?: string) => void,
	isCartLoading: boolean,
	updateShoppingCart: (shoppingCart_id: string, product_id: string) => void,
	loadingProduct: string
}

type CartItem = {
	_id: string
	image: string,
	name: string,
	price: number,
	item_id: string
}

export type ShoppingCart = {
	_id: string,
	total: number,
	cartItems: CartItem[]
}

export type ReqErr = {
	isError: boolean;
	msg: string;
}

const Context = createContext<ShoppingCartContext | null>(null)

export const useShoppingCart = () => {
	return useContext(Context) as ShoppingCartContext
}

export default function ShoppingCartProvider(
	{ children }: ShoppingCartProviderProps) {
	const [error, setError] = useState<ReqErr | undefined>();
	const [loadingProduct, setLoadingProduct] = useState('');
	const [isCartLoading, setIsCartloading] = useState(false);
	const [shoppingCart, setShoppingCart] = useLocalStorage<ShoppingCart | null>('shoppingCart', null)

	const addProductToCart = async (product_id: string, shoppingCart_id?: string) => {
		try {
			setIsCartloading(true)
			setLoadingProduct(product_id)
			const res = await axios({
				url: `${import.meta.env.VITE_SERVER_SHOPPINGCART_URL}`,
				method: 'POST',
				data: { product_id, shoppingCart_id },
			})
			console.log(res.data)
			setShoppingCart(res.data)
			setIsCartloading(false)
			setLoadingProduct('')
		} catch (e: any) {
			console.log(e)
			setError({
				isError: true,
				msg: e.response.data.err.message,
			});
			setIsCartloading(false)
			setLoadingProduct('')
		}
	}

	const updateShoppingCart = async (shoppingCart_id: string, item_id: string) => {
		try {
			setIsCartloading(true)
			setLoadingProduct(item_id)
			const res = await axios({
				url: `${import.meta.env.VITE_SERVER_SHOPPINGCART_URL}/${shoppingCart_id}`,
				method: 'PATCH',
				data: { item_id }
			})
			setShoppingCart(res.data)
			setIsCartloading(false)
			setLoadingProduct('')
		} catch (e: any) {
			console.log(e)
			setError({
				isError: true,
				msg: e.response.data.err.message,
			});
			setIsCartloading(false)
			setLoadingProduct('')
		}
	}

	return <Context.Provider value={{ shoppingCart, addProductToCart, isCartLoading, updateShoppingCart, loadingProduct }}>
		{ children }
	</Context.Provider>
}