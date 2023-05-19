import { FormEvent, useState, useRef, useEffect } from 'react';
import {
    Avatar,
    Collapse,
    Grid,
    IconButton,
    Link,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Review, useReviews } from '../context/ReviewContext';
import { useLoggedInAuth } from '../context/AuthContext';
import AddComment from './AddComment';
import EditComment from './EditComment';
import { useProduct } from '../context/ProductContext';

type ReviewProps = {
    product_id: string;
    ratingValue: number | null,
    setRatingValue: (num: number | null) => void,
};

function Reviews({ product_id, ratingValue, setRatingValue }: ReviewProps) {

    const { postReview, deleteReview } = useReviews();
    const { product } = useProduct()
    const [reviews, setReviews] = useState<Review[] | null>(
        product?.reviews!
    );
    const bodyRef = useRef<HTMLTextAreaElement>(null);
    const { user } = useLoggedInAuth();

    useEffect(() => {
        setReviews(product?.reviews!)
    }, [product])

    const handleChange = (e: any, newValue: number | null) => {
        setRatingValue(newValue)
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const body = bodyRef.current?.value!;
        const rating = ratingValue!;
        postReview(product_id, user?._id as string, {
            body,
            rating,
        });
        
        bodyRef!.current!.value = '';
        setRatingValue(0);
    };


    const handleDelete = (review_id: string) => {
            setReviews((prevReviews: any) => {
                return prevReviews.filter((review: any) => {
                    if (review._id !== review_id) return review
                    return null
                })
            })
        deleteReview(product_id, user?._id as string, review_id)
        
    }

    const handleEditing = (review_id: string, body?: string, rating?: number) => {
        setReviews((prevReviews: any) => {
            return prevReviews.map((review: any) => {
                if (review._id === review_id) return { ...review, isEditing: !review.isEditing }
                return review;
            })
        })

        if (body) {
            setReviews((prevReviews: any) => {
                return prevReviews.map((review: any) => {
                    if (review._id === review_id) return { ...review, body }
                    return review;
                })
            })
        }

        if (rating) {
            setReviews((prevReviews: any) => {
                return prevReviews.map((review: any) => {
                    if (review._id === review_id) return { ...review, rating }
                    return review;
                })
            })
        }
    }


    const haveReviewed = reviews?.filter((review: any) => (user?._id === review.user._id)).length

    return (
        <>
            <Grid
                item
                mt={1}
                mb={8}
                ml={20}
                sm={8}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                }}
            >
                <Typography m={5} variant='h2'>Reviews</Typography>

                {haveReviewed! < 1 &&
                    <AddComment ratingValue={ratingValue!} handleChange={handleChange} bodyRef={bodyRef} handleSubmit={handleSubmit} />}


                <Grid item sx={{ flexGrow: 1, width: '100%', overflow: 'hidden', px: 3, ml: 7, mt: 5 }}>

                    {reviews?.map((review: Review) => (
                        <div key={review._id}>
                            <Paper
                                sx={{
                                    width: '80%',
                                    my: 1,
                                    mx: 'auto',
                                    p: 2,
                                    backgroundColor: '#1A2027',
                                    color: '#fff'
                                }}
                            >
                                <Stack spacing={2} direction="row" justifyContent='space-between'>
                                    <Stack spacing={2} direction="row" alignItems="center">
                                        <Link href={`/profile/${review.user._id}`}>
                                            <Avatar src={review.user?.image} alt="user's profile's image" />
                                        </Link>
                                        <Typography noWrap>{review.body}</Typography>
                                    </Stack>
                                    {user?._id === review.user._id &&
                                       <Stack direction="row">
                                           <IconButton color='warning' onClick={() => handleEditing(review._id as string)}><EditIcon /></IconButton>
                                           <IconButton color='error' onClick={() => handleDelete(review._id as string)}><DeleteIcon /></IconButton>
                                       </Stack>
                                    }
                                </Stack>
                                <Collapse in={review.isEditing}>
                                    <EditComment handleEditing={handleEditing} product_id={product_id} review_id={review._id as string} ratingValue={ratingValue!} handleChange={handleChange} value={review.body}/>
                                </Collapse>
                            </Paper>
                        </div>
                    ))}
                </Grid>

            </Grid>

        </>
    );
}

export default Reviews;
