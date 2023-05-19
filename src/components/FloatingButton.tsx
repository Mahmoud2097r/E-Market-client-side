import { Link } from '@mui/material';
import Fab from '@mui/material/Fab';
import { ReactNode } from 'react';

type FloatingButtonProps = {
	children: ReactNode;
	position: string;
	bg: string;
	href?: string;
	handleClick?: () => void
};

const FloatingButton = ({
	children,
	position,
	bg,
	href,
	handleClick
}: FloatingButtonProps) => {
	return (
		<Link href={href} onClick={handleClick}>
			<Fab
				sx={{
					position: 'fixed',
					bottom: position,
					right: '40px',
					color: '#FFF',
					backgroundColor: bg,
					transition: 'all ease-in 100ms',
					':hover': {
						backgroundColor: bg,
						width: '60px',
						height: '60px',
					},
				}}
				aria-label='add'
			>
				{children}
			</Fab>
		</Link>
	);
};

export default FloatingButton;
