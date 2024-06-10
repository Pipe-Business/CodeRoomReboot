import React, {FC} from 'react';
import {useLocation} from 'react-router-dom';
import FullLayout from '../../layout/FullLayout';
import {Box} from '@mui/material';
import MentoringList from './components/mentoringData/MentoringList';

interface Props {
	children?: React.ReactNode,
}

const MyMentoringDataPage: FC<Props> = () => {

	const { state: {
		userLogin,
		mentoringData,
	} } = useLocation();

	return (
		<FullLayout>
			<Box height={32} />
			<h2>내가 신청한 멘토링</h2>
			<MentoringList mentoringData={mentoringData} userLogin={userLogin} />
		</FullLayout>
	);
};

export default MyMentoringDataPage;