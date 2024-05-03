import React, { FC , useCallback, useRef, useState, useEffect } from 'react';
import useInput from '../../hooks/useInput';
import styled from '@emotion/styled';
import MainLayout from '../../layout/MainLayout';
import { CenterBox } from '../main/styles';
import { Link, useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogTitle, IconButton ,Card, TextField, Box, Button, Divider} from '@mui/material';
import { EMAIL_EXP } from '../../constants/define';
import { toast } from 'react-toastify';
import { ColorButton } from './styles';
import { MarginHorizontal } from '../../components/styles';


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


const ChangePasswdPage: FC<Props> = () => {


const [inputEmail, onChangeEmail, setInputEmail] = useInput('');
const inputEmailRef = useRef<HTMLInputElement | null>(null);
const inputPwdRef = useRef<HTMLInputElement | null>(null);
const [inputPwd, onChangePwd, setInputPwd] = useInput('');
const navigate = useNavigate();
const onSubmitLoginForm = useCallback(async (e: any) => {
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
if (inputPwd === '' || inputPwd.trim() === '') {
    toast.error('비밀번호를 입력해주세요');
    inputPwdRef.current?.focus();
    return;
}

setInputEmail('');
setInputPwd('');
}, [inputEmail, inputPwd]);

    return (
   <MainLayout>

       <MarginHorizontal size={8} style={{marginTop:24,marginBottom:24,}}>
                    <span style={{ color: '#000000', fontSize: '24px', fontWeight: 'bold' }}>비밀번호 재설정 (준비중..)</span>
                </MarginHorizontal>

    <Card style={{ margin: '8px',borderColor: 'grey', borderWidth:'1px'}} elevation={0} variant='outlined'>
				<form onSubmit={onSubmitLoginForm} style={{paddingTop:'64px',paddingBottom:'64px',paddingRight:'16px',paddingLeft:'16px'}}>
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
					<Box height={16} />
					<div>
						<TextField
                            sx={{
                                width: { sm: 300, md: 400 },
                            }}
							inputRef={inputPwdRef}
							value={inputPwd}
							onChange={onChangePwd}
							fullWidth
							type={'password'}
							placeholder='비밀번호 입력' />
					</div>
					<Box height={64} />
					<ColorButton type={'submit'} sx={{fontSize:'15', width: '100%' }}>로그인</ColorButton>
						</form>
			
				<Box height={16} />

			
				<Box height={64} />
			</Card>
   </MainLayout>
    );
}
export default ChangePasswdPage;