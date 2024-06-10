import React, {FC} from 'react';
import {useLocation} from 'react-router-dom';
import FullLayout from '../../layout/FullLayout';
import {Box} from '@mui/material';
import CashConfirmList from './components/cashData/CashConfirmList';

interface Props {
	children?: React.ReactNode,
}

const CashConfirmDataPage: FC<Props> = () => {

	const { state: {
		title,
		cashConfirm,
	} } = useLocation();

	return (
		<FullLayout>
			<Box height={32} />
			<h2>{title}</h2>
			<CashConfirmList cashConfirmData={cashConfirm}/>
		</FullLayout>
	);
};

export default CashConfirmDataPage;