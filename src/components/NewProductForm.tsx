import { useRef, ChangeEvent } from 'react';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { TextareaAutosize } from '@mui/base';
import AddIcon from '@mui/icons-material/Add';
import { useProduct } from '../context/ProductContext';
import { useLoggedInAuth } from '../context/AuthContext';
import { LoadingButton } from '@mui/lab';

export default function NewProductForm({}) {
	const { user } = useLoggedInAuth();
	const { postProduct, handleSetSelectedImages, isLoading } =
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
	const onSubmit = () => {
		if (isLoading) return;

		const name = nameRef.current?.value;
		const price = priceRef.current?.value;
		const stock = stockRef.current?.value;
		const description = descriptionRef.current?.value;

		if (
			name == null ||
			name === '' ||
			price == null ||
			price === '' ||
			description == null ||
			description === ''
		)
			return;

		postProduct({
			name,
			price,
			stock: stock ?? '',
			description,
			user: user?._id ?? '',
		});

		if (!isLoading) return;
	};

	return (
		<div>
			<Toolbar>
				<Typography
					sx={{ ml: 2, flex: 1 }}
					variant='h6'
					component='div'
				>
					Add New Product
				</Typography>
			</Toolbar>
			<List component='form'>
				<ListItem>
					<TextField
						margin='normal'
						required
						fullWidth
						id='name'
						label={`Product's Name`}
						inputRef={nameRef}
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
					<LoadingButton
						loading={isLoading}
						loadingPosition='end'
						endIcon={<AddIcon />}
						variant='contained'
						color='info'
						sx={{ mt: 1, mb: 5 }}
						onClick={onSubmit}
					>
						Add
					</LoadingButton>
				</ListItem>
			</List>
		</div>
	);
}
