import {UsersCoinHistoryRes} from "../../../../data/entity/UsersCoinHistoryRes";
import React, {FC} from "react";
import {List, ListItem, ListItemText} from "@mui/material";
import CoinHistoryItem from "./CoinHistoryItem";

interface Props {
    coinHistory: UsersCoinHistoryRes[],
}
const TableHeader: FC = () => {
    return <ListItem>
        <ListItemText>
            <div style={{display: 'flex',}}>
                <div style={{width: '20%', fontWeight: 'bold'}}>시각</div>
                <div style={{width: '30%', fontWeight: 'bold'}}>내역</div>
                <div style={{width: '20%', fontWeight: 'bold'}}>금액</div>
                <div style={{width: '10%', fontWeight: 'bold'}}>총 금액</div>
            </div>
        </ListItemText>

    </ListItem>;
};


const CoinHistoryList: FC<Props> = ({coinHistory}) => {
    return (
        <>
            {coinHistory && <List>
                <TableHeader />
                {coinHistory && coinHistory.map((v,i) => {
                    return <CoinHistoryItem key={i} coinHistoryData={v}/>;
                })}
            </List>}
        </>
    );
}

export default CoinHistoryList;