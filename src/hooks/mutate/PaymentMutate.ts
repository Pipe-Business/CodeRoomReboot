import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/ApiClient.ts';
import { toast } from 'react-toastify';
import { createTodayDate } from '../../utils/DayJsHelper.ts';
import { BootPayPaymentEntity } from '../../data/entity/BootpayPaymentEntity.ts';

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

