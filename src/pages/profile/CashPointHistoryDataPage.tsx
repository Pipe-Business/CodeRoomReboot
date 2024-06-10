import React, {FC} from 'react';
import {useLocation} from 'react-router-dom';
import FullLayout from '../../layout/FullLayout';
import {Box} from '@mui/material';
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