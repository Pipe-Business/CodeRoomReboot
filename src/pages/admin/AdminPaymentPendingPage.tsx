import React, { FC, useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, IconButton, ListItem, ListItemText, TextField } from '@mui/material';
import dayjs from 'dayjs';
import { compareDates, createTodayDate, DATE_FORMAT } from '../../utils/DayJsHelper.ts';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { apiClient } from '../../api/ApiClient.ts';
import { useMutateSettleCashBySeller,useMutateUpdateConfirmedStatus} from '../../hooks/mutate/PaymentMutate.ts';
import PaymentPending from './components/paymentPending/PaymentPending.tsx';
import { PurchaseSaleResponseEntity } from '../../data/entity/PurchaseSaleResponseEntity.ts';

interface Props {
	children?: React.ReactNode;
	isSettlement: boolean;
}

const AdminPaymentPendingPage: FC<Props> = ({ isSettlement }) => {

	const { isLoading:paymentPendingLoading, data: paymentPendingData, refetch } = useQuery({
		queryKey: ['/purchaseSalehistory'],
		queryFn: () => apiClient.getAdminPurchaseSaleHistory(isSettlement)
	});
	const [date, setDate] = useState<string>();
	const onChangeDate = useCallback((e: any) => {
		setDate(e.target.value);
	}, [date]);
	const [isFilter, setFilter] = useState(false);
	const [filterData, setFilterData] = useState<PurchaseSaleResponseEntity[] | null>(null);
	const onClickFilterData = useCallback(() => {
		if (date && paymentPendingData) {
			setFilter(true);
			const filterDayjs = dayjs(date, 'YYMMDD');
			const startDay = filterDayjs.startOf('day').format(DATE_FORMAT);
			const endDay = filterDayjs.endOf('day').format(DATE_FORMAT);
			console.log(startDay, endDay);
			const myList: PurchaseSaleResponseEntity[] = [];
			paymentPendingData.map(item => {
				if (item.is_confirmed === isSettlement) {
					if (compareDates(item.created_at!, endDay) <= 0 && compareDates(startDay, item.created_at!) <= 0) {
						myList.push(item);
					}
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
	const { settleCashMutate } = useMutateSettleCashBySeller();
	const { updatePayConfirmedMutate } = useMutateUpdateConfirmedStatus();
	const onClickAllSettlement = useCallback(() => {
		if (paymentPendingData && filterData) {
			const result = window.confirm(`전체 정산 하시겠습니까? ${filterData.length}건`);
			if(!result) return
			filterData.map(async (item) => {

                const sellerPrevTotalCash = await apiClient.getUserTotalCash(item.sales_user_token); // 판매자 정산 전 캐시
                const codeData = await apiClient.getTargetCode(item.post_id); // 코드 정보
	
                let settlementCashHistoryRequestEntity : CashHistoryResponseEntity = {
                    user_token : item.sales_user_token,
                    cash : item.price!,
                    amount: item.price! + sellerPrevTotalCash, 
                    description : `[${codeData.title}] 코드 캐시 정산`,
                    cash_history_type : 'earn_cash',
                }
				await settleCashMutate(settlementCashHistoryRequestEntity); // 판매자 캐시 증액
                await updatePayConfirmedMutate({purchase_user_token: item.purchase_user_token!,sales_user_token: item.sales_user_token,postId: item.post_id});  // 정산 status 처리
                
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
        {/* 정산되지 않음 */}

			{!isSettlement &&
				<>
					<div style={{ display: 'flex' }}>
						{isFilter && <IconButton onClick={onClickFilterInit}><ArrowBackIcon /></IconButton>}
						<TextField fullWidth type={'number'} value={date} onChange={onChangeDate}
								   placeholder={'YYYYMMDD'} />
						<Button onClick={onClickFilterData}>조회</Button>
						<Button onClick={onClickAllSettlement}>전체정산</Button>
					</div>
				</>
			}
			<ListItem>
				<ListItemText>
					<div style={{ display: 'flex', width: '100%' }}>
					{isSettlement &&
						<div style={{ width: '15%' }}>
							정산시간
						</div>}
						<div style={{ display: 'flex', width: '15%' }}>
							구매한 상품
						</div>
						<div style={{ width: '25%' }}>
							판매한 유저
						</div>
						<div style={{ width: '25%' }}>
							구매한 유저
						</div>
						<div style={{ width: '5%' }}>
							결제한 캐시
						</div>
						<div style={{ width: '5%' }}>
							정산
						</div>
					</div>
				</ListItemText>
			</ListItem>
			{!isFilter ? paymentPendingData!.map((item) => {
				if (item.is_confirmed === isSettlement) {
					 return <PaymentPending key={item.id} item={item} refetch={refetch} />;
				}
			}) : filterData?.map(item => {
                // return <div>{item.purchase_user_token}</div>
				 return <PaymentPending key={item.id} item={item} refetch={refetch} />;
			})}
		</>
	);
};

export default AdminPaymentPendingPage;