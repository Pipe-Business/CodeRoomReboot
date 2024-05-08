import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import App from './main';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/react-query';

const MainPage = React.lazy(() => import('./pages/main/MainPage.tsx'));
const CodePage = React.lazy(() => import('./pages/codeList/CodePage.tsx'));
const MyPage = React.lazy(() => import('./pages/profile/MyPage.tsx'));
const ContactPage = React.lazy(() => import('./pages/contact/ContactPage.tsx'));
const MentoringPage = React.lazy(() => import('./pages/mentoring/MentoringPage.tsx'));
const CodeReviewPage = React.lazy(() => import('./pages/codeReview/CodeReviewPage.tsx'));
const ResetPasswdPage = React.lazy(() => import('./pages/profile/ResetPasswdPage.tsx'));
const RegisterPage = React.lazy(() => import('./pages/register/RegisterPage.tsx'));
const ChangePasswdPage = React.lazy(() => import('./pages/profile/ChangePasswdPage.tsx'));
const ResetCompletePage = React.lazy(() => import('./pages/profile/ResetCompletePage.tsx'));
const SignUpCompletePage = React.lazy(() => import('./pages/register/SignUpCompletePage.tsx'));
const NotFoundPage = React.lazy(() => import('./pages/error/NotFoundPage.tsx'));
const CreateCodePage = React.lazy(() => import('./pages/createCode/CreateCodePage.tsx'));
const HelpPage = React.lazy(()=> import('./pages/help/HelpPage.tsx'));
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
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
      <Route path='/mentoring' element={<MentoringPage />} />
      <Route path='/code-review' element={<CodeReviewPage />} />
      <Route path='/reset-password' element={<ResetPasswdPage />}/>
      <Route path='/register' element={<RegisterPage/>}/>
      <Route path='/change-password' element={<ChangePasswdPage/>}/>
      <Route path='/reset-complete' element={<ResetCompletePage/>}/>
      <Route path='/signup-complete' element={<SignUpCompletePage/>}/>
      <Route path='/create/code' element={<CreateCodePage/>}/>
      <Route path='/help' element={<HelpPage />} />

      <Route path='/*' element={<NotFoundPage/>}/>
    
    </Routes>
    </Suspense>
      <ToastContainer
            autoClose={3000}
            hideProgressBar
          />
    </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);


