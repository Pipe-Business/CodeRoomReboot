import React, {FC} from 'react';
import {Divider, ListItem, ListItemText} from '@mui/material';
import {reformatTime} from '../../../../utils/DayJsHelper';
import {CashPointHistoryEntity} from "../../../../data/model/CashPointHistoryEntity";
import {CashHistoryType} from "../../../../enums/CashHistoryType";
import {PointHistoryType} from "../../../../enums/PointHistoryType";

interface Props {
    children?: React.ReactNode;
    cashPointHistory:CashPointHistoryEntity,
}

const CashHistoryItem: FC<Props> = ({ cashPointHistory }) => {

    return (
        <>
            {/* { cashHistoryData && <ListItemButton> */}

            { cashPointHistory &&

                <ListItem>
                    <ListItemText>
                        <div style={{display: 'flex'}}>
                            <div style={{width: '20%'}}>
                                {reformatTime(cashPointHistory?.created_at!)}
                            </div>
                            <div style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                width: '30%'
                            }}>{cashPointHistory?.description!}</div>

                            {/*<div style={{width: '10%'}}>*/}
                            {/*    {cashPointHistory!.price_history_type === CashHistoryType.earn_cash ? '충전' : cashPointHistory!.price_history_type ===  PointHistoryType.earn_point ? '획득': '사용'}*/}
                            {/*</div>*/}
                            {/*<div style={{width: '20%'}}>*/}
                            {/*    {cashPointHistory!.pay_type === 'point' ? '코인'  : '캐시'}*/}
                            {/*</div>*/}
                            <div style={{width: '20%'}}>
                                {
                                    `${cashPointHistory!.price_history_type === CashHistoryType.earn_cash ? '+' : cashPointHistory!.price_history_type ===  PointHistoryType.earn_point ? '+': '-'}
                                     ${cashPointHistory!.price}
                                     ${cashPointHistory!.pay_type === 'point' ? '코인'  : '캐시'}`
                                }
                            </div>
                            <div style={{width: '10%'}}>
                                {`
                                ${cashPointHistory!.amount}
                                ${cashPointHistory!.pay_type === 'point' ? '코인' : '캐시'}
                                `}
                            </div>

                        </div>
                    </ListItemText>
                </ListItem>

                // </ListItemButton>
            }
            <Divider/>
        </>

    );
};
export default CashHistoryItem;