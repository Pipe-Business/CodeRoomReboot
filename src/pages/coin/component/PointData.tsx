import React, { FC } from 'react';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';
import PointItem from './PointItem';

interface Props {
	children?: React.ReactNode;
}

const PointData: FC<Props> = () => {
	// const { userLogin } = useQueryUserLogin();


	// if (!userLogin) {
	// 	toast.error('로그인후 이용해주세요');
	// 	return <Navigate to={'/'} />;
	// }

	return (
		<>
			<PointItem paymentPoint={1000} paymentPrice={100} orderName={'코드룸 캐시 1000p'} />
			<PointItem paymentPoint={3000} bonusPoint={500} paymentPrice={300} orderName={'코드룸 캐시 3000p+보너스500p'} />
			<PointItem paymentPoint={5000} bonusPoint={1500} paymentPrice={500} orderName={'코드룸 캐시 5000p+보너스1500p'} />
		</>
	);
};

export default PointData;