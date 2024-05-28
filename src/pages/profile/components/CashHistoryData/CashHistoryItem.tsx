import React, { FC, useCallback } from 'react';
import { Divider, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../../../../api/ApiClient';
import { reformatTime } from '../../../../utils/DayJsHelper';

interface Props {
    children?: React.ReactNode;
    cashHistoryData: CashHistoryResponseEntity;
}

const CashHistoryItem: FC<Props> = ({ cashHistoryData }) => {

    return (
        <>
            <ListItemButton>
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
                                {cashHistoryData.cash}
                            </div>
                            <div style={{  width:'20%'}}>
                                {cashHistoryData.amount}
                            </div>
                            <div style={{  width:'10%'}}>
                                {cashHistoryData.cash_history_type == 'earn_cash' ? '충전' : '사용'}
                            </div>
                            
                            <div style={{  width:'20%'}}>
                                {reformatTime(cashHistoryData?.created_at!)}
                            </div>
                        </div>
                    </ListItemText>
                </ListItem>

            </ListItemButton>
            <Divider />
        </>

    );
};
export default CashHistoryItem;