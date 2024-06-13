import {useCallback} from 'react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useNavigate, useParams} from 'react-router-dom';
import {apiClient} from '../../../api/ApiClient';
import {REACT_QUERY_KEY} from '../../../constants/define';
import {createTodayDate} from '../../../utils/DayJsHelper';
import {toast} from 'react-toastify';
import {PointHistoryType} from '../../../enums/PointHistoryType';
import {PointHistoryRequestEntity} from '../../../data/entity/PointHistoryRequestEntity';
import {PurchaseSaleRequestEntity} from '../../../data/entity/PurchaseSaleRequestEntity';
import {useQueryUserLogin} from '../../../hooks/fetcher/UserFetcher';
import {NotificationType} from '../../../enums/NotificationType';
import {NotificationEntity} from '../../../data/entity/NotificationEntity';

const PointPaymentDialog = (onConfirm:() => void) => {
	const { id } = useParams();
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const { userLogin , isLoadingUserLogin} = useQueryUserLogin();



	const { isLoading: isPointDataLoading, data: pointData } = useQuery({
		queryKey: [REACT_QUERY_KEY.point],
		queryFn: () => apiClient.getUserTotalPoint(userLogin!.user_token!),
	});

	const { data: postData } = useQuery({
		queryKey: [REACT_QUERY_KEY.code, id],
		queryFn: () => apiClient.getTargetCode(Number(id!)),
	});


	const { mutate } = useMutation({
		mutationFn: async () => {

			// 유저 포인트 차감 -> 포인트 사용기록 insert
			if (postData) {
			const pointHistory: PointHistoryRequestEntity = {
				user_token: userLogin!.user_token!,
				point: postData!.price! * 5,
				amount: pointData == undefined ? 0 : pointData - postData!.price! * 5,
				description: "코드 구매",
				point_history_type: PointHistoryType.use_point,
			}

			await apiClient.insertUserPointHistory(pointHistory);
		}

			// purchase sale history insert(코드 거래내역 insert) 로직
			if (postData) {
				const purchaseSaleHistory: PurchaseSaleRequestEntity = {
					post_id: postData!.id,
					price: postData!.price * 5, // 포인트는 캐시의 5배
					is_confirmed: false,
					purchase_user_token: userLogin!.user_token!,
					sales_user_token: postData!.userToken,
					pay_type: "point"
				}
				await apiClient.insertPurchaseSaleHistory(purchaseSaleHistory);
			}

		}, onSuccess: async (result) => {
			if (postData) {
				// 구매자수 update
				await apiClient.updateBuyerCount(postData.buyerCount + 1, postData.id);
			}


			// 구매자에게 구매 알림
			toast.success('구매가 완료되었습니다.');
            if (onConfirm) {
                onConfirm();
            }
		},
	});

	const onClickConfirm = useCallback(async () => {
		try {
			if (postData && userLogin?.user_token) {
				mutate();
				//  판매자에게 판매알림
				const notificationEntity: NotificationEntity ={
					title : '코드 판매 알림',
					content: `'${postData?.title}' 게시글이 판매 되었습니다`,
					from_user_token: userLogin.user_token,
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

export default PointPaymentDialog;