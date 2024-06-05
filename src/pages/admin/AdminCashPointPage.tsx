import React, { FC, useCallback, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import AdminCashPointList from './components/cashPaymentCharge/AdminCashPointList';

interface Props {
	children?: React.ReactNode;
	type: 'cash' | 'point';
}

// 캐시/ 포인트
const AdminCashPointPage: FC<Props> = ({type}) => {
	return (
		<AdminCashPointList type={type}/>
	);
}

export default AdminCashPointPage;