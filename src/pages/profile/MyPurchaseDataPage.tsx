import React, {FC} from 'react';
import {useLocation} from 'react-router-dom';
import FullLayout from '../../layout/FullLayout';
import PurchaseList from './components/purchaseData/PurchaseList';
import {Box} from '@mui/material';
import {PurchaseSaleResponseEntity} from "../../data/entity/PurchaseSaleResponseEntity";
import {PurchaseSaleRequestEntity} from "../../data/entity/PurchaseSaleRequestEntity";
import {apiClient} from "../../api/ApiClient";
import {PointHistoryRequestEntity} from "../../data/entity/PointHistoryRequestEntity";
import ReviewDialog from "../codeInfo/components/ReviewDialog";
import {PointHistoryType} from "../../enums/PointHistoryType";

interface Props {
	children?: React.ReactNode,
}

const MyPurchaseDataPage: FC<Props> = () => {
	const [dialogOpen, setDialogOpen] = React.useState(false);
	const [purchasePostId, setPurchasePostId] = React.useState(-1);

	const { state: {
		userLogin,
		purchaseData,
	} } = useLocation();

	const handleWriteReviewClick = (purchaseData: PurchaseSaleResponseEntity) => {
		console.log('Review click event received for:', purchaseData);
		setDialogOpen(true);
		setPurchasePostId(purchaseData.post_id);
	};

	const handleReviewSubmit = async () =>  {
		// 리뷰 작성 완료시 이 콜백을 수행
		const purchaseData: PurchaseSaleRequestEntity | null = await apiClient.getMyPurchaseSaleHistoryByPostID(userLogin?.userToken!,purchasePostId);
		const currentAmount = await apiClient.getUserTotalPoint(userLogin?.userToken!);

		let amountUpdateValue;
		if (purchaseData?.pay_type === "point") {
			// 구매를 포인트로 했었다면 구매가의 5% -> 현재 디비 컬럼이 정수타입이라서 절대값으로 반올림
			amountUpdateValue = Math.round(purchaseData.price! * 0.05);
		} else {
			// 구매를 캐시로 했었다면 구매가의 5% * 10 -> 현재 디비 컬럼이 정수타입이라서 절대값으로 반올림
			amountUpdateValue = Math.round((purchaseData?.price! * 0.05) * 10);
		}

		const pointHistoryRequest : PointHistoryRequestEntity = {
			description: "리뷰 작성 보상",
			amount: (currentAmount + amountUpdateValue),
			user_token: userLogin?.userToken!,
			point: amountUpdateValue,
			point_history_type: PointHistoryType.earn_point,
		}

		await apiClient.insertUserPointHistory(pointHistoryRequest);

		setDialogOpen(false);
	};

	return (
		<FullLayout>
			<Box height={32} />
			<ReviewDialog postId={purchasePostId} open={dialogOpen} onClose={() => setDialogOpen(false)} onReviewSubmit={handleReviewSubmit} /> {/* 수정된 부분 */}

			<h2>내가 구매한 코드</h2>
			<PurchaseList purchaseData={purchaseData} onWriteReviewClick={handleWriteReviewClick}/>
		</FullLayout>
	);
};

export default MyPurchaseDataPage;