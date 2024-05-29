import React, { FC } from 'react';

import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { User } from '@supabase/supabase-js';
import FullLayout from '../../layout/FullLayout';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import PurchaseList from './components/purchaseData/PurchaseList';
import { Box } from '@mui/material';
import CashConfirmList from './components/cashData/CashConfirmList';
import CashHistoryList from './components/CashHistoryData/CashHistoryList';


interface Props {
	children?: React.ReactNode,
}

const CashPointHistoryDataPage: FC<Props> = () => {

	const { state: {
		title,
		cashHistoryData,
		pointHistoryData,
	} } = useLocation();

	return (
		<FullLayout>
			<Box height={32} />
			<h2>{title}</h2>
			{cashHistoryData && <CashHistoryList cashHistoryData={cashHistoryData}/>}
			{pointHistoryData && <CashHistoryList pointHistoryData={pointHistoryData}/>}
		</FullLayout>
	);
};

export default CashPointHistoryDataPage;