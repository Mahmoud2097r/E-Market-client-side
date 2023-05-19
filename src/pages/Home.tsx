import { useEffect, useMemo } from 'react';
import { useProduct } from '../context/ProductContext';
import {
    Card,
    Link,
    Container,
    Typography,
    Box,
    Grid,
    CardMedia,
    CardContent,
    CardActions,
    Button,
} from '@mui/material';
import { motion } from 'framer-motion';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import { useShoppingCart } from '../context/ShoppingCartContext';
import { formatCurrency } from '../utils/formatCurrency';
import { LoadingButton } from '@mui/lab';

function Home() {
    const { getProducts, query, products } = useProduct();
    const { shoppingCart, addProductToCart, isCartLoading, loadingProduct } = useShoppingCart()

    const handleUpdateShppingCart = (product_id: string) => {
        addProductToCart(product_id, shoppingCart?._id)
    }

    function escapeRegExp(str: string) {
        return str.replace(/[.@&*+?^${}()|[\]\\]/g, ""); // $& means the whole matched string
    }

    const filteredProducts = useMemo(() => {
        return products?.filter(product => {
            return product.name.toLowerCase().includes(escapeRegExp(query.toLowerCase()))
        })
    }, [products, query])

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <main>
                <Box>
                    <Container maxWidth='sm'>
                        <Typography
                            component='h1'
                            variant='h2'
                            align='center'
                            color='text.primary'
                            gutterBottom
                        >
                            Products
                        </Typography>
                    </Container>
                </Box>
                <Container sx={{ py: 8 }} maxWidth='md'>
                    <Grid container spacing={4}>
                        {filteredProducts?.map((product) => (
                            <Grid
                                item
                                key={product._id}
                                xs={12}
                                sm={6}
                                md={4}
                                >
                                <Card
                                    sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection:
                                    'column',
                                    }}
                                >
                                    <Link
                                        href={`/products/${product._id}`}
                                        sx={{
                                            textDecoration: 'none',
                                            color: '#777'
                                        }}
                                    >
                                        <CardMedia
                                            component='img'
                                            image={
                                                product?.images &&
                                                product
                                                    ?.images[0]
                                                    ?.path
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
                                    </Link>
                                    <CardActions>
                                        <Link href={`/products/${product._id}`}>
                                            <Button size='small' >
                                                View
                                            </Button>
                                        </Link>     
                                        <LoadingButton
                                            loading={isCartLoading && loadingProduct === product._id}
                                            loadingPosition='end'
                                            endIcon={<AddShoppingCartIcon />}
                                            variant='outlined'
                                            color='primary'
                                            sx={{ border: 'none', ':hover': { border: 'none'} }}
                                            onClick={() => handleUpdateShppingCart(product?._id as string)}
                                        >
                                            <Typography>
                                                {formatCurrency(Number(product.price))}
                                            </Typography>
                                        </LoadingButton>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </main>
        </motion.div>
    );
}

export default Home;
