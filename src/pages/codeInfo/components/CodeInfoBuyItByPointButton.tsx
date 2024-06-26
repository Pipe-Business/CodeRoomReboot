import React, {FC} from 'react';
import {ColorButton} from '../styles';
import {useNavigate} from 'react-router-dom';
import {PurchaseSaleResponseEntity} from "../../../data/entity/PurchaseSaleResponseEntity";
// 미사용 코드
interface Props {
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
			const result = window.confirm(`구매하시겠습니까?\n ${userHavePoint}(보유 코인) - ${point}(상품 코인) = ${userHavePoint - point}`);
			if (result) {
				onPaymentConfirm();				
			}
		}


	// 로그인 안한 유저의 경우
	if (!userId) {
		return <ColorButton sx={{ fontSize: '15', width: '210px' }} onClick={() => {
			alert("로그인이 필요한 서비스입니다.")
			onClickLoginRegister();
		}} disabled={isBlur}>{point} 코인으로 구매하기</ColorButton>;
	}
	// 게사자일경우
	if (userId === codeHostId) {
		return null;
	}

	// 구매한 내역이 있으면
	if (purchasedSaleData != null) {
		return null;

	} else { // 구매 내역이 없으면

		if (userHavePoint >= point) { // 캐시가 충분하면
			return <ColorButton sx={{ fontSize: '15', width: '210px' }} onClick={() => onClickPurchase()} disabled={isBlur} variant='contained'>{point} 코인으로 구매</ColorButton>

		} else {						// 캐시가 충분하지 않으면
			return <ColorButton sx={{ fontSize: '15', width: '210px' }} onClick={() => {
				alert(`${point - userHavePoint} 코인이 부족합니다. 코인을 모으거나 캐시로 구매해주세요.`);
				//navigate('/charge');
			}} disabled={isBlur} variant='contained'>{point.toLocaleString()} 코인으로 구매하기</ColorButton>;
		}

	}

};
export default CodeInfoBuyItByPointButton;