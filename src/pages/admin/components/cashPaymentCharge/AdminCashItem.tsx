import React, {FC} from 'react';
import {Divider, ListItem, ListItemText} from '@mui/material';
import {reformatTime} from "../../../../utils/DayJsHelper";
import {useQueryUserById} from "../../../../hooks/fetcher/UserFetcher";
import UserProfileImage from '../../../../components/profile/UserProfileImage';
import {CashHistoryType} from '../../../../enums/CashHistoryType';

interface Props {
	children?: React.ReactNode;
	//item: CashHistoryResponseEntity;
}

const AdminCashItem: FC<Props> = () => {
	// const { isLoadingUserById, userById } = useQueryUserById(item.user_token);
	// if (isLoadingUserById) {
	// 	return <>loading</>;
	// }
	// if (!userById) {
	// 	return null;
	// }
		return <>
		{/*<ListItem>*/}
		{/*	<ListItemText>*/}
		{/*		<div style={{ display: 'flex' }}>*/}
		{/*			<div style={{ width: '15%' }}>{reformatTime(item?.created_at!)}</div>*/}
		{/*			<div style={{ width: '25%' }}>*/}
		{/*				<div style={{ display: 'flex' }}>*/}
		{/*					<UserProfileImage userId={userById.user_token!} />*/}
		{/*					<div>*/}
		{/*						<div>{userById.nickname}</div>*/}
		{/*						<div>{userById.email}</div>*/}
		{/*					</div>*/}
		{/*				</div>*/}
		{/*			</div>*/}
		{/*			<div style={{ width: '40%' }}>{item.description}</div>*/}
		{/*			<div style={{ width: '10%' }}>{item.cash.toLocaleString()}캐시</div>*/}
		{/*			<div style={{ width: '10%' }}>{item.cash_history_type == CashHistoryType.earn_cash? "충전" : "사용"}</div>*/}
		{/*		</div>*/}
		{/*	</ListItemText>*/}
		{/*</ListItem>*/}
		{/*<Divider />*/}
	</>;
};

export default AdminCashItem;