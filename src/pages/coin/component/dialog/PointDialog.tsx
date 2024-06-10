import React, { FC } from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import PointData from '../PointData';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
	children?: React.ReactNode;
    isOpen:boolean,
	onClose:()=>void
}

const PointDialog: FC<Props> = ({isOpen,onClose}) => {
	return (
		<Dialog open={isOpen} onClose={onClose} >
			<DialogTitle style={{display:'flex'}} justifyContent={'space-between'} alignItems={'center'}>
				<h2>캐시 충전</h2>
				<IconButton onClick={onClose}>
					<CloseIcon style={{fontSize:"35px"}}/>
				</IconButton>
			</DialogTitle>
			<DialogContent >
				<PointData/>
			</DialogContent>
		</Dialog>
	);
};

export default PointDialog;