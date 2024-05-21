import React, { FC, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
// import { useMutateAdaptToPointForUser } from '../../../../hooks/mutate/PaymentMutate.ts';
//import { paymentStore } from '../../../../store/paymentStore.ts';
//import { useQueryUserLogin } from '../../../../hooks/fetcher/UserFetcher.ts';

interface Props {
	children?: React.ReactNode,
	isOpen: boolean;
	onClose: () => void,
	point:number,
	orderName:string
}

const PointDoneDialog: FC<Props> = ({ isOpen, onClose,point,orderName }) => {
	// const { isLoadingUserLogin, userLogin } = useQueryUserLogin();
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

	// if (isLoadingUserLogin) {
	// 	return <></>;
	// }
	// if (!userLogin) {
	// 	return <>로그인해주세요</>;
	// }
	return (
		<Dialog open={isOpen} onClose={onClose}>
			<DialogTitle>
				결제 성공!
			</DialogTitle>
			{/* <DialogContent>
				<h1>🎉{orderName} 구매!</h1>
				<div>
					{userLogin.nickname} 님의 캐시 : {prevPoint-point} + {point}
				</div>
				<div>
					결제완료후 캐시 : {userLogin.point}p
				</div>

			</DialogContent> */}


<DialogContent>
				<h1>🎉구매!</h1>
				<div>
					nickname 님의 캐시 : 12
				</div>
				<div>
					결제완료후 캐시 : tempp
				</div>

			</DialogContent>


			<DialogActions>
				<Button onClick={onClose}>완료</Button>
			</DialogActions>
		</Dialog>
	);
};

export default PointDoneDialog;