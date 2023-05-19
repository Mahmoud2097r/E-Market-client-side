import {
	FormEvent,
	forwardRef,
	ReactElement,
	Ref,
	useRef,
} from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLoggedInAuth, User } from '../context/AuthContext';
import { LoadingButton } from '@mui/lab';
import { List, ListItem, TextField } from '@mui/material';

const Transition = forwardRef(function Transition(
	props: TransitionProps & {
		children: ReactElement;
	},
	ref: Ref<unknown>,
) {
	return <Slide direction='up' ref={ref} {...props} />;
});

type DeleteUserProps = {
	open: boolean;
	handleClose: () => void;
};

export default function UserDeleteForm({
	open,
	handleClose,
}: DeleteUserProps) {
	const { user } = useLoggedInAuth();
	const { deleteUser, isLoading } = useLoggedInAuth();
	const passwordRef = useRef<HTMLInputElement>(null);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();

		const password = passwordRef.current?.value!;

		deleteUser(password as string);

		passwordRef!.current!.value = '';

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
							Delete User [{user?.username}]
						</Typography>
					</Toolbar>
				</AppBar>

				<List>
					<form onSubmit={handleSubmit}>
						<ListItem>
							<TextField
								required
								autoFocus
								inputRef={passwordRef}
								label='Password'
								type='password'
								id='password'
							/>
						</ListItem>
						<ListItem>
							<LoadingButton
								loading={isLoading}
								loadingPosition='end'
								endIcon={<DeleteIcon />}
								variant='contained'
								color='error'
								sx={{ mt: 1, mb: 5 }}
								type='submit'
							>
								Confirm Deletion
							</LoadingButton>
						</ListItem>
					</form>
				</List>
				<Typography
					variant='body1'
					color='error'
					mt={10}
					sx={{ textAlign: 'center' }}
				>
					Are You Sure You Want To Delete [
					{user?.username}
					]?
				</Typography>
			</Dialog>
		</div>
	);
}
