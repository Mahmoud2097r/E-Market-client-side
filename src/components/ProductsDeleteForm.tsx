import { forwardRef, ReactElement, Ref } from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import DeleteIcon from '@mui/icons-material/Delete';
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

type ProductsDeleteFormProps = {
	open: boolean;
	product: Product | null;
	handleClose: () => void;
};

export default function ProductsDeleteForm({
	open,
	product,
	handleClose,
}: ProductsDeleteFormProps) {
	const { user } = useLoggedInAuth();
	const { deleteProduct, isLoading } = useProduct();

	const onSubmit = () => {
		if (user?._id !== product?.user) return;

		deleteProduct(product?._id as string);

		if (!isLoading) handleClose();
	};

	return (
		<div>
			<Dialog
				fullScreen
				open={open}
				onClose={handleClose}
				TransitionComponent={Transition}
			>
				<AppBar
					sx={{
						position: 'relative',
						bgcolor: 'error',
					}}
				>
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
							Delete {product?.name}
						</Typography>
						<LoadingButton
							loading={isLoading}
							loadingPosition='end'
							endIcon={<DeleteIcon />}
							variant='contained'
							color='inherit'
							sx={{ mt: 1, mb: 5 }}
							onClick={onSubmit}
						>
							Confirm Deletion
						</LoadingButton>
					</Toolbar>
				</AppBar>
				<Typography
					variant='body1'
					color='error'
					mt={10}
					sx={{ textAlign: 'center' }}
				>
					Are You Sure You Want To Delete [
					{product?.name}]?
				</Typography>
			</Dialog>
		</div>
	);
}
