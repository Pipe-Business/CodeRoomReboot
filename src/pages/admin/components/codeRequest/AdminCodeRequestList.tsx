import React, { FC } from 'react';
import { Divider, List, ListItem, ListItemText } from '@mui/material';
import AdminCodeRequestItem from './AdminCodeRequestItem';
import { useQuery } from '@tanstack/react-query';
import {apiClient} from "../../../../api/ApiClient";
import {PostStateType} from "../../../../enums/PostStateType";

interface Props {
	children?: React.ReactNode;
	type: PostStateType.pending | PostStateType.rejected | PostStateType.approve;
}

const CodeRequestHeader: FC<{ type: PostStateType.pending | PostStateType.rejected | PostStateType.approve }> = ({ type }) => {
	return <ListItem>
		<ListItemText>
			<div style={{ display: 'flex' }}>
				<div style={{ width: '15%' }}>{type === PostStateType.pending ? '요청' : type === PostStateType.rejected ? '반려' : '승인'}시간</div>
				<div style={{ width: '5%' }}>코드&글</div>
				<div style={{ width: '30%' }}>게시자</div>
				<div style={{ width: '30%' }}>코드제목</div>
				<div style={{ width: '15%' }}>캐시</div>
				<div style={{ width: '5%' }}>요청상태</div>
			</div>
		</ListItemText>
	</ListItem>;
};

const AdminCodeRequestList: FC<Props> = ({ type }) => {
	const {isLoading,data} = useQuery({
		queryKey:['codeRequest','admin',type],
		queryFn:()=> apiClient.getAllPendingCode(type)
	})
	if(isLoading){
		return <></>
	}
	if(!data){
		return <></>
	}
	return (
		<List>
			<CodeRequestHeader type={type}/>
			<Divider/>
			{data.map(item=>{
				if(item.state===type){
					return <>
					<AdminCodeRequestItem key={item.id} item={item}/>
						<Divider/>
					</>
				}
			})}
		</List>
	);
};

export default AdminCodeRequestList;