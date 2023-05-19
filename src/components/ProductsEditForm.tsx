import {
	useRef,
	forwardRef,
	ReactElement,
	Ref,
	ChangeEvent,
} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import TextField from '@mui/material/TextField';
import { TextareaAutosize } from '@mui/base';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { Product, useProduct } from '../context/ProductContext';
import { useLoggedInAuth } from '../context/AuthContext';
import { LoadingButton } from '@mui/lab';

const Transition = forwardRef(function Transition(
	props: TransitionProps & {
		children: ReactElement;
	},
	ref: Ref<unknown>,
) {
	return <Slide direction='up' ref={ref} {...props} />;
});

type ProductsEditFormProps = {
	open: boolean;
	product: Product | null;
	handleClose: () => void;
};

export default function ProductsEditForm({
	open,
	product,
	handleClose,
}: ProductsEditFormProps) {
	const { user } = useLoggedInAuth();
	const { editProduct, handleSetSelectedImages, isLoading } =
		useProduct();
	const nameRef = useRef<HTMLInputElement>(null);
	const priceRef = useRef<HTMLInputElement>(null);
	const stockRef = useRef<HTMLInputElement>(null);
	const descriptionRef = useRef<HTMLTextAreaElement>(null);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;
		const files: FileList | null = e.target.files;
		handleSetSelectedImages(files);
	};
	const onSubmit = async () => {
		console.log(`${product?._id}`);
		if (isLoading) return;

		if (user?._id !== product?.user) return;

		const name = nameRef.current?.value;
		const price = priceRef.current?.value;
		const stock = stockRef.current?.value;
		const description = descriptionRef.current?.value;

		if (name === '' || price === '' || description === '')
			return;

		await editProduct({
			name,
			price,
			stock: stock ?? '',
			description,
			_id: product?._id,
		});

		handleClose();
	};

	return (
		<div>
			<Dialog
				fullScreen
				open={open}
				onClose={handleClose}
				TransitionComponent={Transition}
			>
				<AppBar sx={{ position: 'relative', backgroundColor: '#77e', color: '#ddd' }} >
					<Toolbar>
						{' '}
						<IconButton
							edge='start'
							color='inherit'
							onClick={handleClose}
							aria-label='close'
						>
							<CloseIcon />
						</IconButton>
						<Typography
							sx={{ ml: 2, flex: 1 }}
							variant='h6'
							component='div'
						>
							Edit {product?.name}
						</Typography>
						<LoadingButton
							loading={isLoading}
							loadingPosition='end'
							endIcon={<EditIcon />}
							variant='text'
							color="inherit"
							onClick={onSubmit}
						>
							Edit
						</LoadingButton>
					</Toolbar>
				</AppBar>
				<List component='form'>
					<ListItem>
						<TextField
							margin='normal'
							required
							fullWidth
							id='name'
							label={`Product's Name`}
							inputRef={nameRef}
							defaultValue={product?.name}
							autoFocus
						/>
					</ListItem>
					<ListItem>
						<TextField
							margin='normal'
							required
							fullWidth
							id='price'
							label={`Product's price`}
							inputRef={priceRef}
							defaultValue={product?.price}
						/>
					</ListItem>
					<ListItem>
						<TextField
							margin='normal'
							required
							fullWidth
							id='stock'
							label={`Stock`}
							inputRef={stockRef}
							defaultValue={product?.stock}
						/>
					</ListItem>
					<ListItem>
						<TextareaAutosize
							minRows={5}
							required
							aria-label='description'
							placeholder='Describe Your Product'
							style={{
								width: '100%',
								borderRadius: '.25rem',
								outlineColor: 'darkorange',
								borderColor: 'lightgray',
								padding: '1rem',
								fontSize: '1rem',
							}}
							ref={descriptionRef}
							defaultValue={product?.description}
						/>
					</ListItem>
					<ListItem>
						<Button
							variant='contained'
							component='label'
							color='success'
						>
							<AddIcon /> Upload image(s)
							<input
								type='file'
								hidden
								onChange={handleChange}
								multiple
							/>
						</Button>
					</ListItem>
					<ListItem>
						{product?.images?.map((image) => (
							<img
								key={image._id}
								src={image.path}
								alt='product image'
								width='200'
							/>
						))}
					</ListItem>
				</List>
			</Dialog>
		</div>
	);
}
