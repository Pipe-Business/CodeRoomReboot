import React, { FC } from 'react';

import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { User } from '@supabase/supabase-js';
import FullLayout from '../../layout/FullLayout';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import PurchaseList from './components/purchaseData/PurchaseList';
import { Box } from '@mui/material';
import MentoringList from './components/mentoringData/MentoringList';
import MyCodeList from './components/code/MyCodeList';
import CodePendingOrPendingList from './components/code/MyCodeList';

interface Props {
	children?: React.ReactNode,
}

const MyCodeDataPage: FC<Props> = () => {

	const { state: {
        type,
		codeData,
	} } = useLocation();

	return (
		<FullLayout>
			<Box height={32} />
			<h2></h2>
			<CodePendingOrPendingList  maxCount={false} data={codeData} type={type}/>
		</FullLayout>
	);
};

export default MyCodeDataPage;