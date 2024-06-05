import React, { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CircularProgress, List, ListItem, ListItemText } from '@mui/material';
import UserManageItem from './UserManageItem.tsx';
import { apiClient } from '../../../../api/ApiClient.ts';

interface Props {
	children?: React.ReactNode;
}

const UserManageHeader: FC = () => {
	return <ListItem>
		<ListItemText>
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<div style={{ width: '15%' }}>가입날짜</div>
				<div style={{ width: '10%' }}>닉네임</div>
				<div style={{ width: '40%' }}>이메일</div>
				<div style={{ width: '5%' }}>캐시</div>
				<div style={{ width: '5%' }}>포인트</div>
				<div style={{ width: '15%' }}>포인트지급</div>
				<div style={{ width: '10%' }}>쪽지보내기</div>
			</div>
		</ListItemText>
	</ListItem>;
};

const UserManageList: FC<Props> = () => {
	const { isLoading, data } = useQuery({
		queryKey: ['admin', 'users'],
		queryFn: () => apiClient.getAllUserManage(),
	});
	if (isLoading) {
		return <CircularProgress />;
	}
	if (!data) {
		return <>no data</>;
	}
	return (
		<List>
			<UserManageHeader/>
			{data.map(item=>{
				return <UserManageItem key={item.id}  item={item}/>

			})}


		</List>
	);
};

export default UserManageList;