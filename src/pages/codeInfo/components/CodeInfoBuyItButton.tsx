import React, { FC, useState, useEffect } from 'react';
import { Button } from '@mui/material';
// import CodeDownloadButton from './CodeDownloadButton.tsx';
import { ColorButton } from '../styles';

interface Props {
	children?: React.ReactNode,
	codeHostId: string,
	userId?: string,
	purchasedByUser?: {userId:string,createdAt:string}[]
	point: number,
	userHavePoint: number,
	adminRepoURL: string
    isBlur: boolean,
	onPaymentConfirm: () => void
	onClickBuyItButton: () => void,
	onClickLoginRegister: () => void
	onOpenPointDialog: () => void

}

const CodeInfoBuyItButton: FC<Props> = (
	{
		codeHostId,
		userId,
		purchasedByUser,
		point,
		userHavePoint,
		onPaymentConfirm,
        isBlur,
		adminRepoURL,
		onClickLoginRegister,
		onOpenPointDialog,
	}) => {




        const onClickPurchase =
		() => {
			const result = window.confirm(`구매하시겠습니까?\n ${userHavePoint}(보유캐시) - ${point}(상품가격) = ${userHavePoint - point}`);
							   if (result) {
								   onPaymentConfirm();
							   }
		}


	// 로그인 안한 유저의 경우
	if (!userId) {
		return <Button sx={{ width: '100%', fontSize: '30px' }} variant={'contained'}
					   onClick={() => {
						   alert("로그인이 필요한 서비스입니다.")
						   onClickLoginRegister();
					   }}>구매하기</Button>;
	}
	// 게사자일경우
	// if (userId === codeHostId) {
	// 	return null;
	// 	// return (
	// 	// 	<>
	// 	// 		<Button onClick={openDialog}>구매자 목록 </Button>
	// 	// 		<PurchaseListModal userList={purchasedByUser} isOpen={isOpen} onClose={closeDialog} />
	// 	// 	</>
	// 	// );
	// }
	// 구매한사람이 아무도 없을시 무조건 구매하기 버튼
	// if (!purchasedByUser) {
		if (userHavePoint >= point) {
			// return <Button sx={{ width: '100%', fontSize: '30px' }} variant={'contained'}
			// 			   onClick={() => {
			// 				   const result = confirm(`구매하시겠습니까?\n ${userHavePoint}(보유캐시) - ${point}(상품가격) = ${userHavePoint - point}`);
			// 				   if (result) {
			// 					   onPaymentConfirm();
			// 				   }
			// 			   }}>구매하기</Button>;
            return <ColorButton  sx={{ fontSize: '15', width: '210px' }} onClick={() => onClickPurchase()} disabled = {isBlur}>구매하기</ColorButton> 

		} else {
            return <ColorButton  sx={{ fontSize: '15', width: '210px' }} onClick={() => {
                alert('캐시가 부족합니다. 캐시를 충전해주세요');
                onOpenPointDialog();
            }} disabled = {isBlur}>구매하기</ColorButton> ;
		}
	//}
	// 해당 상품을 구매한 유저라면
	// if (purchasedByUser.find(purchasedUser => purchasedUser.userId === userId)) {
	// 	return <CodeDownloadButton repoURL={adminRepoURL}></CodeDownloadButton>;
	// }
	if (userHavePoint >= point) {
		return <Button sx={{ width: '100%', fontSize: '30px' }} variant={'contained'}
					   onClick={() => {
						   const result = window.confirm(`구매하시겠습니까?\n ${userHavePoint}(보유캐시) - ${point}(상품가격) = ${userHavePoint - point}`);
						   if (result) {
							   onPaymentConfirm();
						   }
					   }}>구매하기</Button>;
	} else {

		return <Button sx={{ width: '100%', fontSize: '30px' }} variant={'contained'}
					   onClick={() => {
						   alert('캐시가 부족합니다. 캐시를 충전해주세요');
						   onOpenPointDialog();
					   }}>구매하기</Button>;
	}

};
export default CodeInfoBuyItButton;