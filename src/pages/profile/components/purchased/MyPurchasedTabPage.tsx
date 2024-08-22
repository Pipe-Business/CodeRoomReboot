import React, {FC} from 'react';
import PurchaseList from './PurchaseList';
import {Table, TableContainer} from '@mui/material';
import {apiClient} from "../../../../api/ApiClient";
import {useQueryUserLogin} from "../../../../hooks/fetcher/UserFetcher";
import {useQuery} from "@tanstack/react-query";
import TableHeader from "../TableHeader";

interface Props {
	children?: React.ReactNode,
}

const MyPurchasedTabPage: FC<Props> = () => {
	const {userLogin} = useQueryUserLogin();
	const {data: purchaseData, isLoading: purchaseCodeDataLoading, refetch: refetchPurchaseData} = useQuery({
		queryKey: ['/purchase', userLogin?.user_token!],
		queryFn: () => apiClient.getMyPurchaseSaleHistory(userLogin!.user_token!),
	});

	// TODO : 리뷰 관련 코드
	// const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
	// const [readonly, setReadonly] = useState(false);
	// const [reviewData, setReviewData] = useState<PurchaseReviewEntity | undefined>(undefined); // reviewData 상태 추가


	// 리뷰 관련 코드
	// const handleWriteReviewClick = async (purchaseData: PurchaseSaleRes) =>  {
	// 	console.log('Review click event received for:', purchaseData);
	//
	// 	const targetCode:CodeModel	= await apiClient.getTargetCode(purchaseData.post_id);
	// 	if(targetCode.isDeleted){
	// 		console.log("targetCode");
	// 		window.alert('삭제된 게시글입니다.');
	// 	}else{
	// 		setPurchasePostId(purchaseData.post_id);
	// 		setReadonly(false);
	// 		setReviewData(undefined); // 리뷰 작성이므로 초기화
	// 		setReviewDialogOpen(true);
	// 	}
	// };
	//
	// const handleReadReviewClick = async (purchaseData: PurchaseSaleRes) => {
	// 	console.log('Review click event received for:', purchaseData);
	// 	setPurchasePostId(purchaseData.post_id);
	// 	setReadonly(true);
	//
	// 	try {
	// 		const review = await apiClient.getReviewData(purchaseData.post_id);
	// 		setReviewData(review); // 조회한 리뷰 데이터를 설정
	// 	} catch (error) {
	// 		console.error('Error fetching review data:', error);
	// 	}
	//
	// 	setReviewDialogOpen(true);
	// };

	// const handleReviewSubmit = async () => {
	// 	console.log("handleReviewSubmit");
	// 	// 리뷰 작성 완료 시 이 콜백을 수행
	//
	// 	//console.log(`hongchul good: ${userLogin?.user_token!} , ${purchasePostId}`);
	// 	const purchaseData = await apiClient.getMyPurchaseSaleHistoryByPostID(userLogin?.user_token!, purchasePostId);
	// 	const currentAmount = await apiClient.getUserTotalPoint(userLogin?.user_token!);
	//
	//
	// 	console.log("purchased: "+JSON.stringify(purchaseData));
	// 	let amountUpdateValue: number ;
	// 	amountUpdateValue = Math.round((purchaseData?.sell_price! * 0.05) * 10);
	//
	// 	// if (purchased?.pay_type === "point") {
	// 	// 	amountUpdateValue = Math.round(purchased.price! * 0.05);
	// 	// } else {
	// 	// }
	//
	// 	const pointHistoryRequest: UsersCoinHistoryReq = {
	// 		description: "리뷰 작성 보상",
	// 		amount: currentAmount + amountUpdateValue,
	// 		user_token: userLogin?.user_token!,
	// 		coin: amountUpdateValue,
	// 		coin_history_type: CoinHistoryType.earn_coin,
	// 	};
	//
	// 	await apiClient.insertUserCoinHistory(pointHistoryRequest); // point history insert
	// 	await apiClient.updateTotalPoint(userLogin!.user_token!,  currentAmount + amountUpdateValue);  // total point update
	//
	// 	// setReviewDialogOpen(false);
	// 	// navigate(0);
	//
	// };

	return (
		<TableContainer>
			<Table>
			{/*<ReviewDialog*/}
			{/*	postId={purchasePostId}*/}
			{/*	open={reviewDialogOpen}*/}
			{/*	onClose={() => setReviewDialogOpen(false)}*/}
			{/*	onReviewSubmit={handleReviewSubmit}*/}
			{/*	readonly={readonly}*/}
			{/*	reviewData={reviewData} // reviewData prop 전달*/}
			{/*/>*/}
			<TableHeader  headerList={["구매일시","코드제목","판매자","구매금액","",""]}/>
			<PurchaseList
				purchaseData={purchaseData}
				//onWriteReviewClick={handleWriteReviewClick}
				//onReadReviewClick={handleReadReviewClick}
			/>
			</Table>
		</TableContainer>
	);
};

export default MyPurchasedTabPage;
