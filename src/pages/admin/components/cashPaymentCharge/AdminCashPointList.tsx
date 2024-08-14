import React, { FC } from 'react';
import { CircularProgress, List, ListItem, ListItemText } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import {apiClient} from "../../../../api/ApiClient";
import styled from "@emotion/styled"
import AdminCashItem from './AdminCashItem';
import CoinHistoryItem from "../../../profile/components/CoinHistoryData/CoinHistoryItem";


interface Props {
	children?: React.ReactNode;
	type: 'cash' | 'coin';
}

export const CenterBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const Header: FC<{ type: 'cash' | 'coin' }> = ({ type }) => {
	if (type === 'cash') { // TODO 결제내역 리스트
		return (
			<ListItem>
				<ListItemText>
					<div style={{display: 'flex'}}>
						<div style={{width: '20%'}}>구매날짜</div>
						<div style={{width: '25%'}}>상품명</div>
						<div style={{width: '10%'}}>가격</div>
						<div style={{width: '10%'}}>결제방식</div>
						<div style={{width: '30%'}}>영수증 url</div>
					</div>
				</ListItemText>
			</ListItem>
		);
	} else {
		return ( // TODO 코인
			<ListItem>
				<ListItemText>
					<div style={{ display: 'flex' }}>
						<div style={{ width: '15%' }}>날짜</div>
						<div style={{ width: '20%' }}>유저</div>
						<div style={{ width: '40%' }}>설명</div>
						<div style={{ width: '15%' }}>코인</div>
						<div style={{ width: '10%' }}>구분</div>
					</div>
				</ListItemText>
			</ListItem>
		);
	}
}
const AdminCashPointList: FC<Props> = ({ type }) => {
	const { isLoading:isBootpayLoading, data: bootpayData } = useQuery({
		queryKey: ['admin', 'bootpay'],
		queryFn: () => apiClient.getAllBootpayPayment()
	});

	const { isLoading:isCoinLoading, data: coinData } = useQuery({
		queryKey: ['admin', 'userCoinHistory'],
		queryFn: () => apiClient.getAllUserCoinHistory()
	});

	if (isBootpayLoading) {
		return <CenterBox><CircularProgress /></CenterBox>;
	}

	if (!bootpayData || !coinData) {
		return <>nodata</>;
	}
	if(type ==='cash'){
		return (
			<List>
				<Header type={type} />
				{ type ==='cash' &&
					bootpayData!.map(item => {
					return <AdminCashItem item={item} key={item.id}/>
				})}
			</List>
		);
	}else{
		return (
			<List>
				<Header type={type} />
				{ type ==='coin' &&
				coinData.map(item => {
					return <CoinHistoryItem coinHistoryData={item} key={item.id}/>
				})}

			</List>
		);
	}
	
};

export default AdminCashPointList;