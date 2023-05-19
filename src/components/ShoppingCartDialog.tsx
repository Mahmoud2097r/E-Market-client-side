import * as React from 'react';
import {
    Button,
    Dialog,
    ListItemText,
    ListItem,
    List,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Slide,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import { TransitionProps } from '@mui/material/transitions';
import { useShoppingCart } from '../context/ShoppingCartContext';
import { Avatar } from '@mui/material';
import { formatCurrency } from '../utils/formatCurrency';
import { LoadingButton } from '@mui/lab';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

type ShoppingCartDialogProps = {
    openCart: boolean,
    handleClose: () => void
}

export default function ShoppingCartDialog({ openCart, handleClose }: ShoppingCartDialogProps) {

    const { shoppingCart, updateShoppingCart, isCartLoading, loadingProduct } = useShoppingCart()

    return (
        <div>
            <Dialog
                fullScreen
                open={openCart}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative', backgroundColor: '#77e', color: '#ddd' }} >
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Cart
                        </Typography>
                        <Button color="inherit" onClick={handleClose}>
                            save
                        </Button>
                    </Toolbar>
                </AppBar>
                <List>
                    {
                        shoppingCart && shoppingCart.cartItems!.map((item, i) => (
                            <ListItem key={`shoppingCart-${item._id}-${i}`}>
                                <Avatar
                                    sx={{
                                        borderRadius: '.3rem',
                                        width: '80px',
                                        height: '80px',
                                        mr: '1rem'
                                    }}
                                    src={item.image} alt="product's owner's profile's image"
                                />
                                <ListItemText primary={item.name} secondary={`${formatCurrency(item.price)}`} />
                                <LoadingButton
                                    loading={isCartLoading && loadingProduct === item._id}
                                    loadingPosition='end'
                                    endIcon={<DeleteIcon />}
                                    variant='outlined'
                                    color='error'
                                    sx={{
                                        p: '.5rem',
                                        ml: '1rem',
                                        mt: '1rem',
                                        border: 'none',
                                        ':hover': {
                                            border: 'none',
                                            background: 'none'
                                        },
                                    }}
                                    onClick={() => updateShoppingCart(shoppingCart._id, item._id)}
                                >
                                </LoadingButton>
                            </ListItem>
                        ))
                    }
                    <ListItem key='shoppingCartTotalPrice'>
                        <Typography variant='h6' sx={{ mt: '5rem' }}>
                            Total Price: ${formatCurrency(shoppingCart?.total ?? 0)}
                        </Typography>
                    </ListItem>
                </List>
            </Dialog>
        </div>
    );
}