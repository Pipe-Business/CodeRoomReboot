import {UserModel} from "../../../data/model/UserModel";
import {CodeModel} from "../../../data/model/CodeModel";
import {useMutateCodePayment} from "../mutate/CodePaymentMutate";

const PaymentDialog = (userLogin: UserModel, postData: CodeModel) => {
    const {codePaymentMutate} = useMutateCodePayment();
    const onClickConfirm = async () => {
        try {
            await codePaymentMutate({userLogin, postData});
            // 판매알림

        }catch(e) {
            console.log(e);
        }
    }
    return onClickConfirm;
};
export default PaymentDialog;
