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

const PointPaymentDialog = () => {
	const { id } = useParams();
	const queryClient = useQueryClient();
	const [userLogin, setUser] = useState<User | null>(null);
	const navigate = useNavigate();


	const { isLoading: isPointDataLoading, data: pointData } = useQuery({
		queryKey: [REACT_QUERY_KEY.point],
		queryFn: () => apiClient.getUserTotalPoint(userLogin!.id),
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
//errorColumn 'point_history_type' of relation 'users_point_history' does not exist 에러 발생하여 추후 구현

			// // 유저 포인트 차감 -> 포인트 사용기록 insert
			// const pointHistory: PointHistoryRequestEntity = {
			// 	user_token: userLogin!.id,
			// 	point: postData?.price! * 5,
			// 	amount: pointData == undefined ? 0 : pointData - postData?.price! * 5,
			// 	description: "코드 구매",
			// 	point_history_type: "use_point"
			// }

			// await apiClient.insertUserPointHistory(pointHistory);

			// // purchase sale history insert(코드 거래내역 insert) 로직
			// if (postData) {
			// 	const purchaseSaleHistory: PurchaseSaleRequestEntity = {
			// 		post_id: postData!.id,
			// 		price: postData!.price * 5, // 포인트는 캐시의 5배
			// 		is_confirmed: false,
			// 		purchase_user_token: userLogin!.id,
			// 		sales_user_token: postData!.userToken,
			// 		pay_type: "point"
			// 	}

			// 	await apiClient.insertPurchaseSaleHistory(purchaseSaleHistory);
			// }

		}, onSuccess: async (result) => {
			// if (postData) {
			// 	// 구매자수 update
			// 	console.log("구매자수 update")
			// 	await apiClient.updateBuyerCount(postData.buyerCount + 1, postData.id);
			// }


			// todo 구매자에게 구매 알림

		},
	});

	const onClickConfirm = useCallback(async () => {
		try {
			if (postData && userLogin?.id) {
				mutate();
				const todayDate = createTodayDate();


				navigate('/');
				toast.success('구매가 완료되었습니다.');

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

export default PointPaymentDialog;