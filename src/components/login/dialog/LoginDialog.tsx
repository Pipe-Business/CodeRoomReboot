import React, { FC } from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
//import Login from '../Login.tsx';
//import { useQueryUserLogin } from '../../../hooks/fetcher/UserFetcher.ts';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
	children?: React.ReactNode;
	isOpen: boolean,
	onClose: () => void
}

const LoginDialog: FC<Props> = ({ isOpen, onClose }) => {
	//const { userLogin } = useQueryUserLogin();
	// if(userLogin){
	// 	onClose();
	// 	return <></>;
	// }
	return (
		<Dialog open={isOpen} onClose={onClose} fullWidth maxWidth={'lg'}>
			<DialogTitle  >
				<div style={{display:'flex', justifyContent:"space-between", alignItems:'center'}}>
					<h2>로그인/회원가입</h2>
					<IconButton onClick={onClose}>
						<CloseIcon/>
					</IconButton>
				</div>
			</DialogTitle>
			<DialogContent>
				{/*<Login />*/}
			</DialogContent>
		</Dialog>
	);
};

export default LoginDialog;