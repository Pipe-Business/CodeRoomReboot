import React, {FC} from 'react';
import {Divider, ListItem, ListItemText} from '@mui/material';
import {reformatTime} from "../../../../utils/DayJsHelper";
import {useQueryUserById} from "../../../../hooks/fetcher/UserFetcher";
import UserProfileImage from '../../../../components/profile/UserProfileImage';
import {PointHistoryType} from "../../../../enums/PointHistoryType";
import {PointHistoryResponseEntity} from "../../../../data/entity/PointHistoryResponseEntity";

interface Props {
	children?: React.ReactNode;
	item: PointHistoryResponseEntity;
}

const AdminPointItem: FC<Props> = ({ item }) => {
	const { isLoadingUserById, userById } = useQueryUserById(item.user_token);
	if (isLoadingUserById) {
		return <>loading</>;
	}
	if (!userById) {
		return null;
	}
		return <>
		<ListItem>
			<ListItemText>
				<div style={{ display: 'flex' }}>
					<div style={{ width: '15%' }}>{reformatTime(item?.created_at!)}</div>
					{/* <div style={{ width: '5%' }}>{item?.cash_history_type === 'earn_cash' ? '결제' : '사용'}</div> */}
					<div style={{ width: '25%' }}>
						<div style={{ display: 'flex' }}>
							<UserProfileImage userId={userById.user_token!} />
							<div>
								<div>{userById.nickname}</div>
								<div>{userById.email}</div>
							</div>
						</div>
					</div>
					<div style={{ width: '40%' }}>{item.description}</div>
					<div style={{ width: '10%' }}>{item.point.toLocaleString()}코인</div>
					<div style={{ width: '10%' }}>{item.point_history_type == PointHistoryType.earn_point? "획득" : "사용"}</div>
				</div>
			</ListItemText>
		</ListItem>
		<Divider />
	</>;
};

export default AdminPointItem;