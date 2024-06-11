import React, {useCallback} from 'react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useNavigate, useParams} from 'react-router-dom';
import {apiClient} from '../../../api/ApiClient';
import {REACT_QUERY_KEY} from '../../../constants/define';
import {createTodayDate} from '../../../utils/DayJsHelper';
import {toast} from 'react-toastify';
import {PurchaseSaleRequestEntity} from '../../../data/entity/PurchaseSaleRequestEntity';
import {useQueryUserLogin} from '../../../hooks/fetcher/UserFetcher';
import {NotificationType} from '../../../enums/NotificationType';
import {NotificationEntity} from '../../../data/entity/NotificationEntity';
import {CashHistoryRequestEntity} from "../../../data/entity/CashHistoryRequestEntity";

const CashPaymentDialog = (onConfirm: () => void) => {
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
				//  판매자에게 판매알림
				const notificationEntity: NotificationEntity ={
					title : '코드 판매 알림',
					content: `'${postData?.title}' 게시글이 판매 되었습니다`,
					from_user_token: 'admin',
					to_user_token: postData?.userToken!,
					notification_type: NotificationType.sale,
				}

				await apiClient.insertNotification(notificationEntity);
			}
		} catch (e) {
			console.log(e);
		}
	}, [userLogin, postData]);

	return [onClickConfirm];
};

export default CashPaymentDialog;