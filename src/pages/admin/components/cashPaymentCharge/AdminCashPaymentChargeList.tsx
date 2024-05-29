import React, { FC } from 'react';
import { CircularProgress, List, ListItem, ListItemText } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../../api/ApiClient';
import styled from "@emotion/styled"
import AdminCashPaymentChargeItem from './AdminCashPaymentChargeItem';


interface Props {
	children?: React.ReactNode;
	//filter: 'all' | 'payment' | 'supply';
}

export const CenterBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const Header = () => {
	return <ListItem>
		<ListItemText>
			<div style={{ display: 'flex' }}>
				<div style={{ width: '15%' }}>결제일</div>
				{/* <div style={{ width: '5%' }}>충전&관리자 지급</div> */}
				<div style={{ width: '25%' }}>유저이름</div>
				<div style={{ width: '40%' }}>설명</div>
				<div style={{ width: '10%' }}>결재 금액</div>
				<div style={{ width: '10%' }}>캐시</div>
			</div>
		</ListItemText>
	</ListItem>;
};
const AdminCashPaymentChargeList: FC<Props> = () => {
	const { isLoading, data } = useQuery({
		queryKey: ['admin', 'userCashHistory'],
		queryFn: () => apiClient.getAllUserEarnCashHistory()
	});
	if (isLoading) {
		return <CenterBox><CircularProgress /></CenterBox>;
	}
	if (!data) {
		return <>nodata</>;
	}
	return (
		<List>
			<Header />
           {data.map(item => {
            return <AdminCashPaymentChargeItem item={item} />
           })}
			{/* {filter==='all'?
				data.map(item => {
					return <AdminCashPaymentChargeItem item={item} />
				}):data.map(item => {
				if (item.cash_history_type === filter) {
					return <AdminCashPaymentChargeItem item={item} />;
				}
			})} */}
		</List>
	);
};

export default AdminCashPaymentChargeList;