import React, { FC } from 'react';
import { CircularProgress, List, ListItem, ListItemText } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import {apiClient} from "../../../../api/ApiClient";
import styled from "@emotion/styled"
import AdminCashItem from './AdminCashItem';
import AdminPointItem from './AdminCashItem copy';


interface Props {
	children?: React.ReactNode;
	type: 'cash' | 'point';
}

export const CenterBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const Header: FC<{ type: 'cash' | 'point' }> = ({ type }) => {
	if (type === 'cash') {
		return (
			<ListItem>
				<ListItemText>
					<div style={{ display: 'flex' }}>
						<div style={{ width: '15%' }}>날짜</div>
						<div style={{ width: '25%' }}>유저</div>
						<div style={{ width: '40%' }}>설명</div>
						<div style={{ width: '10%' }}>캐시</div>
						<div style={{ width: '10%' }}>구분</div>
					</div>
				</ListItemText>
			</ListItem>
		);
	} else {
		return (
			<ListItem>
				<ListItemText>
					<div style={{ display: 'flex' }}>
						<div style={{ width: '15%' }}>날짜</div>
						<div style={{ width: '25%' }}>유저</div>
						<div style={{ width: '40%' }}>설명</div>
						<div style={{ width: '10%' }}>코인</div>
						<div style={{ width: '10%' }}>구분</div>
					</div>
				</ListItemText>
			</ListItem>
		);
	}
}
const AdminCashPointList: FC<Props> = ({ type }) => {
	const { isLoading:isCashLoading, data: cashData } = useQuery({
		queryKey: ['admin', 'userCashHistory'],
		queryFn: () => apiClient.getAllUserCashHistory()
	});

	const { isLoading:isPointLoading, data: pointData } = useQuery({
		queryKey: ['admin', 'userPointHistory'],
		queryFn: () => apiClient.getAllUserPointHistory()
	});
	if (isCashLoading || isPointLoading) {
		return <CenterBox><CircularProgress /></CenterBox>;
	}
	if (!cashData || !pointData) {
		return <>nodata</>;
	}
	if(type ==='cash'){
		return (
			<List>	
				<Header type={type} />
				{ type ==='cash' && 
				cashData.map(item => {
					return <AdminCashItem item={item} key={item.id}/>
				})}
			</List>
		);
	}else{
		return (
			<List>
				<Header type={type} />
				{ type ==='point' && 
				pointData.map(item => {
					return <AdminPointItem item={item} key={item.id}/>
				})}
			
			</List>
		);
	}
	
};

export default AdminCashPointList;