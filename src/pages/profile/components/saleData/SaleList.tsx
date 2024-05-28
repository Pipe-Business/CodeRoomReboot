import React, { FC } from 'react';
import { List } from '@mui/material';
import { User } from '@supabase/supabase-js';
import SaleItem from './SaleItem';
import {ListItem,ListItemText} from '@mui/material';


interface Props {
	children?: React.ReactNode,
	saleData?: PurchaseSaleResponseEntity[] | null,
}

const TableHeader: FC = () => {
    return <ListItem>
        <ListItemText>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: '40%' ,fontWeight:'bold'}}>코드제목</div>
                <div style={{ width: '20%' ,fontWeight:'bold'}}>구매가격</div>
                <div style={{ width: '20%' ,fontWeight:'bold'}}>구매방식</div>
                <div style={{ width: '20%' ,fontWeight:'bold'}}>판매된 시각</div>
            </div>
        </ListItemText>

    </ListItem>;
};

const SaleList: FC<Props> = ({ saleData }) => {

	//console.log("purchase",purchaseData);
	return (
		<>
			<List>
                <TableHeader />
				{saleData && saleData.map((v,i) => {
					return <SaleItem key={i} saleData={v}/>;
				})}
			</List>
		</>
	);
};

export default SaleList;