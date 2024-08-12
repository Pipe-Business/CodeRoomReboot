import {useMutation} from '@tanstack/react-query';
import {apiClient} from "../../api/ApiClient";
import {UsersCoinHistoryReq} from "../../data/entity/UsersCoinHistoryReq";

// /**
//  * 캐시 정산하는 mutate  // TODO : 캐시 기록이 아니라 purchase_sale_history_table과 bootpay_payment table을 사용하여 다시 작성
//  */
// export const useMutateSettleCashBySeller = () => {
// 	const { mutateAsync } = useMutation({
// 		mutationFn: async (data:{cashHistoryRequestEntity : CashHistoryRequestEntity, cashAmount: number}) => {
// 			const {cashHistoryRequestEntity,cashAmount } = data;
// 			await apiClient.insertUserCashHistory(cashHistoryRequestEntity); // 판매자에게 캐시 정산 insert
// 			await apiClient.updateTotalCash(cashHistoryRequestEntity.user_token,cashAmount);
// 		},
// 	});
// 	return {
// 		settleCashMutate: mutateAsync,
// 	};
// };

/**
 * 캐시 정산하는 mutate
 */
export const useMutateSettleCoinBySeller = () => {
	const { mutateAsync } = useMutation({
		mutationFn: async (data:{coinHistoryRequestEntity : UsersCoinHistoryReq, coinAmount: number}) => {
			const {coinHistoryRequestEntity,coinAmount } = data;
			await apiClient.insertUserCoinHistory(coinHistoryRequestEntity); // 판매자에게 캐시 정산 insert
			await apiClient.updateTotalPoint(coinHistoryRequestEntity.user_token,coinAmount);
		},
	});
	return {
		settleCoinMutate: mutateAsync,
	};
};

/**
 * 구매기록에서 정산 status를 true 변경하는 mutate
 */
export const useMutateUpdateConfirmedStatus = () => {
	const {mutateAsync} = useMutation({
		mutationFn : async (data: {purchase_user_token: string, sales_user_token: string,postId: number, date:string}) => {
			const {purchase_user_token, sales_user_token, postId,date} = data;
			await apiClient.updatePurchaseSaleIsConfirmed(purchase_user_token, sales_user_token, postId, date);
		}
	})

	return {
		updatePayConfirmedMutate: mutateAsync,
	};
};