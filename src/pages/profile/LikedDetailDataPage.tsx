import React, {FC} from 'react';
import {useLocation} from 'react-router-dom';
import FullLayout from '../../layout/FullLayout';
import {Box} from '@mui/material';
import LikedList from "./components/likedData/LikedList";

interface Props {
	children?: React.ReactNode,
}

const LikedDetailDataPage: FC<Props> = () => {

	const { state: {
		likedData,
	} } = useLocation();

	return (
		<FullLayout>
			<Box height={32} />
			<h2>위시리스트에 추가한 게시글</h2>
			<LikedList likedData={likedData} />
		</FullLayout>
	);
};

export default LikedDetailDataPage;