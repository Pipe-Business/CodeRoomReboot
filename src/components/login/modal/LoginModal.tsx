import CloseIcon from '@mui/icons-material/Close';
import { Box, Card, Dialog, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import { User } from '@supabase/supabase-js';
import React, {FC, useCallback, useMemo, useRef} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {apiClient} from "../../../api/ApiClient";
import localApi from '../../../api/local/LocalApi';
import {EMAIL_EXP, REACT_QUERY_KEY} from "../../../constants/define";
import useInput from '../../../hooks/UseInput';
import { ColorButton, TextButton } from '../../styles';

import { useQueryClient } from '@tanstack/react-query';

interface Props {
	children?: React.ReactNode;
	isOpen: boolean,
	onClose: () => void
}

const LoginModal: FC<Props> = ({ isOpen, onClose }) => {
	const queryClient = useQueryClient();

	const [inputEmail, onChangeEmail, setInputEmail] = useInput('');
	const inputEmailRef = useRef<HTMLInputElement | null>(null);
	const inputPwdRef = useRef<HTMLInputElement | null>(null);
	const [inputPwd, onChangePwd, setInputPwd] = useInput('');
	const navigate = useNavigate();
	const location = useLocation();

	const showCloseIcon = useMemo(() => {
		// CloseIcon을 숨길 경로 패턴들을 여기에 추가하세요
		const hideCloseIconPatterns = [
			/^\/code\/\d+/  // /code/ 뒤에 숫자가 오는 모든 경로
		];
		return !hideCloseIconPatterns.some(pattern => pattern.test(location.pathname));
	}, [location.pathname]);

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
	
	
	
		const result = await apiClient.loginWithEmail(inputEmail, inputPwd);
		const currentPath = location.pathname;

		if(typeof result == "object"){ // 유저 정보가 있으면
			const user:User = result as User;
			console.log("user info:"+user.id);
			localApi.saveUserToken(user.id);
			const getUserById = await apiClient.getTargetUser(user.id);
			queryClient.setQueryData([REACT_QUERY_KEY.login], () => {
					return getUserById;
				});
			onClose();
			
			// if(currentPath == '/'){
			// 	navigate(0);
			// }
			// navigate('/');

			// refresh page
			navigate(0);

		}else{
			toast.error('회원 정보가 없습니다.');
		}

		setInputEmail('');
		setInputPwd('');
		
	}, [inputEmail, inputPwd]);

	const handleClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
		if (reason !== 'backdropClick') {
			onClose();
		}
	};

	return (
		<Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth={'xs'} disableEscapeKeyDown>
			<DialogTitle>
				<div style={{display:'flex', justifyContent:"space-between", alignItems:'center'}}>
					<h3>지금 로그인하고 코드를 거래하세요</h3>
					{showCloseIcon && (
						<IconButton onClick={onClose}>
							<CloseIcon/>
						</IconButton>
					)}
				</div>
			</DialogTitle>
			<DialogContent>

			<Card style={{ margin: '8px',}} elevation={0}>
				<form onSubmit={onSubmitLoginForm}>
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
					<ColorButton type={'submit'} sx={{fontSize:'20px', width: '100%' }}>로그인</ColorButton>
						</form>
			
				<Box height={16} />

				<div style={{display:'flex', justifyContent:'space-between', width: '100%', alignItems:'end' }}>
				<Link to={'/reset-password'}>
						<TextButton type={'submit'} sx={{fontSize:'16px'}}>비밀번호 찾기</TextButton>
						</Link>
					<Link to={'/register'}>
						<TextButton type={'submit'} sx={{fontSize:'16px'}}>회원가입</TextButton>
						</Link>
				</div>
				<Box height={64} />
			</Card>
			</DialogContent>
		</Dialog>
	);
};

export default LoginModal;