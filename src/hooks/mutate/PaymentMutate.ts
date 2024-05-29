import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/ApiClient.ts';
import { toast } from 'react-toastify';
import { createTodayDate } from '../../utils/DayJsHelper.ts';
import { BootPayPaymentEntity } from '../../data/entity/BootpayPaymentEntity.ts';
import { PurchaseSaleRequestEntity } from '../../data/entity/PurchaseSaleRequestEntity.ts';

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
 * 포인트 정산하는 mutate
 */
export const useMutateSettleCashBySeller = () => {
	const { mutateAsync } = useMutation({
		mutationFn: async (cashHistoryRequestEntity : CashHistoryRequestEntity) => {
			await apiClient.insertUserCashHistory(cashHistoryRequestEntity); // 판매자에게 캐시 정산 insert
		},
	});
	return {
		settleCashMutate: mutateAsync,
	};
};
/**
 * 구매기록에서 정산 status를 true 변경하는 mutate
 */
export const useMutateUpdateConfirmedStatus = () => {
	const {mutateAsync} = useMutation({
		mutationFn : async (data: {purchase_user_token: string, sales_user_token: string,postId: number}) => {
			const {purchase_user_token, sales_user_token, postId} = data;
			await apiClient.updatePurchaseSaleIsConfirmed(purchase_user_token, sales_user_token, postId);
		}
	})

	return {
		updatePayConfirmedMutate: mutateAsync,
	};
};