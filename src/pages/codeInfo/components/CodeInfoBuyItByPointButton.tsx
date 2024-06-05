import React, { FC, useState, useEffect } from 'react';
import { Button } from '@mui/material';
import CodeDownloadButton from './CodeDownloadButton';
import { ColorButton } from '../styles';
import { Link, useNavigate } from 'react-router-dom';

interface Props {
	postId: number,
	children?: React.ReactNode,
	codeHostId: string,
	userId?: string,
	purchasedSaleData?: PurchaseSaleResponseEntity | null,
	point: number,
	userHavePoint: number,
	githubRepoUrl: string
	isBlur: boolean,
	onPaymentConfirm: () => void
	onClickBuyItButton: () => void,
	onClickLoginRegister: () => void
	onOpenPointDialog: () => void

}

const CodeInfoBuyItByPointButton: FC<Props> = (
	{
		postId,
		codeHostId,
		userId,
		purchasedSaleData,
		point,
		userHavePoint,
		onPaymentConfirm,
		isBlur,
		githubRepoUrl,
		onClickLoginRegister,
		onOpenPointDialog,
	}) => {


	const navigate = useNavigate();
	const onClickPurchase =
		() => {
			const result = window.confirm(`구매하시겠습니까?\n ${userHavePoint}(보유 커밋 포인트) - ${point}(상품 포인트) = ${userHavePoint - point}`);
			if (result) {
				onPaymentConfirm();				
			}
		}


	// 로그인 안한 유저의 경우
	if (!userId) {
		return <ColorButton sx={{ fontSize: '15', width: '210px' }} onClick={() => {
			alert("로그인이 필요한 서비스입니다.")
			onClickLoginRegister();
		}} disabled={isBlur}>포인트로 구매하기</ColorButton>;
	}
	// 게사자일경우
	// if (userId === codeHostId) {
	// 	return null;
	// }

	// 구매한 내역이 있으면
	if (purchasedSaleData != null) {
		return null;

	} else { // 구매 내역이 없으면

		if (userHavePoint >= point) { // 캐시가 충분하면
			return <ColorButton sx={{ fontSize: '15', width: '210px' }} onClick={() => onClickPurchase()} disabled={isBlur} variant='contained'>${point} 커밋 포인트로 구매</ColorButton>

		} else {						// 캐시가 충분하지 않으면
			return <ColorButton sx={{ fontSize: '15', width: '210px' }} onClick={() => {
				alert(`${point - userHavePoint} 커밋 포인트가 부족합니다. 포인트를 모으거나 캐시로 구매해주세요.`);
				//navigate('/charge');
			}} disabled={isBlur} variant='contained'>커밋 포인트로 구매하기</ColorButton>;
		}

	}

};
export default CodeInfoBuyItByPointButton;