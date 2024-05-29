import React, { FC, useCallback, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import AdminCashPaymentChargeList from './components/cashPaymentCharge/AdminCashPaymentChargeList';

interface Props {
	children?: React.ReactNode;
}

const AdminCashPaymentChargePage: FC<Props> = () => {
	const [selectFilter, setSelectFilter] = useState('0');
	const handleChange = useCallback((event: SelectChangeEvent) => {
		setSelectFilter(event.target.value as string);
	}, []);

	return (
		<>
			{/* <div style={{ display: 'flex', justifyContent: 'end' }}>
				<FormControl>
					<InputLabel id='demo-simple-select-label'>충전&지급 필터</InputLabel>
					<Select
						labelId='demo-simple-select-label'
						value={selectFilter}
						label={'s'}
						onChange={handleChange}>
						<MenuItem value={'0'}>전체보기</MenuItem>
						<MenuItem value={'1'}>결제</MenuItem>
						<MenuItem value={'2'}>지급</MenuItem>
					</Select>
				</FormControl>
			</div> */}
			{/* <AdminCashPaymentChargeList
				filter={selectFilter === '0' ? 'all' : selectFilter === '1' ? 'payment' : 'supply'} /> */}
				<AdminCashPaymentChargeList />

		</>
	);
};

export default AdminCashPaymentChargePage;