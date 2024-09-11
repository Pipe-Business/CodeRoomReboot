import React, { FC } from 'react';
import {
    ListItem, ListItemText, Typography, Box, Tooltip, useTheme
} from '@mui/material';
import { UsersCoinHistoryRes } from "../../../../data/entity/UsersCoinHistoryRes";
import { reformatTime } from "../../../../utils/DayJsHelper";
import { CoinHistoryType } from "../../../../enums/CoinHistoryType";
import { useQueryUserById} from "../../../../hooks/fetcher/UserFetcher";

interface CoinHistoryItemProps {
    coinHistoryItem: UsersCoinHistoryRes;
}

const CoinHistoryItem: FC<CoinHistoryItemProps> = ({ coinHistoryItem }) => {
    const theme = useTheme();
    const { userById } = useQueryUserById(coinHistoryItem.user_token!);

    return (
        <ListItem divider>
            <ListItemText>
                <Box display="flex" alignItems="center">
                    <Typography variant="body2" sx={{ width: '20%', px: 1 }}>
                        {reformatTime(coinHistoryItem.created_at)}
                    </Typography>
                    <Typography variant="body2" sx={{ width: '20%', px: 1 }}>
                        {userById?.nickname || "Unknown User"}
                    </Typography>
                    <Tooltip title={coinHistoryItem.description} arrow>
                        <Typography variant="body2" sx={{
                            width: '30%',
                            px: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            {coinHistoryItem.description}
                        </Typography>
                    </Tooltip>
                    <Typography variant="body2" sx={{ width: '15%', textAlign: 'right', px: 1 }}>
                        {coinHistoryItem.coin.toLocaleString()} 코인
                    </Typography>
                    <Typography variant="body2" sx={{
                        width: '15%',
                        textAlign: 'center',
                        px: 1,
                        color: coinHistoryItem.coin_history_type === CoinHistoryType.earn_coin
                            ? theme.palette.success.main
                            : theme.palette.error.main
                    }}>
                        {coinHistoryItem.coin_history_type === CoinHistoryType.earn_coin ? "적립" : "사용"}
                    </Typography>
                </Box>
            </ListItemText>
        </ListItem>
    );
};

export default CoinHistoryItem;