import {useMutation} from "@tanstack/react-query";
import {UserModel} from "../../../data/model/UserModel";
import {CodeModel} from "../../../data/model/CodeModel";
import {toast} from "react-toastify";
import {useRecoilState} from "recoil";
import {paymentDialogState} from "../../payment/atom";
import {useNavigate} from "react-router-dom";
import {CashHistoryRequestEntity} from "../../../data/entity/CashHistoryRequestEntity";
import {apiClient} from "../../../api/ApiClient";

export const useMutateCodePayment = () => {
    const [paymentDialogOpen, setPaymentDialogOpen] = useRecoilState(paymentDialogState);
    const navigate = useNavigate(); //변수 할당시켜서 사용
    const { mutateAsync } = useMutation({
        mutationFn: async(data:{userLogin: UserModel, cashData: number, coinData: number, postData: CodeModel}) => {
            const { userLogin, cashData, coinData, postData} = data;

            // 캐시결제
            // 유저 캐시 차감 -> 캐시 사용기록 insert
            const cashHistory: CashHistoryRequestEntity = {
                user_token: userLogin!.user_token!,
                cash: postData?.price!,
                amount: cashData == undefined ? 0 : cashData - postData?.price!,
                description: "코드 구매",
                cash_history_type: "use_cash"
            }

            await apiClient.insertUserCashHistory(cashHistory);

            // 코인결제

            // amount insert
            // 남은금액 결제
            // history insert
            console.log("결제~~~~~~~~~~");

        },
        onSuccess: async () => {
                // 구매자수 update
                // 구매알림

            setPaymentDialogOpen(true); // 구매후기 dialog open
            navigate(-1);
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
