// import React, { FC, useCallback, useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { Button, IconButton, ListItem, ListItemText, TextField } from '@mui/material';
// import dayjs from 'dayjs';
// import { compareDates, createTodayDate, DATE_FORMAT } from '../../utils/DayJsHelper.ts';
// // import { SettlementHistoryEntity } from '../../data/entity/firebase/realtime/user/SettlementHistoryEntity.ts';
// // import {
// // 	useMutateAddSettlementHistoryForSeller,
// // 	useMutateSettlePointBySeller,
// // 	useMutateUpdatePaymentPendingById,
// // } from '../../hooks/mutate/PaymentMutate.ts';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// interface Props {
// 	children?: React.ReactNode;
// 	isSettlement: boolean;
// }

// const AdminPaymentPendingPage: FC<Props> = ({ isSettlement }) => {
// 	// const { settlementCol } = settlementManageStore();
// 	// const { isLoading, data, refetch } = useQuery({
// 	// 	queryKey: ['paymentPending'],
// 	// 	queryFn: () => firebaseGetAllWithQuery<PaymentSettlementEntity>(['paymentPending'], orderByChild('settlementDate')),
// 	// });
// 	const [date, setDate] = useState<string>();
// 	// const onChangeDate = useCallback((e: any) => {
// 	// 	setDate(e.target.value);
// 	// }, [date]);
// 	// const [isFilter, setFilter] = useState(false);
// 	// const [filterData, setFilterData] = useState<PaymentSettlementEntity[] | null>(null);
// 	// const onClickFilterData = useCallback(() => {
// 	// 	if (date && data) {
// 	// 		setFilter(true);
// 	// 		const filterDayjs = dayjs(date, 'YYMMDD');
// 	// 		const startDay = filterDayjs.startOf('day').format(DATE_FORMAT);
// 	// 		const endDay = filterDayjs.endOf('day').format(DATE_FORMAT);
// 	// 		console.log(startDay, endDay);
// 	// 		const myList: PaymentSettlementEntity[] = [];
// 	// 		data.map(item => {
// 	// 			if (item.isSettlement === isSettlement) {
// 	// 				if (compareDates(item.paymentDate, endDay) <= 0 && compareDates(startDay, item.paymentDate) <= 0) {
// 	// 					myList.push(item);
// 	// 				}
// 	// 			}
// 	// 		});
// 	// 		console.log(myList);
// 	// 		setFilterData([...myList]);
// 	// 	}

// 	// }, [date, data]);
// 	// const onClickFilterInit = useCallback(() => {
// 	// 	setFilter(false);
// 	// 	setDate('');
// 	// }, []);
// 	// const { settlePointMutate } = useMutateSettlePointBySeller();
// 	// const { updatePayPendingMutate } = useMutateUpdatePaymentPendingById();
// 	// const { addSettlementHistoryMutate } = useMutateAddSettlementHistoryForSeller();
// 	// const onClickAllSettlement = useCallback(() => {
// 	// 	if (data && filterData) {
// 	// 		const result = confirm(`전체 정산 하시겠습니까? ${filterData.length}건`);
// 	// 		if(!result) return
// 	// 		filterData.map(async (item) => {
// 	// 			const userById = await getOneFirebaseData<UserEntity>(['users', item.sellerId]);
// 	// 			const codeData = await getOneFirebaseData<CodeEntity>(['codeStore', item.codeId]);
// 	// 			await settlePointMutate({
// 	// 				sellerId: item.sellerId,
// 	// 				point: parseInt((Math.floor(item.point * 0.9)).toString()) + parseInt(userById.point.toString()),
// 	// 			});
// 	// 			const entity: SettlementHistoryEntity = {
// 	// 				codeId: codeData.id,
// 	// 				priceByCode: Math.floor(item.point * 0.9),
// 	// 				userId: userById.id,
// 	// 				userPoint: userById.point,
// 	// 				settleDate: createTodayDate(),
// 	// 			};
// 	// 			await updatePayPendingMutate(item.id!);
// 	// 			await addSettlementHistoryMutate({ sellerId: item.sellerId, entity: entity });
// 	// 		});
// 	// 		setFilterData(null);
// 	// 	}

// 	// }, [isFilter, date, filterData, data]);


// 	// if (isLoading) {
// 	// 	return <>로딩중</>;
// 	// }
// 	// if (!data) {
// 	// 	return <>noData</>;
// 	// }
// 	// if (settlementCol) {
// 	// 	console.log('AAA', settlementCol);
// 	// 	return <></>;
// 	// }
// 	return (
// 		<>
// 			{/* {!isSettlement &&
// 				<>
// 					<div style={{ display: 'flex' }}>
// 						{isFilter && <IconButton onClick={onClickFilterInit}><ArrowBackIcon /></IconButton>}
// 						<TextField fullWidth type={'number'} value={date} onChange={onChangeDate}
// 								   placeholder={'YYYYMMDD'} />
// 						<Button onClick={onClickFilterData}>조회</Button>
// 						<Button onClick={onClickAllSettlement}>전체 정산</Button>
// 					</div>
// 				</>
// 			} */}

// 			{!isSettlement &&
// 				<>
// 					<div style={{ display: 'flex' }}>
// 						{/* {isFilter && <IconButton onClick={onClickFilterInit}><ArrowBackIcon /></IconButton>} */}
// 						<TextField fullWidth type={'number'} value={date} onChange={()=>{}}
// 								   placeholder={'YYYYMMDD'} />
// 						<Button onClick={()=> {}}>조회</Button>
// 						<Button onClick={() => {}}>전체 정산</Button>
// 					</div>
// 				</>
// 			}
// 			<ListItem>
// 				<ListItemText>
// 					<div style={{ display: 'flex', width: '100%' }}>
// 						<div style={{ width: '10%' }}>
// 							정산시간
// 						</div>
// 						<div style={{ width: '8%' }}>
// 							구매&후원
// 						</div>
// 						<div style={{ width: '10%' }}>
// 							구매&후원시간
// 						</div>
// 						<div style={{ display: 'flex', alignItems: 'center', width: '25%' }}>
// 							구매한 상품
// 						</div>
// 						<div style={{ width: '25%' }}>
// 							구매한 유저
// 						</div>
// 						<div style={{ width: '17%' }}>
// 							결제한 캐시
// 						</div>
// 						<div style={{ width: '5%' }}>
// 							정산
// 						</div>
// 					</div>
// 				</ListItemText>
// 			</ListItem>
// 			{!isFilter ? data.map((item) => {
// 				if (item.isSettlement === isSettlement) {
// 					return <PaymentPending key={item.id} item={item} refetch={refetch} />;
// 				}
// 			}) : filterData?.map(item => {
// 				return <PaymentPending key={item.id} item={item} refetch={refetch} />;
// 			})}
// 		</>
// 	);
// };

// export default AdminPaymentPendingPage;