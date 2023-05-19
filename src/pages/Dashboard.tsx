import {
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Container,
	Grid,
	Link,
	Typography,
} from '@mui/material';
import { memo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLoggedInAuth } from '../context/AuthContext';

function Profile() {
	const { userProducts, getUserProducts, getProfileOwner } = useLoggedInAuth();
	const { profile_id } = useParams()

	useEffect(() => {
		getProfileOwner(profile_id!)
		getUserProducts();
	}, []);

	return (
		<Container sx={{ py: 8 }} maxWidth='md'>

			<Grid container spacing={4}>
				{userProducts ? userProducts?.map((product) => (
					<Grid
						item
						key={product._id}
						xs={12}
						sm={6}
						md={4}
					>
						<Link
							href={`/products/${product._id}`}
							sx={{
								textDecoration: 'none',
							}}
						>
							<Card
								sx={{
									height: '100%',
									display: 'flex',
									flexDirection: 'column',
								}}
							>
								<CardMedia
									component='img'
									image={
										product?.images &&
										product?.images[0]?.path
									}
									alt='random'
								/>
								<CardContent
									sx={{ flexGrow: 1 }}
								>
									<Typography
										gutterBottom
										variant='h5'
										component='h2'
									>
										{product.name}
									</Typography>
									<Typography>
										{`${product.description.substring(
											0,
											50,
										)}...`}
									</Typography>
								</CardContent>
								<CardActions>
									<Button size='small'>
										View
									</Button>
								</CardActions>
							</Card>
						</Link>
					</Grid>
				)) : 'There are no products available to show'}
			</Grid>
		</Container>
	);
}

export default memo(Profile);
