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
import { useQueryUserLogin } from '../../../hooks/fetcher/UserFetcher';
import { NotificationType } from '../../../enums/NotificationType';
import { NotificationEntity } from '../../../data/entity/NotificationEntity';

const CashPaymentDialog = (onConfirm) => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const { isLoadingUserLogin, userLogin } = useQueryUserLogin();
    const navigate = useNavigate();

	const { isLoading: isCashDataLoading, data: cashData } = useQuery({
		queryKey: [REACT_QUERY_KEY.cash],
		queryFn: () => apiClient.getUserTotalCash(userLogin!.userToken!),
	});

	const { data: postData } = useQuery({
		queryKey: [REACT_QUERY_KEY.code, id],
		queryFn: () => apiClient.getTargetCode(Number(id!)),
	});

    const { mutate } = useMutation({
        mutationFn: async () => {

     	// 유저 캐시 차감 -> 캐시 사용기록 insert
			const cashHistory: CashHistoryRequestEntity = {
				user_token: userLogin!.userToken!,
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
					purchase_user_token: userLogin!.userToken!,
					sales_user_token: postData!.userToken,
					pay_type: "cash"
				}

				await apiClient.insertPurchaseSaleHistory(purchaseSaleHistory);
			}

        },
        onSuccess: async () => {
            if (postData) {
				// 구매자수 update
				console.log("구매자수 update")
				await apiClient.updateBuyerCount(postData.buyerCount + 1, postData.id);
			}			

			// navigate('/');
			toast.success('구매가 완료되었습니다.');
            if (onConfirm) {
                onConfirm();
            }

		},
    });

	const onClickConfirm = useCallback(async () => {
		try {
			if (postData && userLogin?.userToken) {
				mutate();
				const todayDate = createTodayDate();
				//  판매자에게 판매알림
				const notificationEntity: NotificationEntity ={
					title : '코드 판매 알림',
					content: `'${postData?.title}' 게시글이 판매 되었습니다`,
					from_user_token: '045148b1-77db-4dfc-8d76-e11f7f9a4a10',// todo 변경 필요
					to_user_token: postData?.userToken!,
					notification_type: NotificationType.sale,
				}
				let notistring=JSON.stringify(notificationEntity);
				console.log("sdf"+notistring);
				await apiClient.insertNotification(notificationEntity);

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
