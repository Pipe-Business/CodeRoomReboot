import React, { FC } from 'react';
import PurchaseItem from './PurchaseItem';
import {List, TableBody} from '@mui/material';
import {PurchaseSaleRes} from "../../../../data/entity/PurchaseSaleRes";

interface Props {
    purchaseData?: PurchaseSaleRes[] | null,
    //onWriteReviewClick: (purchaseData: PurchaseSaleRes) => void;
    //onReadReviewClick: (purchaseData: PurchaseSaleRes) => void;
}

const PurchaseList: FC<Props> = ({ purchaseData}) => {
    return (
        <TableBody>
                {purchaseData && purchaseData.map((v, i) => {
                    //return <PurchaseItem key={i} purchaseData={v} onWriteReviewClick={onWriteReviewClick} onReadReviewClick={onReadReviewClick} />;
                    return <PurchaseItem key={i} purchaseData={v}/>;
                })}
        </TableBody>
    );
};

export default PurchaseList;
