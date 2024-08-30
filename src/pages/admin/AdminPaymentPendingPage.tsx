import React, {FC, useCallback, useEffect, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import dayjs from 'dayjs';
import {compareDates, createTodayDate, DATE_FORMAT} from "../../utils/DayJsHelper";
import {apiClient} from "../../api/ApiClient";
import {useMutateSettleCoinBySeller, useMutateUpdateConfirmedStatus} from "../../hooks/mutate/PaymentMutate";
import {PurchaseSaleRes} from "../../data/entity/PurchaseSaleRes";
import PaymentPendingItem from "./components/paymentPending/PaymentPendingItem";

interface Props {
	children?: React.ReactNode;
	isSettlement: boolean;
}

interface RequestMoenyGroupByUserToken {
	[key: string]: PurchaseSaleRes[];
}

const AdminPaymentPendingPage: FC<Props> = ({ isSettlement }) => {

	const { isLoading:paymentPendingLoading, data: paymentPendingData, refetch } = useQuery({
		queryKey: ['/purchaseSalehistory'],
		queryFn: () => apiClient.getAdminPurchaseSaleHistory()
	});

	const [pendingDataGroupByUserToken,setPendingDataGroupByUserToken ] = useState<RequestMoenyGroupByUserToken>();
	useEffect(() => {
		if(paymentPendingData)
		{
			const pendingData  = paymentPendingData!.reduce((acc, item) => {
				// 해당 sales_user_token을 키로 사용하여 그룹핑
				if (!acc[item.sales_user_token]) {
					acc[item.sales_user_token] = [];
				}
				acc[item.sales_user_token].push(item);
				return acc;
			}, {} as { [key: string]: PurchaseSaleRes[] });
			console.log("pendingData: + %o", pendingData)
			setPendingDataGroupByUserToken(pendingData);

		}
		//setPendingDataGroupByUserToken();
	}, [paymentPendingData]);

	const [date, setDate] = useState<string>();
	const onChangeDate = useCallback((e: any) => {
		setDate(e.target.value);
	}, [date]);
	const [isFilter, setFilter] = useState(false);
	const [filterData, setFilterData] = useState<PurchaseSaleRes[] | null>(null);
	const onClickFilterData = useCallback(() => {
		if (date && paymentPendingData) {
			setFilter(true);
			const filterDayjs = dayjs(date, 'YYMMDD');
			const startDay = filterDayjs.startOf('day').format(DATE_FORMAT);
			const endDay = filterDayjs.endOf('day').format(DATE_FORMAT);
			console.log(startDay, endDay);
			const myList: PurchaseSaleRes[] = [];
			paymentPendingData.map(item => {
				// if (item.is_confirmed === isSettlement) {
				// 	if (compareDates(item.created_at!, endDay) <= 0 && compareDates(startDay, item.created_at!) <= 0) {
				// 		myList.push(item);
				// 	}
				// }
				if (compareDates(item.created_at!, endDay) <= 0 && compareDates(startDay, item.created_at!) <= 0) {
					myList.push(item);
				}
			});
			console.log(myList);
			setFilterData([...myList]);
		}

	}, [date, paymentPendingData]);
	const onClickFilterInit = useCallback(() => {
		setFilter(false);
		setDate('');
	}, []);
	//const { settleCashMutate } = useMutateSettleCashBySeller();
	const { settleCoinMutate } = useMutateSettleCoinBySeller();
	const { updatePayConfirmedMutate } = useMutateUpdateConfirmedStatus();
	const onClickAllSettlement = useCallback(() => {
		if (paymentPendingData && filterData) {
			const result = window.confirm(`전체 정산 하시겠습니까? ${filterData.length}건`);
			if(!result) return
			filterData.map(async (item) => {

                const sellerPrevTotalCash = await apiClient.getUserTotalCash(item.sales_user_token); // 판매자 정산 전 캐시
				const sellerPrevTotalPoint = await apiClient.getUserTotalPoint(item.sales_user_token); // 판매자 정산 전 코인
                const codeData = await apiClient.getTargetCode(item.post_id); // 코드 정보

				if (item.use_cash != null && item.use_cash > 0) {
					// let cashHistoryRequestEntity : CashHistoryResponseEntity = {
					// 	user_token : item.sales_user_token,
					// 	cash : Math.floor(item.use_cash! - (item.use_cash! * 0.2)),
					// 	amount: Math.floor(item.use_cash! - (item.use_cash! * 0.2) + sellerPrevTotalCash),
					// 	description : `[${codeData.title}] 코드 캐시 정산`,
					// 	cash_history_type : CashHistoryType.earn_cash,
					// }
					const cashAmount = Math.floor(item.use_cash! + sellerPrevTotalCash);
				//	await settleCashMutate({cashHistoryRequestEntity, cashAmount}); // 판매자 캐시 증액
				}
				// TODO : 코인으로 코드 구매 불가 -> 코인 정산로직 제거

				// if (item.use_coin != null && item.use_coin > 0) {
				// 	let coinHistoryRequestEntity : UsersCoinHistoryReq = {
				// 		user_token : item.sales_user_token,
				// 		coin : Math.floor(item.use_coin! - (item.use_coin! * 0.1)),
				// 		amount: Math.floor(item.use_coin! - (item.use_coin! * 0.1) + sellerPrevTotalPoint),
				// 		description : `[${codeData.title}] 코드 코인 정산`,
				// 		point_history_type : CoinHistoryType.use_coin,
				// 	}
				// 	const coinAmount = Math.floor((item.use_coin! * 0.1) + sellerPrevTotalPoint);
				// 	await settleCoinMutate({coinHistoryRequestEntity, coinAmount}); // 판매자 코인 증액
				// }


				// 정산시각
				const date = createTodayDate();
                await updatePayConfirmedMutate({purchase_user_token: item.purchase_user_token!,sales_user_token: item.sales_user_token,postId: item.post_id, date:date});  // 정산 status 처리
                
			});
			setFilterData(null);
		}

	}, [isFilter, date, filterData, paymentPendingData]);


	if (paymentPendingLoading) {
		return <>로딩중</>;
	}
	if (!paymentPendingData) {
		return <>noData</>;
	}
	
	return (
		<>
			<div>
				{ pendingDataGroupByUserToken &&
					Object.keys(pendingDataGroupByUserToken).map((key) => (
						<PaymentPendingItem salesUserToken={key} item={pendingDataGroupByUserToken[key]} />
					// <Accordion key={key}>
					// 	<AccordionSummary
					// 		expandIcon={<ExpandMoreIcon/>}
					// 		aria-controls={`${key}-content`}
					// 		id={`${key}-header`}
					// 	>
					// 		<Typography>{key}</Typography>
					// 	</AccordionSummary>
					// 	<AccordionDetails>
					// 		<List>
					// 			{pendingDataGroupByUserToken[key].map((item) => (
					// 				<ListItem key={item.id}>
					// 					<ListItemText
					// 						primary={`Post ID: ${item.post_id} - Sell Price: ${item.sell_price}`}
					// 						secondary={`Purchase User: ${item.purchase_user_token}`}
					// 					/>
					// 				</ListItem>
					// 			))}
					// 		</List>
					// 	</AccordionDetails>
					// </Accordion>
				))}
			</div>

			{/*{!isFilter ? paymentPendingData!.map((item) => {*/}
			{/*	// if (item.is_application_submitted === isSettlement) {*/}
			{/*		 return <PaymentPending key={item.id} item={item} refetch={refetch} />;*/}
			{/*	//}*/}
			{/*}) : filterData?.map(item => {*/}
			{/*	 return <PaymentPending key={item.id} item={item} refetch={refetch} />;*/}
			{/*})}*/}
		</>
	);
};

export default AdminPaymentPendingPage;