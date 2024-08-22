import React, {FC, useCallback, useRef} from 'react';
import useInput from '../../hooks/UseInput';
import styled from '@emotion/styled';
import MainLayout from '../../layout/MainLayout';
import {useNavigate} from 'react-router-dom';
import {Box, Card, TextField} from '@mui/material';
import {EMAIL_EXP} from '../../constants/define';
import {toast} from 'react-toastify';
import {MyPageTabPageBtn} from './styles';
import {MarginHorizontal} from '../../components/styles';
import {apiClient} from '../../api/ApiClient';


interface Props {
	children?: React.ReactNode;
}
const CardSection = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;
const CenterWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;


const ResetPasswdPage: FC<Props> = () => {


const [inputEmail, onChangeEmail, setInputEmail] = useInput('');
const inputEmailRef = useRef<HTMLInputElement | null>(null);
const navigate = useNavigate();
const onSubmitEmailForm = useCallback(async (e: any) => {
e.preventDefault();
if (inputEmail === '' || inputEmail.trim() === '') {
    toast.error('이메일을 입력해주세요');
    inputEmailRef.current?.focus();
    return;
}
if (!EMAIL_EXP.test(inputEmail)) {
    toast.error('이메일 양식에 맞게 입력해주세요');
    inputEmailRef.current?.focus();
    return;

}

setInputEmail('');
    apiClient.resetPasswordByEmail(inputEmail);
    navigate('/reset-complete');
}, [inputEmail]);

    return (
   <MainLayout>

       <MarginHorizontal size={8} style={{marginTop:24,marginBottom:24,}}>
                    <span style={{ color: '#000000', fontSize: '24px', fontWeight: 'bold' }}>비밀번호 초기화</span>
                </MarginHorizontal>

                <MarginHorizontal size={8} style={{marginTop:16,marginBottom:16,}}>
                    <span style={{ color: '#000000', fontSize: '16px', fontWeight: 'bold' }}>비밀번호 초기화가 필요한 이메일을 입력해주세요</span>
                </MarginHorizontal>

    <Card style={{ margin: '8px',borderColor: 'grey', borderWidth:'1px'}} elevation={0}>
				<form onSubmit={onSubmitEmailForm} style={{paddingTop:'64px',paddingBottom:'64px',paddingRight:'16px',paddingLeft:'16px'}}>
					<div>
						<TextField
                            sx={{
                                width: { sm: 300, md: 400 },
                            }}
							inputRef={inputEmailRef}
							value={inputEmail}
							type={'text'}
							autoFocus

							onChange={onChangeEmail}
							fullWidth
							placeholder='이메일 입력' />
					</div>
					<Box height={64} />
					<MyPageTabPageBtn type={'submit'} sx={{fontSize:'18px', width: '100%' }}>비밀번호 초기화</MyPageTabPageBtn>
						</form>
			
				<Box height={16} />

			
				<Box height={64} />
			</Card>
   </MainLayout>
    );
}
export default ResetPasswdPage;