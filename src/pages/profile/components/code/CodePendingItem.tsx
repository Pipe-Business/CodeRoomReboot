import React, { FC, useCallback } from 'react';

import { useQuery } from '@tanstack/react-query';

import { Button, ListItem, ListItemText } from '@mui/material';
import { CodeModel } from '../../../../data/model/CodeModel.ts';
import { useNavigate } from 'react-router-dom';
import { reformatTime } from '../../../../utils/DayJsHelper.ts';
import { REACT_QUERY_KEY } from '../../../../constants/define.ts';
import { apiClient } from '../../../../api/ApiClient.ts';


interface Props {
	children?: React.ReactNode;
	item: CodeModel;
}

const CodePendingItem: FC<Props> = ({ item }) => {
	// const { isLoading, data } = useQuery({
	// 	queryKey: [REACT_QUERY_KEY.code],
	// 	queryFn: () => apiClient.getTargetCode(item.id),
	// });
	const navigate = useNavigate();
	const onClickNavigateRejectForm = () => {}
	// const onClickNavigateRejectForm = useCallback((codeReqId: string) => {
	// 	if (data?.formType === 'code') {
	// 		navigate('/create/code', { state: { codeReqId: codeReqId, rejectMessage: data.rejectMessage } });
	// 	} else if(data?.formType==='article') {
	// 		navigate('/create/article', { state: { codeReqId: codeReqId, rejectMessage: data.rejectMessage } });
	// 	}
	// }, [data?.formType]);
	// if (isLoading) {
	// 	return <>loading</>;
	// }
	// if (!data) {
	// 	return <></>;
	// }
	return (
		<ListItem divider sx={{ height: '5vh' }}>
			<ListItemText>
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<div style={{ width: '25%' }}>
						{reformatTime(item.createdAt)}
					</div>
					<div style={{ width: item.state === 'pending' ? '50%' : '25%' }}>
						<div style={{
							display: 'flex',
						}}>
							{/* <PictogramImage size={30} formType={data.formType} category={data.category} /> */}
							<div style={{
								whiteSpace: 'nowrap',
								overflow: 'hidden',
								textOverflow: 'ellipsis',

							}}>{item.title}</div>
						</div>
					</div>
					<div
						style={{ width: item.state === 'pending' ? '25%' : '20%' }}>{item.state === 'pending' ? '심사중' : item.state ==='approve' ? '승인' : '반려'}</div>
					<div style={{ width: item.state === 'pending' ? '0%' : '30%' }}>
						{item.state === 'reject' &&
							<Button onClick={() => onClickNavigateRejectForm()}>
								수정 및 재심사
							</Button>}
					</div>
				</div>
			</ListItemText>
		</ListItem>
	);
};

export default CodePendingItem;