import {useMutation} from "@tanstack/react-query";
import {UserModel} from "../../../data/model/UserModel";
import {CodeModel} from "../../../data/model/CodeModel";
import {toast} from "react-toastify";
import {useRecoilState} from "recoil";
import {paymentDialogState} from "../../payment/atom";
import {useNavigate} from "react-router-dom";
import {apiClient} from "../../../api/ApiClient";
import {PurchaseSaleReq} from "../../../data/entity/PurchaseSaleReq";
import {Bootpay} from "@bootpay/client-js";
import {BootPayPaymentModel} from "../../../data/entity/BootPayPaymentModel";
import {PayType} from "../../../enums/PayType";

export const useMutateCodePayment = () => {
    const [paymentDialogOpen, setPaymentDialogOpen] = useRecoilState(paymentDialogState);
    const navigate = useNavigate();

    const { mutateAsync } = useMutation({
        mutationFn: async (data: {
            userLogin: UserModel,
            postData: CodeModel
        }) => {
            const {userLogin, postData} = data;

            // bootpay 결제
            await chargePaymentRequired( userLogin, postData); // 충전

            // TODO 코인 지급
            // const currentCoin = await apiClient.getUserTotalPoint(userLogin!.user_token!);

            // TODO update amount
            //await apiClient.updateTotalPoint(userLogin!.user_token!,coinAmount);
        return postData;
        },
        onSuccess: async (postData: CodeModel) => {
            //console.log("OnSuccess in purchase: "+JSON.stringify(postData));
            // 구매자수 update
            await apiClient.updateBuyerCount(postData.buyerCount + 1, postData.id);
            navigate(0);
            // 구매알림
            toast.success('구매가 완료되었습니다.');

            // TODO 구매자 후기 작성 모달 status를 true로 바꿈
            // setPaymentDialogOpen(true); // 구매후기 dialog open
        },
        onError: async (error) => {
            console.log(JSON.stringify(error));
            toast.error('결제실패 - 결제 중단하신게 아니라면 관리자에게 연락바랍니다.');
        }
    });

    const chargePaymentRequired = async (
                                          userLogin: UserModel,
                                          postData: CodeModel,
                                          ):Promise<void> => {
        const orderName: string = '[CODEROOM] 코드 결제'
        try{
            const response = await Bootpay.requestPayment({
                application_id: '656db24ee57a7e001a59ff03',
                price: postData.price,
                order_name: `${orderName} - ${postData.title}`,
                order_id: `${orderName}`,
                pg: 'kcp',
                tax_free: 0,
                user: {
                    id: userLogin?.user_token!,
                    username: userLogin?.nickname,
                    email: userLogin?.email,
                },
                extra: {
                    open_type: 'iframe',
                    card_quota: '0,2,3',
                    escrow: false,
                },
            });

            if (response.event === 'done') {
                const entity: BootPayPaymentModel = {
                    user_token: userLogin?.user_token!,
                    company_name: response.data.company_name,
                    price: postData.price, // 코드 가격
                    purchased_at: response.data.purchased_at,
                    cancelled_at: response.data.cancelled_at,
                    requested_at: response.data.requested_at,
                    receipt_url: response.data.receipt_url,
                    order_name: response.data.order_name,
                    method_origin: response.data.method_origin,
                    receipt_id: response.data.receipt_id,
                };

                    const bootpayId = await apiClient.insertBootpayPayment(entity);

                const purchaseSaleHistory: PurchaseSaleReq = {
                    post_id: postData!.id,
                    sell_price: postData!.price,
                    is_confirmed: false,
                    purchase_user_token: userLogin!.user_token!,
                    sales_user_token: postData!.userToken,
                    bootpay_payment_id: bootpayId,
                    pay_type: [PayType.coin],
                    use_cash: postData.price,
                }

                // 구매판매기록 insert
                await apiClient.insertPurchaseSaleHistory(purchaseSaleHistory);
                Bootpay.destroy();

            }
        }catch (e: any){
            console.log(e);
            Bootpay.destroy();
            toast.error("캐시 충전이 중단되었습니다.");
            throw new Error('캐시 충전 중단');
        }
    }

    return{
        codePaymentMutate: mutateAsync,
    };
};
