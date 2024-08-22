import {UsersCoinHistoryRes} from "../../../../data/entity/UsersCoinHistoryRes";
import React, {FC} from "react";
import {TableCell, TableRow} from '@mui/material';
import {reformatTime} from "../../../../utils/DayJsHelper";
import {CoinHistoryType} from "../../../../enums/CoinHistoryType";

interface Props {
    coinHistoryItem: UsersCoinHistoryRes;
}

const CoinHistoryItem: FC<Props> = ({coinHistoryItem}) => {

    return (
      <TableRow>
          <TableCell>{reformatTime(coinHistoryItem.created_at)}</TableCell>
          <TableCell>{coinHistoryItem.coin_history_type === CoinHistoryType.earn_coin ? "적립" : "사용"}</TableCell>
          <TableCell>{coinHistoryItem.description}</TableCell>
          <TableCell>{coinHistoryItem.coin}</TableCell>
          <TableCell>{coinHistoryItem.amount}</TableCell>

      </TableRow>
    );
}

export default CoinHistoryItem;