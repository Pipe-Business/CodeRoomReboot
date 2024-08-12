import React, {FC} from 'react';
import {useLocation} from 'react-router-dom';
import FullLayout from '../../layout/FullLayout';
import {Box} from '@mui/material';
import CashHistoryList from './components/CashHistoryData/CashHistoryList';


interface Props {
	children?: React.ReactNode,
}

const CashCoinHistoryDataPage: FC<Props> = () => {

	const { state: {
		title,
		cashPointHistoryData,
	} } = useLocation();

	return (
		<FullLayout>
			<Box height={32} />
			<h2>{title}</h2>
			{cashPointHistoryData && <CashHistoryList cashPointHistory={cashPointHistoryData}/>}
		</FullLayout>
	);
};

export default CashCoinHistoryDataPage;