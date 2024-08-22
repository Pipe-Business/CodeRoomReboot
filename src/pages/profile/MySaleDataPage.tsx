import React, {FC} from 'react';
import {useLocation} from 'react-router-dom';
import FullLayout from '../../layout/FullLayout';
import {Box} from '@mui/material';
import SaleList from './components/sale/SaleList';

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