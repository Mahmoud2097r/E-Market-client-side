import React from 'react';
import ReactDOM from 'react-dom/client';
import { Router } from './Router';
import { RouterProvider } from 'react-router-dom';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement,
).render(
	<React.StrictMode>
		<RouterProvider router={Router} />
	</React.StrictMode>,
);
