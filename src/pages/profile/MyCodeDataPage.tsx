import React, {FC} from 'react';
import {useLocation} from 'react-router-dom';
import FullLayout from '../../layout/FullLayout';
import {Box} from '@mui/material';
import CodePendingOrPendingList from './components/code/MyCodeList';
import MainLayout from "../../layout/MainLayout";

interface Props {
	children?: React.ReactNode,
}

const MyCodeDataPage: FC<Props> = () => {

	const { state: {
        type,
		codeData,
	} } = useLocation();

	return (
		<MainLayout>
			<Box height={32} />
			<h2></h2>
			<CodePendingOrPendingList  maxCount={false} data={codeData}/>
		</MainLayout>
	);
};

export default MyCodeDataPage;