import React, { FC, useCallback } from 'react';

import { Button, Divider, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import useDialogState from '../../../../hooks/useDialogState.ts';
import { reformatTime } from '../../../../utils/DayJsHelper.ts';
import { UserModel } from '../../../../data/model/UserModel.ts';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../../api/ApiClient.ts';
import { AdminUserManageEntity } from '../../../../data/entity/AdminUserManageEntity.ts';
import PointSendDialog from '../modal/PointSendDialog.tsx';

interface Props {
	children?: React.ReactNode;
	item: AdminUserManageEntity;
}

const UserManageItem: FC<Props> = ({ item }) => {
	const navigate = useNavigate();
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
						<div style={{ width: '10%' }}>{item.cash?.toLocaleString()}</div>
						<div style={{ width: '10%' }}>{item.point?.toLocaleString()}</div>
						<div style={{ width: '15%' }}><Button onClick={(e:any)=>{e.stopPropagation();handleOpenDialog()}}>포인트 지급</Button></div>
					</div>
				</ListItemText>
			</ListItemButton>
		</ListItem>
		<Divider/>
		<PointSendDialog isOpen={isDialog} onClose={handleCloseDialog} userToken={item.user_token!} userNickname={item.nickname} prevPoint={item.point}/>
	</>;
};

export default UserManageItem;
;