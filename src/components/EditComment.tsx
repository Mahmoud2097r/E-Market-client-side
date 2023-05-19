import { LoadingButton } from "@mui/lab";
import { Alert, Collapse, IconButton, Rating, TextareaAutosize, Typography } from "@mui/material";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useReviews } from "../context/ReviewContext";
import CommentIcon from '@mui/icons-material/Comment';
import CloseIcon from '@mui/icons-material/Close';
import { useLoggedInAuth } from "../context/AuthContext";

type EditCommentProps = {
	ratingValue: number,
	product_id: string,
	review_id: string,
	handleChange: (event: any, newValue: number | null) => void,
	value: string ,
	handleEditing: (review_id: string, body?: string, rating?: number) => void,
}

export default function EditComment(
	{
		ratingValue,
		handleChange,
		review_id,
		product_id,
		value,
		handleEditing,
	}: EditCommentProps
) {
	const { error, editReview } = useReviews();
	const { user } = useLoggedInAuth()
	const [open, setOpen] = useState(error?.isError);
	const bodyRef = useRef<HTMLTextAreaElement>(null);


	useEffect(() => {
		setOpen(error?.isError);
	}, [error]);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();

		const body = bodyRef?.current?.value!;

		const rating = ratingValue!;
		editReview(product_id, user?._id as string, review_id, { body, rating });
		handleEditing(review_id, body, rating)
	};

	return (
		<form onSubmit={handleSubmit} style={{ width: '90%' }}>
			<div>
				<Rating
					name='rating'
					value={ratingValue}
					onChange={handleChange}
					sx={{ fontSize: '50px' }}
				/>
			</div>
			<Typography
				component='h1'
				variant='h5'
				marginTop={1}
			>
				<Collapse in={open}>
					<Alert
						severity='error'
						action={
							<IconButton
								aria-label='close'
								color='inherit'
								size='small'
								onClick={() => {
									setOpen(false);
								}}
							>
								<CloseIcon fontSize='inherit' />
							</IconButton>
						}
						sx={{ mb: 2 }}
					>
						{error?.msg}
					</Alert>
				</Collapse>
			</Typography>

			<TextareaAutosize
				minRows={10}
				required
				placeholder='What is Your Thought about this product?'
				style={{
					width: '100%',
					borderRadius: '.5rem',
					outlineColor: 'darkblue',
					borderColor: 'lightgray',
					padding: '1rem',
					fontSize: '1rem',
					marginBottom: '1rem'
				}}
				ref={bodyRef}
				defaultValue={value}
			/>

			<div>
				<LoadingButton
					loading={false}
					loadingPosition='end'
					variant='outlined'
					type='submit'
					color='info'
					endIcon={<CommentIcon />}
				>
					Edit Comment
				</LoadingButton>
			</div>
		</form>
	)
}
