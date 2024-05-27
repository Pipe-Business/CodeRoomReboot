import React, { FC } from 'react';
import PurchaseItem from './PurchaseItem.tsx';
import { List } from '@mui/material';
import { User } from '@supabase/supabase-js';

interface Props {
	children?: React.ReactNode,
	purchaseData?: PurchaseSaleResponseEntity[] | null,
	userLogin:User
}

const PurchaseList: FC<Props> = ({ purchaseData, userLogin }) => {
	//console.log("purchase",purchaseData);
	return (
		<>
			<List>
				{purchaseData && purchaseData.map((v,i) => {
					return <PurchaseItem key={i} purchaseData={v} userLogin={userLogin}/>;
				})}
			</List>
		</>
	);
};

export default PurchaseList;