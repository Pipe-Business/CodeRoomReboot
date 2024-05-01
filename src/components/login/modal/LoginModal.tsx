import React, { FC , useCallback, useRef } from 'react';
import useInput from '../../../hooks/useInput.ts';
import { EMAIL_EXP } from '../../../constants/define.ts'
import { Dialog, DialogContent, DialogTitle, IconButton ,Card, TextField, Box, Button, Divider} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
//import { useQueryUserLogin } from '../../../hooks/fetcher/UserFetcher.ts';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import PasswordIcon from '@mui/icons-material/Email';
import { toast } from 'react-toastify';
import { apiClient } from '../../../api/ApiClient.ts';
import { ColorButton } from '../../styles.ts';
import { User } from '@supabase/supabase-js';

interface Props {
	children?: React.ReactNode;
	isOpen: boolean,
	onClose: () => void
}

const LoginModal: FC<Props> = ({ isOpen, onClose }) => {
	//const { userLogin } = useQueryUserLogin();
	// if(userLogin){
	// 	onClose();
	// 	return <></>;
	// }
	const [inputEmail, onChangeEmail, setInputEmail] = useInput('');
	const inputEmailRef = useRef<HTMLInputElement | null>(null);
	const inputPwdRef = useRef<HTMLInputElement | null>(null);
	const [inputPwd, onChangePwd, setInputPwd] = useInput('');

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
		// if (!(await apiClient.userExistByEmail(inputEmail))) {
		// 	alert('등록된 회원이 아닙니다.');
		// 	navigate('/register');
		// 	return;
		// }
		const result = await apiClient.loginWithEmail(inputEmail, inputPwd);
			
		if(typeof result == "object"){
			const user:User = result as User;
			console.log("user info:"+user.id);
		}else{
			toast.error('회원 정보가 없습니다.');
		}

		setInputEmail('');
		setInputPwd('');
	}, [inputEmail, inputPwd]);
	return (
		<Dialog open={isOpen} onClose={onClose} fullWidth maxWidth={'xs'}>
			<DialogTitle  >
				<div style={{display:'flex', justifyContent:"space-between", alignItems:'center'}}>
					<h2>로그인/회원가입</h2>
					<IconButton onClick={onClose}>
						<CloseIcon/>
					</IconButton>
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
					<ColorButton type={'submit'} sx={{fontSize:'15', width: '100%' }}>로그인</ColorButton>
						</form>
			
				<Box height={16} />
				<div style={{ width: '100%' }}>
					<Link style={{ width: '100%' }} to={'/register'}>
						<Button
							sx={{
								fontSize: '15px',
								width: '100%',
								backgroundColor: 'black',
								':hover': { backgroundColor: 'grey' },
							}}
							variant='contained'>회원가입</Button>
					</Link>
				</div>
				<Box height={16} />
			</Card>
			</DialogContent>
		</Dialog>
	);
};

export default LoginModal;