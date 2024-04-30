import React, { FC } from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton ,Card, TextField, Box, Button, Divider} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
//import Login from '../Login.tsx';
//import { useQueryUserLogin } from '../../../hooks/fetcher/UserFetcher.ts';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import PasswordIcon from '@mui/icons-material/Email';

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

			<Card style={{ margin: '16px', padding: '16px' }} elevation={3}>
				{/*<form onSubmit={onSubmitLoginForm}>
					<div>
						<TextField
							inputRef={inputEmailRef}
							value={inputEmail}
							type={'text'}
							autoFocus

							onChange={onChangeEmail}
							fullWidth
							InputProps={{
								endAdornment: <span style={{ display: 'flex', alignItems: 'center' }}><EmailIcon
									style={{ fill: '#999' }} /></span>,
							}}
							placeholder='이메일 입력' />
					</div>
					<Box height={8} />
					<div>
						<TextField
							inputRef={inputPwdRef}
							value={inputPwd}
							onChange={onChangePwd}
							fullWidth
							type={'password'}
							InputProps={{
								endAdornment: <span style={{ display: 'flex', alignItems: 'center' }}><PasswordIcon
									style={{ fill: '#999' }} /></span>,
							}}
							placeholder='비밀번호 입력' />
					</div>
					<Box height={8} />
					<Button type={'submit'} sx={{ fontSize: '25px', width: '100%' }} variant='contained'>로그인</Button>
						</form>*/}
				<Box height={16} />
				<Divider />
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