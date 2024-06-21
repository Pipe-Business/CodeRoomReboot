import React, { FC } from 'react';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';
import PointItem from './PointItem';
import { useQueryUserLogin } from '../../../hooks/fetcher/UserFetcher';
import {CACHE_CHARGE_PRD, CACHE_CHARGE_PRD_NAME, REWARD_COIN} from "../../../constants/define";

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
			<PointItem paymentCash={CACHE_CHARGE_PRD.CACHE_1000} bonusPoint={REWARD_COIN.CACHE_CHARGE_1000_BONUS_COIN} paymentPrice={CACHE_CHARGE_PRD.CACHE_1000} orderName={CACHE_CHARGE_PRD_NAME.CACHE_1000} />
			<PointItem paymentCash={CACHE_CHARGE_PRD.CACHE_3000} bonusPoint={REWARD_COIN.CACHE_CHARGE_3000_BONUS_COIN} paymentPrice={CACHE_CHARGE_PRD.CACHE_3000} orderName={CACHE_CHARGE_PRD_NAME.CACHE_3000} />
			<PointItem paymentCash={CACHE_CHARGE_PRD.CACHE_5000} bonusPoint={REWARD_COIN.CACHE_CHARGE_5000_BONUS_COIN} paymentPrice={CACHE_CHARGE_PRD.CACHE_5000} orderName={CACHE_CHARGE_PRD_NAME.CACHE_5000} />
			<PointItem paymentCash={CACHE_CHARGE_PRD.CACHE_10000} bonusPoint={REWARD_COIN.CACHE_CHARGE_10000_BONUS_COIN} paymentPrice={CACHE_CHARGE_PRD.CACHE_10000} orderName={CACHE_CHARGE_PRD_NAME.CACHE_10000} />
		</>
	);
};

export default PointData;