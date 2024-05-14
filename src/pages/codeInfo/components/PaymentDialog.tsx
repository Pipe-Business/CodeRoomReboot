import  { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../../api/ApiClient';
import { REACT_QUERY_KEY } from '../../../constants/define';
import { apiClient } from '../../../api/ApiClient';
import { createTodayDate } from '../../../utils/DayJsHelper';


type requestPurchaseData = {
	codeId: string,
	userId: string,
	createdAt:string
}

const PaymentDialog = () => {
	const { id } = useParams();
	const queryClient = useQueryClient();
	const [userLogin, setUser] = useState<User | null>(null);

	   /*
	* useQuery에서 넘어온 data를 cashData로 선언
	*/
	const { isLoading : isCashDataLoading, data: cashData } = useQuery({
		queryKey: [REACT_QUERY_KEY.cash],
		queryFn: () => apiClient.getUserTotalCash(userLogin!.id),
	});

    useEffect(() => {
        const getSession = async () => {
            const { data, error } = await supabase.auth.getSession()
            if (error) {
                console.error(error)
            } else {
                const { data: { user } } = await supabase.auth.getUser()
                setUser(user);
            }
        }
        getSession()
    }, []);
	

	const { data: postData } = useQuery({
		queryKey: [REACT_QUERY_KEY.code, id],
		queryFn: () => apiClient.getTargetCode(Number(id!)),
	});
	
	// const { userById } = useQueryUserById(codeData?.userId!);

	
	const { mutate } = useMutation({
		mutationFn: async () => {
			 // 유저 캐시 차감 -> 캐시 사용기록 업데이트
			const cashHistory : CashHistoryRequestEntity = {
				user_token : userLogin!.id,
				cash : postData?.price!,
				amount : cashData==undefined ? 0 : cashData - postData?.price!,
				description : "코드 구매",
				cash_history_type : "use_cash"
			}

			await apiClient.insertUserCashHistory(cashHistory);
		}, onSuccess: (result) => {

			// todo purchase sale history insert 로직

			
			// queryClient.setQueryData([REACT_QUERY_KEY.login], () => {
			// 	return result.user;
			// });
		},
	});


		 // todo 구매자에게 구매 알림

		


	// const { paymentPendingMutate } = useMutatePaymentPending();

		

	// const { mutateAsync: updatePurchaseData } = useMutation({
	// 	mutationFn: async (reqData: requestPurchaseData) => {
	// 		await setPurchaseItemForUser(reqData.codeId, reqData.userId,reqData.createdAt);
	// 		await setPurchaseItemForCodeInUser(reqData.codeId, reqData.userId,reqData.createdAt);
	// 		return await getOneCode(reqData.codeId);
	// 	},
	// 	onSuccess: async (result) => {
	// 		const codeEntity = await getOneCode(id!);
	// 		console.log(codeEntity, 'codentity', id);
	// 		queryClient.setQueryData([REACT_QUERY_KEY.code, id], () => {
	// 			return result;
	// 		});
	// 		// queryClient.setQueryData(['test'],async (prev)=>{
	// 		//     console.log(prev,"prev")
	// 		//     return codeEntity
	// 		// })
	// 	},
	// });
	const onClickConfirm = useCallback(async () => {
		try {
			//  if (codeData && userById?.id && userLogin?.id) {
				if (userLogin?.id) {
			 	mutate();
			
			 	const todayDate = createTodayDate();
			

	// todo 구매 정산내역 업데이트

			// 	const entity: PaymentSettlementEntity = {
			// 		codeId: codeData.id,
			// 		point: codeData.price,
			// 		paymentDate: todayDate,
			// 		sellerId: codeData.userId,
			// 		purchaseUserId: userLogin?.id!,
			// 		isSettlement: false,
			// 	};
			// 	const notiEntity: UserNotificationEntity = {
			// 		createdAt: todayDate,
			// 		content: `🎉축하합니다! ${userLogin?.nickname} 님이 ${codeData.title} 코드를 ${codeData.price}point 에 구매하였습니다.`,
			// 		sender: 'admin',
			// 	};
			// 	await apiClient.sendNotificationByUser(codeData.userId, notiEntity);
			// 	const purchasePushRef = push(ref(db, `purchaseDataForUser/${userLogin.id}`));
			// 	const purchasePushKey = purchasePushRef.key;
			// 	const salesPushRef = push(ref(db, `salesDataForUser/${codeData.userId}`));
			// 	const salesPushKey = salesPushRef.key;
			// 	if (purchasePushKey) {
			// 		const purchaseEntity: PurchaseDataForUser = {
			// 			codeId: codeData.id,
			// 			createdAt: todayDate,
			// 			id: purchasePushKey,
			// 			sellerId: codeData.userId,
			// 			point: codeData.price,
			// 		};
			// 		await set(purchasePushRef, purchaseEntity);
			// 	}
			// 	if (salesPushKey) {
			// 		const salesEntity: SalesDataForUser = {
			// 			codeId: codeData.id,
			// 			createdAt: todayDate,
			// 			purchaseUserId: userLogin.id,
			// 			id: salesPushKey,
			// 			point: codeData.price,
			// 		};
			// 		await set(salesPushRef, salesEntity);
			// 	}
			// 	paymentPendingMutate({ sellerId: codeData.userId, codeId: codeData?.id, entity: entity });
			 }
		} catch (e) {
			console.log(e);
		}
	//}, [userLogin, codeData, userById]);
	}, [userLogin]);

	return [onClickConfirm];
};

export default PaymentDialog;