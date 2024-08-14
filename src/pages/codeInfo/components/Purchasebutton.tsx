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
    // 로그인 안한 유저의 경우
    if (!userLogin) {
        alert("로그인이 필요한 서비스입니다.")
        return null;
    }
    // 게사자일경우
    if (userLogin?.user_token === postData.userToken) {
        return null;
    }

    // 구매한 내역이 있으면
    if (purchasedSaleData != null) {
        return null;
    }

    return (
        <ColorButton sx={{ fontSize: '20px', width: '100%', height:'60px', fontWeight: 'bold' }} onClick={handlePurchase}  variant='contained'> 코드 템플릿 구매 </ColorButton>
    );
}
export default PurchaseButton;