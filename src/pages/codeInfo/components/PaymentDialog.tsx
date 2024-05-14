import  { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../../api/ApiClient';



type requestPurchaseData = {
	codeId: string,
	userId: string,
	createdAt:string
}

const PaymentDialog = () => {
	const { id } = useParams();
	const queryClient = useQueryClient();
	//const { setDialogState } = paymentStore();
	const [userLogin, setUser] = useState<User | null>(null)

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


	// const { data: codeData } = useQuery({
	// 	queryKey: [REACT_QUERY_KEY.code, id],
	// 	queryFn: () => loadCodeByIdFetcher(id!),
	// });
	
	// const { userById } = useQueryUserById(codeData?.userId!);
	// const { mutate } = useMutation({
	// 	mutationFn: async (point: number) => {
	// 		await setUserPointById(userLogin?.id!, point);
	// 		const code = await getOneFirebaseData<CodeEntity>(['codeStore', id]);

	// 		const user = await getUserById(userLogin?.id!);
	// 		console.log('success,', code, user);
	// 		return { code, user };

	// 	}, onSuccess: (result) => {
	// 		queryClient.setQueryData([REACT_QUERY_KEY.login], () => {
	// 			return result.user;
	// 		});
	// 	},
	// });
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
			// if (codeData && userById?.id && userLogin?.id) {
			// 	mutate(userLogin?.point! - codeData?.price!);
			// 	setDialogState(false, false);
			// 	const todayDate = createTodayDate();
			// 	const result = await updatePurchaseData({ codeId: codeData?.id!, userId: userLogin?.id!,createdAt:todayDate });
			// 	console.log(',,,,,,,,,,,,,,,,,,,,,,,,,', result);
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
			// }
		} catch (e) {
			console.log(e);
		}
	//}, [userLogin, codeData, userById]);
	}, [userLogin]);

	return [onClickConfirm];
};

export default PaymentDialog;