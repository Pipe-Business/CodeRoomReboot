import {FC} from "react";
import {PurchaseSaleRes} from "../../../../data/entity/PurchaseSaleRes";
import {TableCell, TableRow} from "@mui/material";
import {reformatTime} from "../../../../utils/DayJsHelper";
import {useQuery} from "@tanstack/react-query";
import {apiClient} from "../../../../api/ApiClient";
import {useQueryUserLogin} from "../../../../hooks/fetcher/UserFetcher";
import {REACT_QUERY_KEY} from "../../../../constants/define";

interface Props {
    purchaseData: PurchaseSaleRes;
}

const ProfitItem: FC<Props> = ({purchaseData}) => {
    const { data: codeData } = useQuery({ queryKey: ['codeStore', purchaseData.post_id], queryFn: () => apiClient.getTargetCode(purchaseData.post_id) });
    const { data: purchasedUser } = useQuery({
        queryKey: [REACT_QUERY_KEY.user, purchaseData?.sales_user_token, 'nickname'],
        queryFn: () => apiClient.getTargetUser(purchaseData.purchase_user_token),
    });
    return (
        <TableRow>
            <TableCell>{reformatTime(purchaseData.created_at!)}</TableCell>
            <TableCell>{codeData?.title}</TableCell>
            <TableCell>{purchasedUser?.nickname}</TableCell>
            <TableCell>{purchaseData.sell_price}</TableCell>
            {/*<TableCell>{purchaseData.sell_price * 0.8}</TableCell> /!*TODO: 수수료 변경 예정*!/*/}
            <TableCell>{purchaseData.confirmed_time ? "완료" : "대기"}</TableCell>
        </TableRow>
    );
}

export default ProfitItem;