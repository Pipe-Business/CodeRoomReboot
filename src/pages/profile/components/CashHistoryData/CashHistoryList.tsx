import React, {FC} from 'react';
import {List, ListItem, ListItemText} from '@mui/material';
import CashHistoryItem from './CashHistoryItem';
import {CashHistoryResponseEntity} from "../../../../data/entity/CashHistoryResponseEntity";
import {PointHistoryResponseEntity} from "../../../../data/entity/PointHistoryResponseEntity";


interface Props {
	children?: React.ReactNode,
	cashHistoryData? : CashHistoryResponseEntity[],
	pointHistoryData? : PointHistoryResponseEntity[],
}

const TableHeader: FC = () => {
    return <ListItem>
        <ListItemText>
            <div style={{display: 'flex',}}>
                <div style={{width: '20%', fontWeight: 'bold'}}>시각</div>
                <div style={{width: '30%', fontWeight: 'bold'}}>내역</div>
                <div style={{width: '10%', fontWeight: 'bold'}}>구분</div>
                <div style={{width: '20%', fontWeight: 'bold'}}>금액</div>
                <div style={{width: '20%', fontWeight: 'bold'}}>총 금액</div>
            </div>
        </ListItemText>

    </ListItem>;
};

const CashHistoryList: FC<Props> = ({ cashHistoryData, pointHistoryData }) => {
	return (
		<>
			{cashHistoryData && <List>
                <TableHeader />
				{cashHistoryData && cashHistoryData.map((v,i) => {
					return <CashHistoryItem key={i} cashHistoryData={v}/>;
				})}
			</List>}

			{pointHistoryData && <List>
                <TableHeader />
				{pointHistoryData && pointHistoryData.map((v,i) => {
					return <CashHistoryItem key={i} pointHistoryData={v}/>;
				})}
			</List>}
		</>
	);
};

export default CashHistoryList;