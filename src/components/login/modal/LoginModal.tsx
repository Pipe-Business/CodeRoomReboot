import React, { FC, useCallback, useMemo, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User } from '@supabase/supabase-js';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Card, Dialog, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';

import { apiClient } from "../../../api/ApiClient";
import localApi from '../../../api/local/LocalApi';
import { EMAIL_EXP, REACT_QUERY_KEY } from "../../../constants/define";
import useInput from '../../../hooks/UseInput';
import { ColorButton, TextButton } from '../../styles';

interface Props {
	children?: React.ReactNode;
	isOpen: boolean;
	onClose: () => void;
}

const LoginModal: FC<Props> = ({ isOpen, onClose }) => {
	const queryClient = useQueryClient();
	const [inputEmail, onChangeEmail, setInputEmail] = useInput('');
	const [inputPwd, onChangePwd, setInputPwd] = useInput('');
	const inputEmailRef = useRef<HTMLInputElement>(null);
	const inputPwdRef = useRef<HTMLInputElement>(null);
	const navigate = useNavigate();
	const location = useLocation();

	const showCloseIcon = useMemo(() => {
		const hideCloseIconPatterns = [/^\/code\/\d+/];
		return !hideCloseIconPatterns.some(pattern => pattern.test(location.pathname));
	}, [location.pathname]);

	const onSubmitLoginForm = useCallback(async (e: React.FormEvent) => {
		e.preventDefault();
		if (inputEmail.trim() === '') {
			toast.error('이메일을 입력해주세요');
			inputEmailRef.current?.focus();
			return;
		}
		if (!EMAIL_EXP.test(inputEmail)) {
			toast.error('이메일 양식에 맞게 입력해주세요');
			inputEmailRef.current?.focus();
			return;
		}
		if (inputPwd.trim() === '') {
			toast.error('비밀번호를 입력해주세요');
			inputPwdRef.current?.focus();
			return;
		}

		try {
			const result = await apiClient.loginWithEmail(inputEmail, inputPwd);
			if (typeof result === "object") {
				const user: User = result as User;
				localApi.saveUserToken(user.id);
				const getUserById = await apiClient.getTargetUser(user.id);
				queryClient.setQueryData([REACT_QUERY_KEY.login], () => getUserById);
				onClose();
				navigate(0);
			} else {
				toast.error('회원 정보가 없습니다.');
			}
		} catch (error) {
			toast.error('로그인 중 오류가 발생했습니다.');
		}

		setInputEmail('');
		setInputPwd('');
	}, [inputEmail, inputPwd, navigate, onClose, queryClient]);

	const inputStyle = {
		fontSize: '16px',  // 텍스트 크기를 16px로 증가
	};

	return (
		<Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs">
			<DialogTitle style={{ padding: '16px 24px 0' }}>
				<Box display="flex" justifyContent="space-between" alignItems="flex-start">
					<Box>
						<h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>코드룸 서비스 로그인</h2>
						<p style={{ fontSize: '0.875rem', color: '#666' }}>지금 로그인하고 코드를 거래하세요</p>
					</Box>
					{showCloseIcon && (
						<IconButton
							onClick={onClose}
							style={{ padding: '8px', marginTop: '16px', marginRight: '8px' }}
						>
							<CloseIcon />
						</IconButton>
					)}
				</Box>
			</DialogTitle>
			<DialogContent style={{ paddingTop: '24px' }}>
				<Card style={{ padding: '16px' }} elevation={0}>
					<form onSubmit={onSubmitLoginForm}>
						<Box mb={2}>
							<TextField
								inputRef={inputEmailRef}
								value={inputEmail}
								onChange={onChangeEmail}
								fullWidth
								placeholder="이메일 입력"
								variant="outlined"
								InputProps={{
									style: { ...inputStyle, padding: '0px 0px' }  // 패딩 약간 증가
								}}
								inputProps={{
									style: inputStyle
								}}
							/>
						</Box>
						<Box mb={3}>
							<TextField
								inputRef={inputPwdRef}
								value={inputPwd}
								onChange={onChangePwd}
								fullWidth
								type="password"
								placeholder="비밀번호 입력"
								variant="outlined"
								InputProps={{
									style: { ...inputStyle, padding: '0px 0px' }  // 패딩 약간 증가
								}}
								inputProps={{
									style: inputStyle
								}}
							/>
						</Box>
						<ColorButton type="submit" fullWidth style={{ fontSize: '16px', padding: '12px 0' }}>
							로그인
						</ColorButton>
					</form>
					<Box mt={2} display="flex" justifyContent="space-between">
						<Link to="/reset-password" style={{ textDecoration: 'none' }}>
							<TextButton style={{ fontSize: '14px', color: '#666' }}>비밀번호 찾기</TextButton>
						</Link>
						<Link to="/register" style={{ textDecoration: 'none' }}>
							<TextButton style={{ fontSize: '14px', color: '#666' }}>회원가입</TextButton>
						</Link>
					</Box>
				</Card>
			</DialogContent>
		</Dialog>
	);
};
export default LoginModal;