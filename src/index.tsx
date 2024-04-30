import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './main';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

const MainPage = React.lazy(() => import('./pages/main/MainPage.tsx'));
const CodePage = React.lazy(() => import('./pages/codeList/CodePage.tsx'));
const MyPage = React.lazy(() => import('./pages/profile/MyPage.tsx'));
const ContactPage = React.lazy(() => import('./pages/contact/ContactPage.tsx'));

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    {/*<App />*/}
    <BrowserRouter>
    <Suspense fallback={
					<div style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						height: '100vh',
						flexDirection: 'column',
						backgroundColor: 'rgba(0, 0, 0, 0.4)',
					}}>
						<div><CircularProgress style={{ color: '#000000' }} size={100} /></div>
					</div>}
				>
    <Routes>
      <Route path = '/' element = {<MainPage />} />
      <Route path='/code' element={<CodePage />} />
      <Route path='/profile/my' element={<MyPage />} />
      <Route path='/contact' element={<ContactPage />} />
    </Routes>
    </Suspense>
    </BrowserRouter>
  </React.StrictMode>
);


