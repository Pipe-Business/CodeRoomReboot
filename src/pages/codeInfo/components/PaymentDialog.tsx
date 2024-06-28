import {UserModel} from "../../../data/model/UserModel";
import {CodeModel} from "../../../data/model/CodeModel";
import {useMutateCodePayment} from "../mutate/CodePaymentMutate";

const PaymentDialog = (inputCash:number, inputCoin:number, paymentRequiredAmount: number, userLogin: UserModel, cashData: number, coinData: number, postData: CodeModel) => {
    const {codePaymentMutate} = useMutateCodePayment();
    const onClickConfirm = async () => {
        try {
            await codePaymentMutate({inputCash, inputCoin, paymentRequiredAmount, userLogin, cashData, coinData, postData});
            // 판매알림

        }catch(e) {
            console.log(e);
        }
    }
    return onClickConfirm;
};
export default PaymentDialog;
