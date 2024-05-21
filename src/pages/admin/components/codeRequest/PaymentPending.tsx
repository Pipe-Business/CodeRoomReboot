// import React, { FC, useCallback } from 'react';
// // import { PaymentSettlementEntity } from '../../../data/entity/firebase/realtime/admin/PaymentSettlementEntity.ts';
// // import { useQueryUserById } from '../../../hooks/fetcher/UserFetcher.ts';
// // import { useQueryCodeById } from '../../../hooks/fetcher/CodeFetcher.ts';
// // import { Button, Divider, ListItem, ListItemText } from '@mui/material';
// // import { createTodayDate, reformatTime } from '../../../utils/DayJsHelper.ts';
// // import {
// // 	useMutateAddSettlementHistoryForSeller,
// // 	useMutateSettlePointBySeller,
// // 	useMutateUpdatePaymentPendingById,
// // } from '../../../hooks/mutate/PaymentMutate.ts';
// import { toast } from 'react-toastify';
// // import { SettlementHistoryEntity } from '../../../data/entity/firebase/realtime/user/SettlementHistoryEntity.ts';
// // import PictogramImage from '../../../components/PictogramImage.tsx';
// // import { UserNotificationEntity } from '../../../data/entity/firebase/realtime/user/UserNotificationEntity.ts';
// // import { apiClient } from '../../../api/ApiClient.ts';
// // import UserProfileImage from '../../../components/UserProfileImage.tsx';

// interface Props {
// 	children?: React.ReactNode;
// 	item: PaymentSettlementEntity;
// 	refetch: () => void;
// }


// const PaymentPending: FC<Props> = ({ item, refetch }) => {
// 	// const { userById } = useQueryUserById(item.sellerId);
// 	// const { userById: purchaseUser } = useQueryUserById(item.purchaseUserId!);
// 	// const { codeData } = useQueryCodeById(['codeStore', item.codeId]);
// 	// const { settlePointMutate } = useMutateSettlePointBySeller();
// 	// const { updatePayPendingMutate } = useMutateUpdatePaymentPendingById();
// 	// const { addSettlementHistoryMutate } = useMutateAddSettlementHistoryForSeller();
// 	// const onClickSettleButton = useCallback(async () => {
// 	// 	const result = confirm(` 정산 하시겠습니까?`);
// 	// 	if(!result) return
// 	// 	console.log(codeData, userById, item);
// 	// 	if (codeData?.price !== undefined && userById?.point !== undefined && item.id) {
// 	// 		await settlePointMutate({
// 	// 			sellerId: item.sellerId,
// 	// 			point: parseInt((Math.floor(item.point * 0.9)).toString()) + parseInt(userById.point.toString()),
// 	// 		});
// 	// 		const entity: SettlementHistoryEntity = {
// 	// 			codeId: codeData.id,
// 	// 			priceByCode: Math.floor(item.point * 0.9),
// 	// 			userId: userById.id,
// 	// 			userPoint: userById.point,
// 	// 			settleDate: createTodayDate(),
// 	// 		};
// 	// 		const { date } = await updatePayPendingMutate(item.id);
// 	// 		const notiEntity: UserNotificationEntity = {
// 	// 			createdAt: date,
// 	// 			content: `관리자가 회원님의 ${codeData.title} ${codeData.formType === 'code' ? '(코드)를' : '(게시글)을'} ${Math.floor(item.point * 0.9)}p 정산하였습니다.`,
// 	// 			sender: 'admin',
// 	// 		};
// 	// 		await apiClient.sendNotificationByUser(userById.id, notiEntity);
// 	// 		await addSettlementHistoryMutate({ sellerId: item.sellerId, entity: entity });
// 	// 		refetch();
// 	// 	} else {
// 	// 		toast.error('정산오류 : 개발팀에 문의해주세요');
// 	// 	}
// 	// }, [item, codeData, userById]);
// 	// if (!userById) return <>no data</>;
// 	// if (!codeData) return <>no data</>;
// 	return (
// 		<>
// 			<ListItem>
// 				<ListItemText>
// 					<div style={{ display: 'flex', width: '100%' }}>
// 						<div style={{ width: '10%' }}>
// 							{item.settlementDate?reformatTime(item.settlementDate):'정산전'}
// 						</div>
// 						<div style={{ width: '8%' }}>
// 							{codeData.formType === 'article' ? '후원' : '구매'}
// 						</div>
// 						<div style={{ width: '10%' }}>
// 							{reformatTime(item.paymentDate)}
// 						</div>
// 						<div style={{ display: 'flex', alignItems: 'center', width: '25%' }}>
// 						<span style={{ marginRight: 8 }}><PictogramImage size={35} formType={codeData.formType}
// 																		 category={codeData.category} /></span>
// 							<div>
// 								<div style={{ fontSize: 15, fontWeight: 'bold' }}>{codeData.title}</div>
// 								<div style={{ fontSize: 12 }}>{userById.nickname}</div>
// 							</div>
// 						</div>
// 						<div style={{ width: '25%' }}>
// 							<div style={{display:'flex'}}>
// 								<UserProfileImage userId={item.purchaseUserId!}/>
// 								<div>
// 									<div>{purchaseUser?.nickname}</div>
// 									<div>{purchaseUser?.email}</div>
// 								</div>
// 							</div>
// 						</div>
// 						<div style={{ width: '17%' }}>
// 							{item.point.toLocaleString()} point
// 						</div>
// 						<div style={{ width: '5%' }}>
// 							{item.settlementDate ?
// 								<Button variant={'text'}>정산됨 </Button> :
// 								<Button onClick={onClickSettleButton}>정산하기</Button>
// 							}
// 						</div>
// 					</div>
// 				</ListItemText>
// 			</ListItem>
// 			<Divider/>
// 		</>
// 	);
// };

// export default PaymentPending;