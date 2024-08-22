import {UsersCoinHistoryRes} from "../../../../data/entity/UsersCoinHistoryRes";
import React, {FC} from "react";
import {TableBody} from "@mui/material";
import CoinHistoryItem from "./CoinHistoryItem";

interface Props {
    coinHistoryData: UsersCoinHistoryRes[],
}

const CoinHistoryList: FC<Props> = ({coinHistoryData}) => {
    return (
        <TableBody>
            {coinHistoryData && coinHistoryData.map((v, i) => {
                return <CoinHistoryItem key={i} coinHistoryItem={v}/>;
            })}
        </TableBody>
    );
}

export default CoinHistoryList;