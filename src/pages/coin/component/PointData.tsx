import React, { FC } from 'react';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';
import PointItem from './PointItem';
import { useQueryUserLogin } from '../../../hooks/fetcher/UserFetcher';

interface Props {
	children?: React.ReactNode;
}

const PointData: FC<Props> = () => {
	 const { userLogin } = useQueryUserLogin();


	if (!userLogin) {
		toast.error('로그인후 이용해주세요');
		return <Navigate to={'/'} />;
	}

	return (
		<>
			<PointItem paymentCash={1000} bonusPoint={500} paymentPrice={1000} orderName={'코드룸 캐시 1000+보너스500p'} />
			<PointItem paymentCash={3000} bonusPoint={1500} paymentPrice={3000} orderName={'코드룸 캐시 3000+보너스1500p'} />
			<PointItem paymentCash={5000} bonusPoint={2500} paymentPrice={5000} orderName={'코드룸 캐시 5000+보너스2500p'} />
			<PointItem paymentCash={10000} bonusPoint={5000} paymentPrice={10000} orderName={'코드룸 캐시 10000+보너스5000p'} />
		</>
	);
};

export default PointData;