// MyPurchaseDataPage.tsx
import React, {FC, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import FullLayout from '../../layout/FullLayout';
import PurchaseList from './components/purchaseData/PurchaseList';
import {Box} from '@mui/material';
import {PurchaseSaleResponseEntity} from "../../data/entity/PurchaseSaleResponseEntity";
import {apiClient} from "../../api/ApiClient";
import ReviewDialog from "../codeInfo/components/ReviewDialog";
import {PurchaseReviewEntity} from "../../data/entity/PurchaseReviewEntity";
import {PointHistoryRequestEntity} from "../../data/entity/PointHistoryRequestEntity";
import {PointHistoryType} from "../../enums/PointHistoryType";
import {CodeModel} from "../../data/model/CodeModel";

interface Props {
	children?: React.ReactNode,
}

const MyPurchaseDataPage: FC<Props> = () => {
	const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
	const [purchasePostId, setPurchasePostId] = useState(-1);
	const [readonly, setReadonly] = useState(false);
	const [reviewData, setReviewData] = useState<PurchaseReviewEntity | undefined>(undefined); // reviewData 상태 추가

	const navigate = useNavigate();
	const { state: { userLogin, purchaseData } } = useLocation();
	console.log("user model"+JSON.stringify(userLogin));

	const handleWriteReviewClick = async (purchaseData: PurchaseSaleResponseEntity) =>  {
		console.log('Review click event received for:', purchaseData);

		const targetCode:CodeModel	= await apiClient.getTargetCode(purchaseData.post_id);
		if(targetCode.is_deleted){
			console.log("targetCode");
			window.alert('삭제된 게시글입니다.');
		}else{
			setPurchasePostId(purchaseData.post_id);
			setReadonly(false);
			setReviewData(undefined); // 리뷰 작성이므로 초기화
			setReviewDialogOpen(true);
		}
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
		console.log("handleReviewSubmit");
		// 리뷰 작성 완료 시 이 콜백을 수행

		//console.log(`hongchul good: ${userLogin?.user_token!} , ${purchasePostId}`);
		const purchaseData = await apiClient.getMyPurchaseSaleHistoryByPostID(userLogin?.user_token!, purchasePostId);
		const currentAmount = await apiClient.getUserTotalPoint(userLogin?.user_token!);


		console.log("purchaseData: "+JSON.stringify(purchaseData));
		let amountUpdateValue: number ;
		amountUpdateValue = Math.round((purchaseData?.sell_price! * 0.05) * 10);

		// if (purchaseData?.pay_type === "point") {
		// 	amountUpdateValue = Math.round(purchaseData.price! * 0.05);
		// } else {
		// }

		const pointHistoryRequest: PointHistoryRequestEntity = {
			description: "리뷰 작성 보상",
			amount: currentAmount + amountUpdateValue,
			user_token: userLogin?.user_token!,
			point: amountUpdateValue,
			point_history_type: PointHistoryType.earn_point,
		};

		await apiClient.insertUserPointHistory(pointHistoryRequest); // point history insert
		await apiClient.updateTotalPoint(userLogin.user_token!,  currentAmount + amountUpdateValue);  // total point update

		setReviewDialogOpen(false);
		navigate(0);

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
