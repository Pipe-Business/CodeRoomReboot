import React, {FC, useCallback, useState} from 'react';

import {Button, Divider, ListItem, ListItemButton, ListItemText} from '@mui/material';
import {useNavigate} from 'react-router-dom';

import useDialogState from '../../../../hooks/useDialogState';
import {reformatTime} from '../../../../utils/DayJsHelper';
import {AdminUserManageEntity} from '../../../../data/entity/AdminUserManageEntity';
import PointSendDialog from '../modal/PointSendDialog';
import AdminMessageDialog from './AdminMessageDialog';

interface Props {
	children?: React.ReactNode;
	item: AdminUserManageEntity;
}

const UserManageItem: FC<Props> = ({ item }) => {
	const navigate = useNavigate();
	const [msgDialogOpen, setMsgDialogOpen] = useState(false);
	const [dialogContent, setDialogContent] = useState('');
	const [isDialog, handleOpenDialog, handleCloseDialog] = useDialogState();
	const onClickItem = useCallback(() => {
		navigate(`/admin/user/${item.user_token}`);

	}, [item]);
	
	return <>
		<ListItem>
			<ListItemButton onClick={onClickItem}>
				<ListItemText>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<div style={{ width: '15%' }}>{reformatTime(item.created_at!)}</div>
						<div style={{ width: '10%' }}>{item.nickname}</div>
						<div style={{ width: '40%' }}>{item.email}</div>
						<div style={{ width: '5%' }}>{item.cash?.toLocaleString()}</div>
						<div style={{ width: '5%' }}>{item.point?.toLocaleString()}</div>
						<div style={{ width: '15%' }}><Button onClick={(e:any)=>{e.stopPropagation();handleOpenDialog()}}>포인트 지급</Button></div>
						<div style={{ width: '10%' }}><Button onClick={(e:any) => {e.stopPropagation();setMsgDialogOpen(true)}}>쪽지 전송</Button></div>
					</div>
				</ListItemText>
			</ListItemButton>
		</ListItem>
		<Divider/>
		<PointSendDialog isOpen={isDialog} onClose={handleCloseDialog} userToken={item.user_token!} userNickname={item.nickname} prevPoint={item.point}/>
		<AdminMessageDialog
        open={msgDialogOpen}
        title={item.nickname+"님에게 보내는 쪽지"}
        content={dialogContent}
        targetUserToken={item.user_token!}
        onClose={() => setMsgDialogOpen(false)}
		showReply={true}
      />
	</>;
};

export default UserManageItem;
;