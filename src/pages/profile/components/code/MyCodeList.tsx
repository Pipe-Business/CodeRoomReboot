import React, { FC } from 'react';
import { Divider, List, ListItem, ListItemText } from '@mui/material';
import CodePendingItem from './CodePendingItem.tsx';
import { CodeModel } from '../../../../data/model/CodeModel.ts';

interface Props {
	children?: React.ReactNode;
	maxCount: boolean,
	type: 'pending' | 'rejected' | 'approve',
	data?: CodeModel[] | null
}

export type RequestColumn = {
	requestAt: string,
	codeTitle: string,
	requestType: 'pending' | 'rejected' | 'approve',
}


const RequestHeaderPending: FC = () => {
	return <ListItem>
		<ListItemText>
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<div style={{ width: '25%' ,fontWeight:'bold'}}>요청시간</div>
				<div style={{ width: '50%' ,fontWeight:'bold'}}>코드제목</div>
				<div style={{ width: '25%' ,fontWeight:'bold'}}>상태</div>
			</div>
		</ListItemText>

	</ListItem>;
};
const RequestHeaderReject: FC = () => {
	return <ListItem>
		<ListItemText>
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<div style={{ width: '25%' ,fontWeight:'bold'}}>반려시간</div>
				<div style={{ width: '25%' ,fontWeight:'bold'}}>코드제목</div>
				<div style={{ width: '20%' ,fontWeight:'bold'}}>상태</div>
				<div style={{ width: '30%' ,fontWeight:'bold'}}></div>
			</div>
		</ListItemText>

	</ListItem>;
};

const RequestHeaderApprove: FC = () => {
	return <ListItem>
		<ListItemText>
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<div style={{ width: '25%' ,fontWeight:'bold'}}>승인시간</div>
				<div style={{ width: '25%' ,fontWeight:'bold'}}>코드제목</div>
				<div style={{ width: '20%' ,fontWeight:'bold'}}>상태</div>
				<div style={{ width: '30%' ,fontWeight:'bold'}}></div>
			</div>
		</ListItemText>

	</ListItem>;
};

const MyCodeList: FC<Props> = ({ maxCount, type, data }) => {
	if (!data) {
		return <>데이터가 없습니다.</>;
	}
	return (
		<List>
			{type==='pending'?
				<RequestHeaderPending  />
				: type === 'approve' ? 
				<RequestHeaderApprove /> 
				:
				<RequestHeaderReject />
			}
			<Divider />
			{maxCount ?
				data.slice(0, 3).map(item => {
					if (type === item.state) {
						return <CodePendingItem key={item.id} item={item} />;
					}

				}) :
				data.map(item => {
					if (type === item.state) {
						return <CodePendingItem key={item.id} item={item} />;
					}

				})
			}

		</List>
	);
};

export default MyCodeList;