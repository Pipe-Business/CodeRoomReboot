import React, { FC } from 'react';

import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { User } from '@supabase/supabase-js';
import FullLayout from '../../layout/FullLayout';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import PurchaseList from './components/purchaseData/PurchaseList';
import { Box } from '@mui/material';
import SaleList from './components/saleData/SaleList';

interface Props {
	children?: React.ReactNode,
}

const MySaleDataPage: FC<Props> = () => {

	const { state: {
		saleData,
	} } = useLocation();

	return (
		<FullLayout>
			<Box height={32} />
			<h2>내가 판매한 코드</h2>
			<SaleList saleData={saleData}/>
		</FullLayout>
	);
};

export default MySaleDataPage;