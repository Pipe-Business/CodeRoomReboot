import React, {FC} from 'react';
import {Divider, ListItem, ListItemText} from '@mui/material';
import {reformatTime} from '../../../../utils/DayJsHelper';
import {CashHistoryResponseEntity} from "../../../../data/entity/CashHistoryResponseEntity";
import {PointHistoryResponseEntity} from "../../../../data/entity/PointHistoryResponseEntity";

interface Props {
    children?: React.ReactNode;
    cashHistoryData?: CashHistoryResponseEntity;
    pointHistoryData?: PointHistoryResponseEntity;
}

const CashHistoryItem: FC<Props> = ({ cashHistoryData, pointHistoryData }) => {

    return (
        <>
            {/* { cashHistoryData && <ListItemButton> */}

            { cashHistoryData && 

                <ListItem>
                    <ListItemText>
                        <div style={{ display: 'flex' }}>

                            <div style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                width:'30%'
                            }}>{cashHistoryData?.description!}</div>

                            <div style={{  width:'20%'}}>
                                {cashHistoryData!.cash}
                            </div>
                            <div style={{  width:'20%'}}>
                                {cashHistoryData!.amount}
                            </div>
                            <div style={{  width:'10%'}}>
                                {cashHistoryData!.cash_history_type == 'earn_cash' ? '충전' : '사용'}
                            </div>
                            
                            <div style={{  width:'20%'}}>
                                {reformatTime(cashHistoryData?.created_at!)}
                            </div>
                        </div>
                    </ListItemText>
                </ListItem>

            // </ListItemButton>
            }


            { pointHistoryData && 
                <ListItem>
                    <ListItemText>
                        <div style={{ display: 'flex' }}>

                            <div style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                width:'30%'
                            }}>{pointHistoryData?.description!}</div>

                            <div style={{  width:'20%'}}>
                                {pointHistoryData!.point}
                            </div>
                            <div style={{  width:'20%'}}>
                                {pointHistoryData!.amount}
                            </div>
                            <div style={{  width:'10%'}}>
                                {pointHistoryData!.point_history_type == 'earn_point' ? '획득' : '사용'}
                            </div>
                            
                            <div style={{  width:'20%'}}>
                                {reformatTime(pointHistoryData?.created_at!)}
                            </div>
                        </div>
                    </ListItemText>
                </ListItem>
            }
          
            <Divider />
        </>

    );
};
export default CashHistoryItem;