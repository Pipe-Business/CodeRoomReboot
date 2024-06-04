import React, { FC } from 'react';
import PurchaseItem from './PurchaseItem.tsx';
import { List } from '@mui/material';

interface Props {
    children?: React.ReactNode,
    purchaseData?: PurchaseSaleResponseEntity[] | null,
    onWriteReviewClick: (purchaseData: PurchaseSaleResponseEntity) => void;    
}

const PurchaseList: FC<Props> = ({ purchaseData, onWriteReviewClick }) => {
    return (
        <>
            <List>
                {purchaseData && purchaseData.map((v, i) => {
                    return <PurchaseItem key={i} purchaseData={v} onWriteReviewClick={onWriteReviewClick} />;
                })}
            </List>
        </>
    );
};

export default PurchaseList;
