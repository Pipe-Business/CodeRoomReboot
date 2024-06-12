import React, { FC } from 'react';
import PurchaseItem from './PurchaseItem';
import { List } from '@mui/material';
import {PurchaseSaleResponseEntity} from "../../../../data/entity/PurchaseSaleResponseEntity";

interface Props {
    children?: React.ReactNode,
    purchaseData?: PurchaseSaleResponseEntity[] | null,
    onWriteReviewClick: (purchaseData: PurchaseSaleResponseEntity) => void;
    onReadReviewClick: (purchaseData: PurchaseSaleResponseEntity) => void;
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
