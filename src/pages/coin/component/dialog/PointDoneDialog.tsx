import React, { FC, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useQueryUserLogin } from '../../../../hooks/fetcher/UserFetcher';
import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEY } from '../../../../constants/define';
import { apiClient } from '../../../../api/ApiClient';

interface Props {
	children?: React.ReactNode,
	isOpen: boolean;
	onClose: () => void,
	cash:number,
	orderName:string
}

const PointDoneDialog: FC<Props> = ({ isOpen, onClose,cash,orderName }) => {
	 const { isLoadingUserLogin, userLogin } = useQueryUserLogin();
	 const { isLoading : isCashDataLoading, data: cashData } = useQuery({
		queryKey: [REACT_QUERY_KEY.cash],
		queryFn: () => apiClient.getUserTotalCash(userLogin?.userToken!),
	});
	// const { mutatePointUpdate } = useMutateAdaptToPointForUser(userLogin?.point!, userLogin?.id!);
	// const { prevPoint, setPrevPoint } = paymentStore();

	// useEffect(() => {
	// 	setPrevPoint(userLogin?.point!);
	// }, [userLogin?.point]);
	// useEffect(() => {
	// 	if (isOpen) {
	// 		mutatePointUpdate(point);
	// 	}
	// }, [isOpen]);

	if (isLoadingUserLogin || isCashDataLoading) {
		return <></>;
	}
	if (!userLogin) {
		return <>로그인해주세요</>;
	}
	return (
		<Dialog open={isOpen} onClose={onClose}>
			<DialogTitle>
				결제 성공!
			</DialogTitle>
			<DialogContent>
				<h1>🎉{orderName} 구매!</h1>
				{cashData && <div>
					 {userLogin!.nickname} 님의 캐시 : {cashData-cash} + {cash} 
				</div>}
				<div>
					결제완료후 캐시 : {cashData}캐시
				</div>

			</DialogContent>

			<DialogActions>
				<Button onClick={onClose}>완료</Button>
			</DialogActions>
		</Dialog>
	);
};

export default PointDoneDialog;