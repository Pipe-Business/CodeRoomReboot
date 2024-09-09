import React, {FC, useState} from "react";
import {ColorButton} from "../styles";
import {useNavigate} from "react-router-dom";
import {CodeModel} from "../../../data/model/CodeModel";
import {useQueryUserLogin} from "../../../hooks/fetcher/UserFetcher";
import {PurchaseSaleRes} from "../../../data/entity/PurchaseSaleRes";

interface Props {
    children? : React.ReactNode;
    postData: CodeModel;
    purchasedSaleData?: PurchaseSaleRes | null,
    handlePurchase: () => void,
}

const PurchaseButton: FC<Props> = ({purchasedSaleData,postData, handlePurchase}) => {
    const { userLogin } = useQueryUserLogin();

    // 게사자일경우
    if (userLogin?.user_token === postData.userToken) {
        return null;
    }

    // 구매한 내역이 있으면
    if (purchasedSaleData != null) {
        return null;
    }

    return (
        <ColorButton sx={{ fontSize: '20px', width: '50%', height:'60px', fontWeight: 'bold' }} onClick={handlePurchase} variant='contained'>코드 구매</ColorButton>
    );
}
export default PurchaseButton;