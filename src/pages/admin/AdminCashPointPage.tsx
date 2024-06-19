import React, {FC} from 'react';
import AdminCashPointList from './components/cashPaymentCharge/AdminCashPointList';

interface Props {
	children?: React.ReactNode;
	type: 'cash' | 'point';
}

// 캐시/코인
const AdminCashPointPage: FC<Props> = ({type}) => {
	return (
		<AdminCashPointList type={type}/>
	);
}

export default AdminCashPointPage;