import {PurchaseSaleRes} from "../../../../data/entity/PurchaseSaleRes";
import {FC} from "react";
import {TableBody} from "@mui/material";
import ProfitItem from "./ProfitItem";

interface ProfitListProps {
    purchaseData: PurchaseSaleRes[],
}

const ProfitList: FC<ProfitListProps> = ({purchaseData}) => {
    return (
        <TableBody>
            {purchaseData && purchaseData.map((v, i) => (
               <ProfitItem key={i} purchaseData={v}/>
            ))}
        </TableBody>

    );
}

export default ProfitList;