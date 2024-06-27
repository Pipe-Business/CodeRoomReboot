import React, {FC} from "react";
import {ColorButton} from "../styles";
import {useNavigate} from "react-router-dom";
import {CodeModel} from "../../../data/model/CodeModel";
import {useQueryUserLogin} from "../../../hooks/fetcher/UserFetcher";
import {PurchaseSaleResponseEntity} from "../../../data/entity/PurchaseSaleResponseEntity";

interface Props {
    children? : React.ReactNode;
    onPaymentConfirm: () => void;
    onClickLoginRegister: () => void;
    postData: CodeModel;
    purchasedSaleData?: PurchaseSaleResponseEntity | null,
}

const PurchaseButton: FC<Props> = ({onPaymentConfirm,onClickLoginRegister,purchasedSaleData,postData}) => {
    const { userLogin } = useQueryUserLogin();

    const navigate = useNavigate();

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
        <ColorButton sx={{ fontSize: '15', width: '210px' }} onClick={() => navigate('/payment', {state:{postData, onPaymentConfirm}})}  variant='contained'>구매하기</ColorButton>
    );
}
export default PurchaseButton;