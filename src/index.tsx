import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/react-query';
import { Octokit } from '@octokit/core';
import {RecoilRoot} from "recoil";


const MainPage = React.lazy(() => import('./pages/main/MainPage'));
const CodePage = React.lazy(() => import('./pages/codeList/CodePage'));
const MyPage = React.lazy(() => import('./pages/profile/MyPage'));
const ContactPage = React.lazy(() => import('./pages/contact/ContactPage'));
const ResetPasswdPage = React.lazy(() => import('./pages/profile/ResetPasswdPage'));
const RegisterPage = React.lazy(() => import('./pages/register/RegisterPage'));
const ChangePasswdPage = React.lazy(() => import('./pages/profile/ChangePasswdPage'));
const ResetCompletePage = React.lazy(() => import('./pages/profile/ResetCompletePage'));
const NotFoundPage = React.lazy(() => import('./pages/error/NotFoundPage'));
const CreateCodePage = React.lazy(() => import('./pages/createCode/CreateCodePage'));
const CodeSubmissionFinalPage = React.lazy(() => import('./pages/createCode/CodeSubmissionFinalPage'));
const MyPurchaseDataPage = React.lazy(() => import('./pages/profile/MyPurchaseDataPage'));
const LikedDetailDataPage = React.lazy(() => import('./pages/profile/LikedDetailDataPage'));
const EditMyProfilePage = React.lazy(() => import('./pages/profile/EditMyProfilePage'));
const MyCodeDataPage = React.lazy(() => import('./pages/profile/MyCodeDataPage'));
const MySaleDataPage = React.lazy(() => import('./pages/profile/MySaleDataPage'));
const CashConfirmDataPage = React.lazy(() => import ("./pages/profile/CashConfirmDataPage"));
// const CashPointHistoryDataPage = React.lazy(() => import('./pages/profile/CashPointHistoryDataPage.tsx'));
const HelpPage = React.lazy(()=> import('./pages/help/HelpPage'));
const CodeInfo = React.lazy(()=> import('./pages/codeInfo/CodeInfoPage'));
const AdminPage = React.lazy(() => import ('./pages/admin/AdminPage'));
const AdminLoginPage = React.lazy(() => import('./pages/adminLogin/AdminLoginPage'));
const AdminCodeRequestInfo = React.lazy(() => import('./pages/admin/AdminCodeRequestInfoPage'));
const AdminUserInfo = React.lazy(() => import('./pages/admin/components/userManage/AdminUserInfo'))
const NotificationPage = React.lazy(() => import('./pages/notification/NotificationPage'));
const EditCodePage = React.lazy(() => import('./pages/editCode/EditCodePage'));
const SearchPage = React.lazy(() => import('./pages/search/SearchPage'));
const PaymentPage = React.lazy(() => import('./pages/payment/PaymentPage'));
const AiBuilderPage = React.lazy(() => import('./pages/aiBuilder/AiBuilderPage'));
const AiBuilderSuggestPage = React.lazy(() => import('./pages/aiBuilder/AiBuilderServicePlanning'));
const AiBuilderRefactoring = React.lazy(() => import('./pages/aiBuilder/AiBuilderRefactoring'));
const SmartAnalysisPage = React.lazy(() => import('./pages/admin/SmartAnalysisPage'));
const AiBuilderRefactoringRisk = React.lazy(() => import('./pages/aiBuilder/AiBuilderRefactoringRisk'));
const RefactoringSuggestionsPage = React.lazy(() => import('./pages/createCode/RefactoringSuggestionsPage'));
const InputCodeInfoPage = React.lazy(() => import('./pages/createCode/InputCodeInfoPage'));
const queryClient = new QueryClient();

export const useOctokit = new Octokit({
	auth: `bearer ${process.env.REACT_APP_GITHUB_TOKEN}`,
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <RecoilRoot>
      <QueryClientProvider client={queryClient}>
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
      <Route path='/reset-password' element={<ResetPasswdPage />}/>
      <Route path='/register' element={<RegisterPage/>}/>
      <Route path='/change-password' element={<ChangePasswdPage/>}/>
      <Route path='/reset-complete' element={<ResetCompletePage/>}/>
      <Route path='/profile/my/purchase' element={<MyPurchaseDataPage/>}/>
      <Route path='/profile/my/liked' element={<LikedDetailDataPage/>}/>
      <Route path='/profile/my/code-page' element={<MyCodeDataPage/>}/>
      <Route path='/profile/my/sale' element={<MySaleDataPage/>}/>
      <Route path='/profile/my/edit' element={<EditMyProfilePage/>}/>
      <Route path='profile/my/cashconfirm' element={<CashConfirmDataPage/>}/>
      {/*<Route path='/profile/my/cashhistory' element={<CashPointHistoryDataPage/>}/>*/}
      <Route path='/create/code' element={<CreateCodePage/>}/>
      <Route path='/admin/coderequest/:userId/:codeId' element={<AdminCodeRequestInfo />} />
      <Route path='/help' element={<HelpPage />} />
      <Route path='/code/:id' element={<CodeInfo/>} />
      <Route path='/code/edit/:id' element={<EditCodePage/>} />
      <Route path='/admin' element={<AdminPage/>}/>
      <Route path='/admin/login' element={<AdminLoginPage/>}/>
      <Route path='/admin/user/:userId' element={<AdminUserInfo />} />
      <Route path='/notification' element={<NotificationPage/>}/>
      <Route path='/code/search' element={<SearchPage />} />
      <Route path='/payment' element={<PaymentPage/>} />
      <Route path='/aibuilder' element={<AiBuilderPage/>} />
      <Route path='/aibuilder/serviceplanning' element={<AiBuilderSuggestPage/>} />
      <Route path='/aibuilder/refactoring' element={<AiBuilderRefactoring/>} />
      <Route path="/admin/codeRequest/:userId/:codeId/smart-analysis" element={<SmartAnalysisPage />} />
      <Route path='/aibuilder/refactoring/risk' element={<AiBuilderRefactoringRisk/>} />
      <Route path='/create/code/refactoring' element={<RefactoringSuggestionsPage />} />
      <Route path= '/create/code/inputinformation' element={<InputCodeInfoPage />} />
      <Route path='/create/code/codesubmission' element={<CodeSubmissionFinalPage />} />

      <Route path='/*' element={<NotFoundPage/>}/>
    
    </Routes>
    </Suspense>
      <ToastContainer
            autoClose={3000}
            hideProgressBar
          />
    </BrowserRouter>
    </QueryClientProvider>
          </RecoilRoot>
  </React.StrictMode>
);


