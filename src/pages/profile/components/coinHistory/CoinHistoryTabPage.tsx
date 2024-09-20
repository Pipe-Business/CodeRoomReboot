import React, { FC } from "react";
import { useQueryUserLogin } from "../../../../hooks/fetcher/UserFetcher";
import { useQuery } from "@tanstack/react-query";
import { REACT_QUERY_KEY } from "../../../../constants/define";
import { apiClient } from "../../../../api/ApiClient";
import {
    Box, Paper, Table, TableContainer, Typography, TableBody,
    TableRow, TableCell, Tooltip, useTheme, TableHead
} from "@mui/material";
import { TotalAmountTitleText } from "../../styles";
import ListLoadingSkeleton from "../ListLoadingSkeleton";
import ListEmptyText from "../ListEmptyText";
import { UsersCoinHistoryRes } from "../../../../data/entity/UsersCoinHistoryRes";
import { reformatTime } from "../../../../utils/DayJsHelper";
import { CoinHistoryType } from "../../../../enums/CoinHistoryType";

const CoinHistoryTabPage: FC = () => {
    const { userLogin } = useQueryUserLogin();
    const { data: coinHistoryData, isLoading: isCoinHistoryLoading } = useQuery({
        queryKey: [REACT_QUERY_KEY.coinhistory, userLogin?.user_token!],
        queryFn: () => apiClient.getUserCoinHistory(userLogin!.user_token!),
    });

    if (isCoinHistoryLoading) {
        return <ListLoadingSkeleton />;
    }

    if (coinHistoryData?.length === 0) {
        return <ListEmptyText />;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                코인 내역
            </Typography>
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <TotalAmountTitleText>
                    현재 보유 코인 : {coinHistoryData![0].amount.toLocaleString()} 코인
                </TotalAmountTitleText>
            </Paper>
            <Paper elevation={3}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>일시</TableCell>
                                <TableCell>구분</TableCell>
                                <TableCell>항목</TableCell>
                                <TableCell align="right">코인</TableCell>
                                <TableCell align="right">보유 코인</TableCell>
                            </TableRow>
                        </TableHead>
                        <CoinHistoryList coinHistoryData={coinHistoryData!} />
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

interface CoinHistoryListProps {
    coinHistoryData: UsersCoinHistoryRes[];
}

const CoinHistoryList: FC<CoinHistoryListProps> = ({ coinHistoryData }) => {
    return (
        <TableBody>
            {coinHistoryData.map((item, index) => (
                <CoinHistoryItem key={index} coinHistoryItem={item} />
            ))}
        </TableBody>
    );
};

interface CoinHistoryItemProps {
    coinHistoryItem: UsersCoinHistoryRes;
}

const CoinHistoryItem: FC<CoinHistoryItemProps> = ({ coinHistoryItem }) => {
    const theme = useTheme();

    return (
        <TableRow>
            <TableCell>{reformatTime(coinHistoryItem.created_at)}</TableCell>
            <TableCell>
                <Typography variant={"body2"} sx={{
                    color: coinHistoryItem.coin_history_type === CoinHistoryType.earn_coin
                        ? theme.palette.success.main
                        : theme.palette.error.main
                }}>
                    {coinHistoryItem.coin_history_type === CoinHistoryType.earn_coin ? "적립" : "사용"}
                </Typography>
            </TableCell>
            <TableCell>
                <Tooltip title={coinHistoryItem.description} arrow>
                    <Typography variant={"body2"} sx={{
                        maxWidth: 200,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                        {coinHistoryItem.description}
                    </Typography>
                </Tooltip>
            </TableCell>
            <TableCell align="right">{coinHistoryItem.coin.toLocaleString()} 코인</TableCell>
            <TableCell align="right">{coinHistoryItem.amount.toLocaleString()} 코인</TableCell>
        </TableRow>
    );
};

export default CoinHistoryTabPage;