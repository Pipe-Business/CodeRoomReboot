import React, {FC, useCallback} from 'react';

import {Button, Divider, ListItem, ListItemText} from '@mui/material';


import {toast} from 'react-toastify';
import {useMutateSettleCashBySeller, useMutateUpdateConfirmedStatus} from '../../../../hooks/mutate/PaymentMutate';
import {reformatTime} from '../../../../utils/DayJsHelper';
import {useQuery} from '@tanstack/react-query';
import {apiClient} from '../../../../api/ApiClient';
import UserProfileImage from '../../../../components/profile/UserProfileImage';
import {PurchaseSaleResponseEntity} from '../../../../data/entity/PurchaseSaleResponseEntity';
import {REACT_QUERY_KEY} from '../../../../constants/define';
import {CashHistoryResponseEntity} from "../../../../data/entity/CashHistoryResponseEntity";

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
        queryKey: [REACT_QUERY_KEY.user, item.purchase_user_token!], 
        queryFn: async() => await apiClient.getTargetUser(item?.purchase_user_token!) 
    })
	const { data: salesUserData, isLoading: salesUserLoading } = useQuery({ 
        queryKey: [REACT_QUERY_KEY.user, item.sales_user_token!], 
        queryFn: async() => await apiClient.getTargetUser(item?.purchase_user_token!) 
    })
   

	const { settleCashMutate } = useMutateSettleCashBySeller();
    const { updatePayConfirmedMutate } = useMutateUpdateConfirmedStatus();

	
	
	const onClickSettleButton = useCallback(async () => {
		const result = window.confirm(` 정산 하시겠습니까?`);
		if(!result) return

        const sellerPrevTotalCash = await apiClient.getUserTotalCash(item.sales_user_token); // 판매자 정산 전 캐시
        const codeData = await apiClient.getTargetCode(item.post_id); // 코드 정보
        console.log(codeData, purchaseUserData, item);


		if (codeData?.price !== undefined && sellerPrevTotalCash !== undefined && item.id) {
           
            let cashHistoryRequestEntity : CashHistoryResponseEntity = {
                user_token : item.sales_user_token,
                cash : item.price!,
                amount: item.price! + sellerPrevTotalCash,
                description : `[${codeData.title}] 코드 캐시 정산`,
                cash_history_type : 'earn_cash',
            }
			const cashAmount = item.price! + sellerPrevTotalCash;
            await settleCashMutate({cashHistoryRequestEntity, cashAmount}); // 판매자 캐시 증액
            await updatePayConfirmedMutate({purchase_user_token: item.purchase_user_token!,sales_user_token: item.sales_user_token,postId: item.post_id});  // 정산 status 처리
			refetch();
		} else {
			toast.error('정산오류 : 개발팀에 문의해주세요');
		}
	}, [item, codeData]);
	if (codeDataLoading || purchaseUserLoading || salesUserLoading) return <>로딩중</>;

	return (
		<>
			<ListItem>
				<ListItemText>
					<div style={{ display: 'flex', width: '100%' }}>
						{
							item.is_confirmed && 
							<div style={{ width: '15%' }}>
							{reformatTime(item.created_at!)}
						</div>
						}

						<div style={{ display: 'flex', alignItems: 'center', width: '15%' }}>
							<div>
								<div style={{ fontSize: 15, fontWeight: 'bold' }}>{codeData?.title!}</div>
								<div style={{ fontSize: 12 }}>{purchaseUserData!.nickname}</div>
							</div>
						</div>
						<div style={{ width: '25%' }}>
							<div style={{display:'flex'}}>
								<UserProfileImage userId={item.sales_user_token!}/>
								<div>
									<div>{salesUserData?.nickname}</div>
									<div>{salesUserData?.email}</div>
								</div>
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
						<div style={{ width: '5%' }}>
							{item.price!.toLocaleString()} 캐시
						</div>
						<div style={{ width: '5%' }}>
							{item.is_confirmed ?
								<Button variant={'text'}>정산됨 </Button> :
								<Button onClick={onClickSettleButton}>정산하기</Button>
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