import {UsersCoinHistoryRes} from "../../../../data/entity/UsersCoinHistoryRes";
import React, {FC} from "react";
import {ListItem, ListItemText} from '@mui/material';
import {reformatTime} from "../../../../utils/DayJsHelper";
import {CoinHistoryType} from "../../../../enums/CoinHistoryType";

interface Props {
    coinHistoryData: UsersCoinHistoryRes;
}

const CoinHistoryItem: FC<Props> = ({coinHistoryData}) => {
    return (
        <>
            {
                coinHistoryData &&
                (
                    <ListItem>
                        <ListItemText>
                            <div style={{display: 'flex'}}>
                                <div style={{width: '20%'}}>
                                    {reformatTime(coinHistoryData?.created_at!)}
                                </div>
                                <div style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    width: '30%'
                                }}>{coinHistoryData?.description!}</div>
                                <div style={{width: '20%'}}>
                                    {
                                        `${coinHistoryData!.coin_history_type === CoinHistoryType.earn_coin ? '+' : '-'}
                                        ${coinHistoryData!.coin}
                                        코인
                                        `
                                    }
                                </div>
                                <div style={{width: '10%'}}>
                                    {`${coinHistoryData!.amount.toLocaleString()} 코인`}
                                </div>
                            </div>
                        </ListItemText>
                    </ListItem>
                )
            }
        </>
    );
}

export default CoinHistoryItem;