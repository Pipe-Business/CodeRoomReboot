import {useMutation} from '@tanstack/react-query';
import {apiClient} from "../../api/ApiClient";
import {BootPayPaymentEntity} from "../../data/entity/BootpayPaymentEntity";
import {CashHistoryRequestEntity} from "../../data/entity/CashHistoryRequestEntity";
import {PointHistoryRequestEntity} from "../../data/entity/PointHistoryRequestEntity";

export const useMutateBootPayPaymentRequest = () => {
	const { mutateAsync } = useMutation({
		mutationFn: async (data: BootPayPaymentEntity) => {
			return await apiClient.insertBootpayPayment(data);
		},
		onSuccess: async (id) => {
			return id;
		},

	});
	return {
		mutateBootpayRequest: mutateAsync,
	};
};

/**
 * 캐시 정산하는 mutate
 */
export const useMutateSettleCashBySeller = () => {
	const { mutateAsync } = useMutation({
		mutationFn: async (data:{cashHistoryRequestEntity : CashHistoryRequestEntity, cashAmount: number}) => {
			const {cashHistoryRequestEntity,cashAmount } = data;
			await apiClient.insertUserCashHistory(cashHistoryRequestEntity); // 판매자에게 캐시 정산 insert
			await apiClient.updateTotalCash(cashHistoryRequestEntity.user_token,cashAmount);
		},
	});
	return {
		settleCashMutate: mutateAsync,
	};
};

/**
 * 캐시 정산하는 mutate
 */
export const useMutateSettleCoinBySeller = () => {
	const { mutateAsync } = useMutation({
		mutationFn: async (data:{coinHistoryRequestEntity : PointHistoryRequestEntity, coinAmount: number}) => {
			const {coinHistoryRequestEntity,coinAmount } = data;
			await apiClient.insertUserPointHistory(coinHistoryRequestEntity); // 판매자에게 캐시 정산 insert
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