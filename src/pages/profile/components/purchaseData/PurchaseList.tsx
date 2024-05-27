import React, { FC } from 'react';
import PurchaseItem from './PurchaseItem.tsx';
import { List } from '@mui/material';
import { User } from '@supabase/supabase-js';

interface Props {
	children?: React.ReactNode,
	purchaseData?: PurchaseSaleResponseEntity[] | null,
}

const PurchaseList: FC<Props> = ({ purchaseData}) => {
	//console.log("purchase",purchaseData);
	return (
		<>
			<List>
				{purchaseData && purchaseData.map((v,i) => {
					return <PurchaseItem key={i} purchaseData={v}/>;
				})}
			</List>
		</>
	);
};

export default PurchaseList;