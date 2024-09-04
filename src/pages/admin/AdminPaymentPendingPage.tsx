import React, { FC, useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { apiClient } from "../../api/ApiClient";
import { PurchaseSaleRes } from "../../data/entity/PurchaseSaleRes";
import PaymentPendingItem from "./components/paymentPending/PaymentPendingItem";

interface Props {
	children?: React.ReactNode;
	isSettlement: boolean;
}

interface RequestMoneyGroupByUserToken {
	[key: string]: PurchaseSaleRes[];
}

const AdminPaymentPendingPage: FC<Props> = ({ isSettlement }) => {
	const [selectedMonth, setSelectedMonth] = useState<string>('all');

	const { isLoading: paymentPendingLoading, data: paymentPendingData, refetch } = useQuery({
		queryKey: ['/purchaseSalehistory', selectedMonth],
		queryFn: async () => {
			if (selectedMonth) {
				const [year, month] = selectedMonth.split('-');
				const startDate = dayjs(`${year}-${month}-01`).startOf('month').format('YYYY-MM-DD HH:mm:ss');
				const endDate = dayjs(`${year}-${month}-01`).endOf('month').format('YYYY-MM-DD HH:mm:ss');
				return await apiClient.getAdminPurchaseSaleHistory(startDate, endDate);
			}
		}
	});

	const handleMonthChange = (event: SelectChangeEvent<string>) => {
		const value = event.target.value;
		setSelectedMonth(value);
	};

	const groupDataByUserToken = useCallback((data: PurchaseSaleRes[] | null): RequestMoneyGroupByUserToken => {
		if (!data) return {};
		return data.reduce((acc, item) => {
			if (!acc[item.sales_user_token]) {
				acc[item.sales_user_token] = [];
			}
			acc[item.sales_user_token].push(item);
			return acc;
		}, {} as RequestMoneyGroupByUserToken);
	}, []);

	if (paymentPendingLoading) {
		return <Typography>로딩중...</Typography>;
	}

	if (!paymentPendingData) {
		return <Typography>데이터가 없습니다.</Typography>;
	}

	const pendingDataGroupByUserToken = groupDataByUserToken(paymentPendingData);

	return (
		<Box>
			<FormControl fullWidth margin="normal">
				<InputLabel id="month-select-label">월 선택</InputLabel>
				<Select
					labelId="month-select-label"
					id="month-select"
					value={selectedMonth}
					label="월 선택"
					onChange={handleMonthChange}
				>
					{Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
						<MenuItem key={month} value={`2024-${month.toString().padStart(2, '0')}`}>
							2024년 {month}월
						</MenuItem>
					))}
				</Select>
			</FormControl>

			{Object.keys(pendingDataGroupByUserToken).map((key) => (
				<PaymentPendingItem
					key={key}
					salesUserToken={key}
					item={pendingDataGroupByUserToken[key]}
					selectedMonth={selectedMonth}
				/>
			))}
		</Box>
	);
};

export default AdminPaymentPendingPage;