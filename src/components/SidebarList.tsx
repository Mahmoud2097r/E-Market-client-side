import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { List, Link, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InfoIcon from '@mui/icons-material/Info';
import { useLoggedInAuth } from '../context/AuthContext';
import UserDeleteForm from './DeleteUserForm';
import { useState } from 'react';

type SidebarProps = {
	profile_id: string;
};

const SidebarList = ({ profile_id }: SidebarProps) => {
	const { user } = useLoggedInAuth();

	const [openUserDeleteForm, setOpenUserDelete] =
		useState(false);

	const handleOpenUserDeleteForm = () => {
		setOpenUserDelete(true);
	};

	const handleCloseUserDeleteForm = () => {
		setOpenUserDelete(false);
	};

	return (
		<List component='nav'>
			<Link
				href={`/profile/${user?._id}/`}
				sx={{
					textDecoration: 'none',
					color: 'black',
				}}
			>
				<ListItemButton>
					<ListItemIcon>
						<DashboardIcon />
					</ListItemIcon>
					<ListItemText primary='Dashboard' />
				</ListItemButton>
			</Link>

			<Link
				href={`/profile/${user?._id}/edit`}
				sx={{
					textDecoration: 'none',
					color: 'black',
				}}
			>
				<ListItemButton>
					<ListItemIcon>
						<InfoIcon />
					</ListItemIcon>
					<ListItemText primary='User Info' />
				</ListItemButton>
			</Link>

			<Divider sx={{ my: 1 }} />

			<ListSubheader component='div' inset>
				More Options
			</ListSubheader>
			<Link
				href='/products/new'
				sx={{
					textDecoration: 'none',
					color: 'black',
				}}
			>
				<ListItemButton>
					<ListItemIcon>
						<AddIcon />
					</ListItemIcon>
					<ListItemText primary='Add New Product' />
				</ListItemButton>
			</Link>
			<ListItemButton onClick={handleOpenUserDeleteForm}>
				<ListItemIcon>
					<DeleteIcon color='error' />
				</ListItemIcon>
				<ListItemText primary='Delete User' />
				<UserDeleteForm
					open={openUserDeleteForm}
					handleClose={handleCloseUserDeleteForm}
				/>
			</ListItemButton>
			<ListItemButton>
				<ListItemIcon>
					{/* <AssignmentIcon /> */}
				</ListItemIcon>
				<ListItemText primary='Year-end sale' />
			</ListItemButton>
		</List>
	);
};

export default SidebarList;
