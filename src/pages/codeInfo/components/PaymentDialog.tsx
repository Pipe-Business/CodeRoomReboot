import {UserModel} from "../../../data/model/UserModel";
import {CodeModel} from "../../../data/model/CodeModel";
import {useMutateCodePayment} from "../mutate/CodePaymentMutate";
import {useCallback} from "react";

const PaymentDialog = (onCompletePurchase: () => void, userLogin: UserModel, cashData: number, coinData: number, postData: CodeModel) => {
    const {codePaymentMutate} = useMutateCodePayment();
    const onClickConfirm = useCallback(async () => {
        try {
            await codePaymentMutate({onCompletePurchase, userLogin, cashData, coinData, postData});
            // 판매알림

        }catch(e) {
            console.log(e);
        }
    },[userLogin, postData, cashData, coinData, postData]);

    return onClickConfirm;
};
export default PaymentDialog;
