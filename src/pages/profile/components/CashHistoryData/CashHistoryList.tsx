import React, {FC} from 'react';
import {List, ListItem, ListItemText} from '@mui/material';
import CashHistoryItem from './CashHistoryItem';
import {CashCoinHistoryEntity} from "../../../../data/model/CashCoinHistoryEntity";


interface Props {
	children?: React.ReactNode,
	cashPointHistory:CashCoinHistoryEntity[],
}

const TableHeader: FC = () => {
    return <ListItem>
        <ListItemText>
            <div style={{display: 'flex',}}>
                <div style={{width: '20%', fontWeight: 'bold'}}>시각</div>
                <div style={{width: '30%', fontWeight: 'bold'}}>내역</div>
                {/*<div style={{width: '10%', fontWeight: 'bold'}}>구분</div>*/}
                {/*<div style={{width: '20%', fontWeight: 'bold'}}>코인/캐시</div>*/}
                <div style={{width: '20%', fontWeight: 'bold'}}>금액</div>
                <div style={{width: '10%', fontWeight: 'bold'}}>총 금액</div>
            </div>
        </ListItemText>

    </ListItem>;
};

const CashHistoryList: FC<Props> = ({cashPointHistory}) => {
	return (
		<>
			{cashPointHistory && <List>
                <TableHeader />
				{cashPointHistory && cashPointHistory.map((v,i) => {
					return <CashHistoryItem key={i} cashPointHistory={v}/>;
				})}
			</List>}

		</>
	);
};

export default CashHistoryList;