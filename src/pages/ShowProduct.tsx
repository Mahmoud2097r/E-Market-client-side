import {
	Avatar,
	Box,
	Button,
	IconButton,
	Grid,
	Typography,
	Rating
} from '@mui/material';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductsEditForm from '../components/ProductsEditForm';
import { useProduct } from '../context/ProductContext';
import Carousel from 'react-material-ui-carousel';
import { useLoggedInAuth } from '../context/AuthContext';
import ProductsDeleteForm from '../components/ProductsDeleteForm';
import Reviews from '../components/Reviews';
import { useShoppingCart } from '../context/ShoppingCartContext';
import { formatCurrency } from '../utils/formatCurrency';
import { LoadingButton } from '@mui/lab';


function ShowProduct() {
	const { product, showProduct, isLoading } = useProduct();
	const { user } = useLoggedInAuth();
	const { product_id } = useParams()

	const { shoppingCart, addProductToCart, isCartLoading } = useShoppingCart()

	const handleUpdateShppingCart = (product_id: string) => {
		addProductToCart(product_id, shoppingCart?._id)
	}

	const [openEditProductForm, setOpenEditProductForm] =
		useState(false);

	const [openDeleteProductForm, setOpenDeleteProductForm] =
		useState(false);

	const handleOpenEditProductsForm = () => {
		setOpenEditProductForm(true);
	};

	const handleCloseEditProductsForm = () => {
		setOpenEditProductForm(false);
	};

	const handleOpenDeleteProductsForm = () => {
		setOpenDeleteProductForm(true);
	};

	const handleCloseDeleteProductsForm = () => {
		setOpenDeleteProductForm(false);
	};


	useEffect(() => {
		showProduct(product_id as string);
	}, []);

	const isOwner = product?.user === user?._id;
	const [ratingValue, setRatingValue] = useState<
		number | null
		>(null);

	let optionButtons;

	if (user && isOwner) {
		optionButtons = (
			<div>
				<Button
					onClick={handleOpenEditProductsForm}
					color='warning'
				>
					Edit
				</Button>
				<Button
					onClick={handleOpenDeleteProductsForm}
					color='error'
				>
					Delete
				</Button>
			</div>
		);
	}
	return (
		<>
			{
				<div>
					{optionButtons}

					< Grid container spacing={2}>
						<Grid item lg={4}>
							<Carousel
								animation='slide'
								navButtonsAlwaysVisible
							>
								{product?.images?.map((image) => (
									<Avatar
										sx={{
											width: '100%',
											height: '400px',
										}}
										variant='rounded'
										src={image.path}
										alt='product image'
										key={image._id}
									/>
								))}
							</Carousel>
							<Rating
								name='read-only'
								value={product?.avgRating}
								readOnly
								sx={{ fontSize: '50px', ml: 8, mt: 2 }}
							/>
						</Grid>
						<Grid item md={8} color='gray'>
							<Typography variant='h3' ml={7}>
								{product?.name}
							</Typography>
							<Typography variant='h4' ml={7}>
								{formatCurrency(Number(product?.price))}
							</Typography>
							<Typography variant='h4' ml={7}>
								{product?.stock} in Stock
							</Typography>

							<Box ml={7} mt={5}>
								<Typography variant='h3'>
									Description
								</Typography>
								<Typography variant='body1' my={1}>
									{product?.description}
								</Typography>
							</Box>

							<Typography variant='button' ml={7}>
								<Button
									variant='outlined'
									color='info'
									sx={{
										p: '.5rem',
										ml: '1rem',
										mt: '1rem',
										':hover': {
											backgroundColor: '#00f',
											color: '#fff',
											broder: 'none'
										},
									}}
								>
									Buy Now
								</Button>
								<LoadingButton
									loading={isCartLoading}
									loadingPosition='end'
									endIcon={<AddShoppingCartIcon />}
									variant='outlined'
									color='info'
									sx={{
										p: '.5rem',
										ml: '1rem',
										mt: '1rem',
										':hover': {
											backgroundColor: '#00f',
											color: '#fff',
											broder: 'none'
										},
									}}
									onClick={() => handleUpdateShppingCart(product?._id as string)}
								>
									<Typography>
										{formatCurrency(Number(product!.price))}
									</Typography>
								</LoadingButton>
							</Typography>
						</Grid>
						<Reviews product_id={product?._id as string} ratingValue={ratingValue} setRatingValue={setRatingValue} />
					</Grid>
					<ProductsEditForm
						open={openEditProductForm}
						handleClose={handleCloseEditProductsForm}
						product={product ?? null}
					/>

					<ProductsDeleteForm
						open={openDeleteProductForm}
						handleClose={handleCloseDeleteProductsForm}
						product={product ?? null}
					/>
				</div>
			}
		</>
	);
}

export default ShowProduct;
