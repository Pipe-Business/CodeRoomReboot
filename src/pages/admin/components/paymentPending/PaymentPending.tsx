import React, { FC, useCallback } from 'react';

import { Button, Divider, ListItem, ListItemText } from '@mui/material';


import { toast } from 'react-toastify';
import { useMutateSettleCashBySeller } from '../../../../hooks/mutate/PaymentMutate';
import { reformatTime } from '../../../../utils/DayJsHelper';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../../api/ApiClient';
import UserProfileImage from '../../../../components/profile/UserProfileImage';

interface Props {
	children?: React.ReactNode;
	item: PurchaseSaleResponseEntity;
	refetch: () => void;
}

const PaymentPending: FC<Props> = ({ item, refetch }) => {    
	const { data: codeData, isLoading: codeDataLoading} = useQuery({
         queryKey: ['codeStore', item.post_id], 
         queryFn: () => apiClient.getTargetCode(item.post_id) 
        });

    const { data: purchaseUserData, isLoading: purchaseUserLoading } = useQuery({ 
        queryKey: ['users', item.purchase_user_token!], 
        queryFn: async() => await apiClient.getTargetUser(item?.purchase_user_token!) 
    })
   

	const { settleCashMutate } = useMutateSettleCashBySeller();
	// const { updatePayPendingMutate } = useMutateUpdatePaymentPendingById();
	// const { addSettlementHistoryMutate } = useMutateAddSettlementHistoryForSeller();
	// const onClickSettleButton = useCallback(async () => {
	// 	const result = confirm(` 정산 하시겠습니까?`);
	// 	if(!result) return
	// 	console.log(codeData, userById, item);
	// 	if (codeData?.price !== undefined && userById?.point !== undefined && item.id) {
	// 		await settlePointMutate({
	// 			sellerId: item.sellerId,
	// 			point: parseInt((Math.floor(item.point * 0.9)).toString()) + parseInt(userById.point.toString()),
	// 		});
	// 		const entity: SettlementHistoryEntity = {
	// 			codeId: codeData.id,
	// 			priceByCode: Math.floor(item.point * 0.9),
	// 			userId: userById.id,
	// 			userPoint: userById.point,
	// 			settleDate: createTodayDate(),
	// 		};
	// 		const { date } = await updatePayPendingMutate(item.id);
	// 		const notiEntity: UserNotificationEntity = {
	// 			createdAt: date,
	// 			content: `관리자가 회원님의 ${codeData.title} ${codeData.formType === 'code' ? '(코드)를' : '(게시글)을'} ${Math.floor(item.point * 0.9)}p 정산하였습니다.`,
	// 			sender: 'admin',
	// 		};
	// 		await apiClient.sendNotificationByUser(userById.id, notiEntity);
	// 		await addSettlementHistoryMutate({ sellerId: item.sellerId, entity: entity });
	// 		refetch();
	// 	} else {
	// 		toast.error('정산오류 : 개발팀에 문의해주세요');
	// 	}
	// }, [item, codeData, userById]);
	if (codeDataLoading || purchaseUserLoading) return <>no data</>;

	return (
		<>
			<ListItem>
				<ListItemText>
					<div style={{ display: 'flex', width: '100%' }}>
						<div style={{ width: '10%' }}>
							{item.is_confirmed ?reformatTime(item.created_at!):'정산전'}
						</div>
						
						{/* <div style={{ width: '10%' }}>
							{reformatTime(item.paymentDate)}
						</div> */}
						<div style={{ display: 'flex', alignItems: 'center', width: '35%' }}>
							<div>
								<div style={{ fontSize: 15, fontWeight: 'bold' }}>{codeData?.title!}</div>
								<div style={{ fontSize: 12 }}>{purchaseUserData!.nickname}</div>
							</div>
						</div>
						<div style={{ width: '25%' }}>
							<div style={{display:'flex'}}>
								<UserProfileImage userId={item.purchase_user_token!}/>
								<div>
									<div>{purchaseUserData?.nickname}</div>
									<div>{purchaseUserData?.email}</div>
								</div>
							</div>
						</div>
						<div style={{ width: '17%' }}>
							{item.price!.toLocaleString()} 캐시
						</div>
						<div style={{ width: '5%' }}>
							{item.is_confirmed ?
								<Button variant={'text'}>정산됨 </Button> :
								<Button onClick={()=>{}}>정산하기</Button>
							}
						</div>
					</div>
				</ListItemText>
			</ListItem>
			<Divider/>
		</>
	);
};

export default PaymentPending;