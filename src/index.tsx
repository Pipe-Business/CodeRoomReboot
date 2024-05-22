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
import { Octokit } from '@octokit/core';


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
const MyPurchaseDataPage = React.lazy(() => import('./pages/profile/MyPurchaseDataPage.tsx'));
const MyMentoringDataPage = React.lazy(() => import('./pages/profile/MyMentoringDataPage.tsx'));
const MyMentoringDetailPage = React.lazy(() => import('./pages/profile/MyMentoringDetailPage.tsx'));
const EditMyProfilePage = React.lazy(() => import('./pages/profile/EditMyProfilePage.tsx'));
const MyCodeDataPage = React.lazy(() => import('./pages/profile/MyCodeDataPage.tsx'));
const CashPointManagementPage = React.lazy(() => import('./pages/profile/CashPointManagementPage.tsx'));
const ChargePage = React.lazy(() => import('./pages/coin/ChargePage.tsx'));
const HelpPage = React.lazy(()=> import('./pages/help/HelpPage.tsx'));
const CodeInfo = React.lazy(()=> import('./pages/codeInfo/CodeInfoPage.tsx'));
const CoinPage = React.lazy(() => import('./pages/coin/CoinPage.tsx'));
const AdminPage = React.lazy(() => import ('./pages/admin/AdminPage.tsx'));
const AdminLoginPage = React.lazy(() => import('./pages/adminLogin/AdminLoginPage.tsx'));
const AdminCodeRequestInfo = React.lazy(() => import('./pages/admin/AdminCodeRequestInfoPage.tsx'));
const NotificationPage = React.lazy(() => import('./pages/notification/NotificationPage.tsx'));

const queryClient = new QueryClient();

export const useOctokit = new Octokit({
	auth: `bearer ${process.env.REACT_APP_GITHUB_TOKEN}`,
});

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
      <Route path='/profile/my/purchase' element={<MyPurchaseDataPage/>}/>
      <Route path='/profile/my/mentoring' element={<MyMentoringDataPage/>}/>
      <Route path='/profile/my/mentoring/:id' element={<MyMentoringDetailPage/>}/>
      <Route path='/profile/my/code-page' element={<MyCodeDataPage/>}/>
      <Route path='/profile/my/edit' element={<EditMyProfilePage/>}/>
      <Route path='/charge' element={<ChargePage/>}/>
      <Route path='/create/code' element={<CreateCodePage/>}/>
      <Route path='/admin/coderequest/:userId/:codeId' element={<AdminCodeRequestInfo />} />
      <Route path='/my/profile/cashpoint/management' element={<CashPointManagementPage/>}/>
      <Route path='/help' element={<HelpPage />} />
      <Route path='/code/:id' element={<CodeInfo/>} />
      <Route path='/coin' element={<CoinPage/>}/>
      <Route path='/admin' element={<AdminPage/>}/>
      <Route path='/admin/login' element={<AdminLoginPage/>}/>
      <Route path='/notification' element={<NotificationPage/>}/>


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


