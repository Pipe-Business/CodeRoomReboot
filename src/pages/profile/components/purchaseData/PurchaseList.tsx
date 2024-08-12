import React, { FC } from 'react';
import PurchaseItem from './PurchaseItem';
import { List } from '@mui/material';
import {PurchaseSaleRes} from "../../../../data/entity/PurchaseSaleRes";

interface Props {
    children?: React.ReactNode,
    purchaseData?: PurchaseSaleRes[] | null,
    onWriteReviewClick: (purchaseData: PurchaseSaleRes) => void;
    onReadReviewClick: (purchaseData: PurchaseSaleRes) => void;
}

const PurchaseList: FC<Props> = ({ purchaseData, onWriteReviewClick, onReadReviewClick}) => {
    return (
        <>
            <List>
                {purchaseData && purchaseData.map((v, i) => {
                    return <PurchaseItem key={i} purchaseData={v} onWriteReviewClick={onWriteReviewClick} onReadReviewClick={onReadReviewClick} />;
                })}
            </List>
        </>
    );
};

export default PurchaseList;
