import React, {FC} from 'react';
import {useLocation} from 'react-router-dom';
import FullLayout from '../../layout/FullLayout';
import PurchaseList from './components/purchaseData/PurchaseList';
import {Box} from '@mui/material';

interface Props {
	children?: React.ReactNode,
}

const MyPurchaseDataPage: FC<Props> = () => {

	const { state: {
		userLogin,
		purchaseData,
	} } = useLocation();

	return (
		<FullLayout>
			<Box height={32} />
			<h2>내가 구매한 코드</h2>
			<PurchaseList purchaseData={purchaseData}/>
		</FullLayout>
	);
};

export default MyPurchaseDataPage;