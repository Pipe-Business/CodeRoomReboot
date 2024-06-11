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
	nowPurchaseCash:number,
	cash:number,
	orderName:string
}

const PointDoneDialog: FC<Props> = ({ isOpen, onClose,nowPurchaseCash,orderName, cash}) => {
	 const { isLoadingUserLogin, userLogin } = useQueryUserLogin();

	if (isLoadingUserLogin) {
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

				<div>
					 {userLogin!.nickname} 님의 캐시 : {cash-nowPurchaseCash} + {nowPurchaseCash}
				</div>

				<div>
					결제완료후 캐시 : {cash}캐시
				</div>

			</DialogContent>

			<DialogActions>
				<Button onClick={onClose}>완료</Button>
			</DialogActions>
		</Dialog>
	);
};

export default PointDoneDialog;