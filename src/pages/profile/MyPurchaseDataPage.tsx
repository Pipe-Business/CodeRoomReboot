// MyPurchaseDataPage.tsx
import React, {FC, useState} from 'react';
import {useLocation} from 'react-router-dom';
import FullLayout from '../../layout/FullLayout';
import PurchaseList from './components/purchaseData/PurchaseList';
import {Box} from '@mui/material';
import {PurchaseSaleResponseEntity} from "../../data/entity/PurchaseSaleResponseEntity";
import {apiClient} from "../../api/ApiClient";
import ReviewDialog from "../codeInfo/components/ReviewDialog";
import {PurchaseReviewEntity} from "../../data/entity/PurchaseReviewEntity";
import {PointHistoryRequestEntity} from "../../data/entity/PointHistoryRequestEntity";
import {PointHistoryType} from "../../enums/PointHistoryType";

interface Props {
	children?: React.ReactNode,
}

const MyPurchaseDataPage: FC<Props> = () => {
	const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
	const [purchasePostId, setPurchasePostId] = useState(-1);
	const [readonly, setReadonly] = useState(false);
	const [reviewData, setReviewData] = useState<PurchaseReviewEntity | undefined>(undefined); // reviewData 상태 추가

	const { state: { userLogin, purchaseData } } = useLocation();

	const handleWriteReviewClick = (purchaseData: PurchaseSaleResponseEntity) => {
		console.log('Review click event received for:', purchaseData);
		setPurchasePostId(purchaseData.post_id);
		setReadonly(false);
		setReviewData(undefined); // 리뷰 작성이므로 초기화
		setReviewDialogOpen(true);
	};

	const handleReadReviewClick = async (purchaseData: PurchaseSaleResponseEntity) => {
		console.log('Review click event received for:', purchaseData);
		setPurchasePostId(purchaseData.post_id);
		setReadonly(true);

		try {
			const review = await apiClient.getReviewData(purchaseData.post_id);
			setReviewData(review); // 조회한 리뷰 데이터를 설정
		} catch (error) {
			console.error('Error fetching review data:', error);
		}

		setReviewDialogOpen(true);
	};

	const handleReviewSubmit = async () => {
		// 리뷰 작성 완료 시 이 콜백을 수행
		const purchaseData = await apiClient.getMyPurchaseSaleHistoryByPostID(userLogin?.userToken!, purchasePostId);
		const currentAmount = await apiClient.getUserTotalPoint(userLogin?.userToken!);

		let amountUpdateValue;
		if (purchaseData?.pay_type === "point") {
			amountUpdateValue = Math.round(purchaseData.price! * 0.05);
		} else {
			amountUpdateValue = Math.round((purchaseData?.price! * 0.05) * 10);
		}

		const pointHistoryRequest: PointHistoryRequestEntity = {
			description: "리뷰 작성 보상",
			amount: currentAmount + amountUpdateValue,
			user_token: userLogin?.userToken!,
			point: amountUpdateValue,
			point_history_type: PointHistoryType.earn_point, // 수정된 부분
		};

		await apiClient.insertUserPointHistory(pointHistoryRequest);

		setReviewDialogOpen(false);
	};

	return (
		<FullLayout>
			<Box height={32} />
			<ReviewDialog
				postId={purchasePostId}
				open={reviewDialogOpen}
				onClose={() => setReviewDialogOpen(false)}
				onReviewSubmit={handleReviewSubmit}
				readonly={readonly}
				reviewData={reviewData} // reviewData prop 전달
			/>
			<h2>내가 구매한 코드</h2>
			<PurchaseList
				purchaseData={purchaseData}
				onWriteReviewClick={handleWriteReviewClick}
				onReadReviewClick={handleReadReviewClick}
			/>
		</FullLayout>
	);
};

export default MyPurchaseDataPage;
