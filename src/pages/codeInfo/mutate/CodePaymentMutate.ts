import {useMutation} from "@tanstack/react-query";
import {UserModel} from "../../../data/model/UserModel";
import {CodeModel} from "../../../data/model/CodeModel";
import {toast} from "react-toastify";

export const useMutateCodePayment = () => {
    const { mutateAsync } = useMutation({
        mutationFn: async(data:{onCompletePurchase: () => void, userLogin: UserModel, cashData: number, coinData: number, postData: CodeModel}) => {
            // 캐시결제
            // 코인결제
            // amount insert
            // 남은금액 결제
            // history insert
            console.log("결제~~~~~~~~~~");

        },
        onSuccess: async () => {
                // 구매자수 update
                // 구매알림
                // onCompletePurchase
        },
        onError: async (error) => {
            console.log(JSON.stringify(error));
            toast.error('결제실패 - 관리자에게 연락바랍니다.');
        }
    });
    return{
        codePaymentMutate: mutateAsync,
    };
};
