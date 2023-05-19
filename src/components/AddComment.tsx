import { LoadingButton } from "@mui/lab";
import { Alert, Collapse, IconButton, Rating, TextareaAutosize, Typography } from "@mui/material";
import { FormEvent, Ref, useEffect, useState } from "react";
import { useReviews } from "../context/ReviewContext";
import CommentIcon from '@mui/icons-material/Comment';
import CloseIcon from '@mui/icons-material/Close';

type AddCommentProps = {
	ratingValue: number,
	bodyRef: Ref<HTMLTextAreaElement> | undefined,
	handleChange: (event: any, newValue: number | null) => void
	handleSubmit: (e: FormEvent) => void,
}

export default function AddComment(
	{
		ratingValue,
		handleChange,
		bodyRef,
		handleSubmit
	}: AddCommentProps
) {
	const { error } = useReviews();
	const [open, setOpen] = useState(error?.isError);



	useEffect(() => {
		setOpen(error?.isError);
	}, [error]);


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
				}}
				ref={bodyRef}
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
					Add Comment
				</LoadingButton>
			</div>
		</form>
	)
}
