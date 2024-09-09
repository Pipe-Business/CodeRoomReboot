import React, { FC } from "react";
import { useQueryUserLogin } from "../../../../hooks/fetcher/UserFetcher";
import { useQuery } from "@tanstack/react-query";
import { REACT_QUERY_KEY } from "../../../../constants/define";
import { apiClient } from "../../../../api/ApiClient";
import { Box, Paper, Table, TableContainer, Typography } from "@mui/material";
import TableHeader from "../TableHeader";
import CoinHistoryList from "./CoinHistoryList";
import { TotalAmountTitleText } from "../../styles";
import ListLoadingSkeleton from "../ListLoadingSkeleton";
import ListEmptyText from "../ListEmptyText";

const CoinHistoryTabPage: FC = () => {
    const { userLogin } = useQueryUserLogin();
    const { data: coinHistoryData, isLoading: isCoinHistoryLoading, refetch: refetchCoinHistory } = useQuery({
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
                        <TableHeader headerList={["일시", "구분", "항목", "코인", "보유 코인"]} />
                        <CoinHistoryList coinHistoryData={coinHistoryData!} />
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default CoinHistoryTabPage;