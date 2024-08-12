import React, {FC} from 'react';
import {List, ListItem, ListItemText} from '@mui/material';
import CashConfirmItem from './CashConfirmItem';
import {PurchaseSaleRes} from '../../../../data/entity/PurchaseSaleRes';


interface Props {
	children?: React.ReactNode,
	cashConfirmData?: PurchaseSaleRes[] | null,
}

const TableHeader: FC = () => {
    return <ListItem>
        <ListItemText>
            <div style={{display: 'flex',}}>
                <div style={{width: '20%', fontWeight: 'bold'}}>판매된 시각</div>
                <div style={{width: '50%', fontWeight: 'bold'}}>코드제목</div>
                <div style={{width: '30%', fontWeight: 'bold'}}>구매가격</div>
            </div>
        </ListItemText>

    </ListItem>;
};

const CashConfirmList: FC<Props> = ({ cashConfirmData }) => {

	//console.log("purchase",purchaseData);
	return (
		<>
			<List>
                <TableHeader />
				{cashConfirmData && cashConfirmData.map((v,i) => {
					return <CashConfirmItem key={i} cashConfirmData={v}/>;
				})}
			</List>
		</>
	);
};

export default CashConfirmList;