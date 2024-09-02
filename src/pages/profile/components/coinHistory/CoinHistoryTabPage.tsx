import React, {FC} from "react";
import {useQueryUserLogin} from "../../../../hooks/fetcher/UserFetcher";
import {useQuery} from "@tanstack/react-query";
import {REACT_QUERY_KEY} from "../../../../constants/define";
import {apiClient} from "../../../../api/ApiClient";
import {Table, TableContainer} from "@mui/material";
import TableHeader from "../TableHeader";
import CoinHistoryList from "./CoinHistoryList";
import {TotalAmountTitleText} from "../../styles";
import ListLoadingSkeleton from "../ListLoadingSkeleton";
import ListEmptyText from "../ListEmptyText";

const CoinHistoryTabPage: FC = () => {
    const {userLogin} = useQueryUserLogin();
    const {data: coinHistoryData, isLoading: isCoinHistoryLoading, refetch: refetchCoinHistory} = useQuery({
        queryKey: [REACT_QUERY_KEY.coinhistory, userLogin?.user_token!],
        queryFn: () => apiClient.getUserCoinHistory(userLogin!.user_token!),
    });

    if(isCoinHistoryLoading){
        return <ListLoadingSkeleton/>;
    }

    if(coinHistoryData?.length === 0) {
        return <ListEmptyText/>;
    }

    return (
        <TableContainer>
            <TotalAmountTitleText>현재 보유 코인 : {coinHistoryData![0].amount.toLocaleString()} 코인</TotalAmountTitleText>
            <Table>
                <TableHeader headerList={["일시", "구분","항목","코인","보유 코인"]}/>
                <CoinHistoryList coinHistoryData={coinHistoryData!}/>
            </Table>
        </TableContainer>
    );
};

export default CoinHistoryTabPage;