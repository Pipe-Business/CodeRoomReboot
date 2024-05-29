import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../../api/ApiClient';
import { REACT_QUERY_KEY } from '../../../constants/define';
import { apiClient } from '../../../api/ApiClient';
import { createTodayDate } from '../../../utils/DayJsHelper';
import { toast } from 'react-toastify';
import { PurchaseSaleRequestEntity } from '../../../data/entity/PurchaseSaleRequestEntity';
import ReviewDialog from './ReviewDialog';

const CashPaymentDialog = () => {
	const { id } = useParams();
	const queryClient = useQueryClient();
	const [userLogin, setUser] = useState<User | null>(null);
	const navigate = useNavigate();
	


	const { isLoading: isCashDataLoading, data: cashData } = useQuery({
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


	const { mutate } = useMutation({
		mutationFn: async () => {

			// 유저 캐시 차감 -> 캐시 사용기록 insert
			const cashHistory: CashHistoryRequestEntity = {
				user_token: userLogin!.id,
				cash: postData?.price!,
				amount: cashData == undefined ? 0 : cashData - postData?.price!,
				description: "코드 구매",
				cash_history_type: "use_cash"
			}

			await apiClient.insertUserCashHistory(cashHistory);

			// purchase sale history insert(코드 거래내역 insert) 로직
			if (postData) {
				const purchaseSaleHistory: PurchaseSaleRequestEntity = {
					post_id: postData!.id,
					price: postData!.price,
					is_confirmed: false,
					purchase_user_token: userLogin!.id,
					sales_user_token: postData!.userToken,
					pay_type: "cash"
				}

				await apiClient.insertPurchaseSaleHistory(purchaseSaleHistory);
			}

		}, onSuccess: async (result) => {
			if (postData) {
				// 구매자수 update
				console.log("구매자수 update")
				await apiClient.updateBuyerCount(postData.buyerCount + 1, postData.id);
			}

			

            // navigate('/');
            toast.success('구매가 완료되었습니다.');
			// todo 구매자에게 구매 알림

		},
	});

	const onClickConfirm = useCallback(async () => {
		try {
			if (postData && userLogin?.id) {
				mutate();
				const todayDate = createTodayDate();


				// navigate('/');
				// toast.success('구매가 완료되었습니다.');
			
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
				
			}
		} catch (e) {
			console.log(e);
		}
	}, [userLogin, postData]);

	return [onClickConfirm];
};

export default CashPaymentDialog;