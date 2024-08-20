
import { Box, Card, TextField } from '@mui/material';
import { User } from '@supabase/supabase-js';
import React, { FC, useCallback, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiClient } from '../../api/ApiClient';
import { EMAIL_EXP } from '../../constants/define';
import useInput from '../../hooks/UseInput';
import { ColorButton } from './styles';
import { useQueryClient } from '@tanstack/react-query';
import { REACT_QUERY_KEY } from '../../constants/define';
import localApi from '../../api/local/LocalApi';

interface Props {
	children?: React.ReactNode;
}

const AdminLoginPage: FC<Props> = () => {
const [inputEmail, onChangeEmail, setInputEmail] = useInput('');
const inputEmailRef = useRef<HTMLInputElement | null>(null);
const inputPwdRef = useRef<HTMLInputElement | null>(null);
const [inputPwd, onChangePwd, setInputPwd] = useInput('');
const navigate = useNavigate();
const location = useLocation();
const queryClient = useQueryClient();

useEffect(() => {
    localApi.removeUserToken();
    queryClient.setQueryData([REACT_QUERY_KEY.login], null);
    apiClient.signOut();
},[]);

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

        if (inputEmail != 'coderoom@pipebuilder.com' || inputPwd != '7777777'){
            toast.error('권한이 없습니다.');
            return;
        }
	

	
		const result = await apiClient.loginWithEmail(inputEmail, inputPwd);
		const currentPath = location.pathname;

		if(typeof result == "object"){ // 유저 정보가 있으면
			navigate('/admin');

		}else{
			toast.error('회원 정보가 없습니다.');
		}

		setInputEmail('');
		setInputPwd('');
		
	}, [inputEmail, inputPwd]);

    return (
        <div style={{display:'grid', placeItems : 'center', minHeight:'70vh',}}>
        <Box height={32} />
        <Card style={{ margin: '8px',}} elevation={0} sx={{width: { sm: 300, md: 400 }} }>
        <form onSubmit={onSubmitLoginForm}>
        <h3 style={{ color: '#000000', fontFamily: 'sans-serif' }}>코드룸 관리자 콘솔</h3>
            <div>
                <TextField
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
                    inputRef={inputPwdRef}
                    value={inputPwd}
                    onChange={onChangePwd}
                    fullWidth
                    type={'password'}
                    placeholder='비밀번호 입력' />
            </div>
            <Box height={32} />
            <ColorButton type={'submit'} sx={{fontSize:'20px', width: '100%', backgroundColor:'#000000' }}>로그인</ColorButton>
                </form>
        
        <Box height={16} />
        
        </Card> 
        </div>
    );
};

export default AdminLoginPage;

