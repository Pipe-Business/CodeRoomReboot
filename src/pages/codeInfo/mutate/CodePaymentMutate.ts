import {useMutation} from "@tanstack/react-query";
import {UserModel} from "../../../data/model/UserModel";
import {CodeModel} from "../../../data/model/CodeModel";
import {toast} from "react-toastify";
import {useRecoilState} from "recoil";
import {paymentDialogState} from "../../payment/atom";
import {useNavigate} from "react-router-dom";
import {CashHistoryRequestEntity} from "../../../data/entity/CashHistoryRequestEntity";
import {apiClient} from "../../../api/ApiClient";
import {PointHistoryRequestEntity} from "../../../data/entity/PointHistoryRequestEntity";
import {PointHistoryType} from "../../../enums/PointHistoryType";
import {PurchaseSaleRequestEntity} from "../../../data/entity/PurchaseSaleRequestEntity";
import {Bootpay} from "@bootpay/client-js";
import {BootPayPaymentEntity} from "../../../data/entity/BootpayPaymentEntity";
import {CashHistoryType} from "../../../enums/CashHistoryType";
import {PayType} from "../../../enums/PayType";

export const useMutateCodePayment = () => {
    const [paymentDialogOpen, setPaymentDialogOpen] = useRecoilState(paymentDialogState);
    const navigate = useNavigate();

    const { mutateAsync } = useMutation({
        mutationFn: async (data: {
            inputCash: number,
            inputCoin: number,
            paymentRequiredAmount: number,
            userLogin: UserModel,
            cashData: number,
            coinData: number,
            postData: CodeModel
        }) => {
            const { inputCash,inputCoin, paymentRequiredAmount, userLogin, cashData, coinData, postData} = data;
            const lstPayType = [];

            // 남은금액 충전
            if(paymentRequiredAmount !== 0){
                await chargePaymentRequired(paymentRequiredAmount, userLogin, cashData, coinData, postData);
            }

            // cash, coin amount 값 set
            const cashAmount = cashData === undefined ? 0 : cashData - inputCash;
            const coinAmount = coinData === undefined ? 0 : coinData - inputCoin;

            // 캐시결제
            if(inputCash !== 0){
                lstPayType.push(PayType.cash);

                // 유저 캐시 차감 -> 캐시 사용기록 insert
                const cashHistory: CashHistoryRequestEntity = {
                    user_token: userLogin!.user_token!,
                    cash: inputCash,
                    amount: cashAmount,
                    description: "코드 구매",
                    cash_history_type: CashHistoryType.use_cash,
                }

                await apiClient.insertUserCashHistory(cashHistory);
            }


            // 코인결제
            if(inputCoin !== 0){
                lstPayType.push(PayType.point);

                // 유저 코인 차감 -> 코인 사용기록 insert
                const pointHistory: PointHistoryRequestEntity = {
                    user_token: userLogin!.user_token!,
                    point: inputCoin,
                    amount: coinAmount,
                    description: "코드 구매",
                    point_history_type: PointHistoryType.use_point,
                }

                await apiClient.insertUserPointHistory(pointHistory);
            }


            // point cash amount update

            await apiClient.updateTotalCash(userLogin!.user_token!,cashAmount);
            await apiClient.updateTotalPoint(userLogin!.user_token!,coinAmount);

            // purchase sale history insert (구매기록)

            const purchaseSaleHistory: PurchaseSaleRequestEntity = {
                post_id: postData!.id,
                sell_price: postData!.price,
                use_cash: inputCash + paymentRequiredAmount,
                use_coin: inputCoin,
                is_confirmed: false,
                purchase_user_token: userLogin!.user_token!,
                sales_user_token: postData!.userToken,
                pay_type: lstPayType
            }
            await apiClient.insertPurchaseSaleHistory(purchaseSaleHistory);

            // todo 구매번호 update
            // user_cash_history에서 구매번호 purchase_sale_hisotry의 id입력

        return postData;
        },
        onSuccess: async (postData: CodeModel) => {
            //console.log("OnSuccess in purchase: "+JSON.stringify(postData));
            // 구매자수 update
            await apiClient.updateBuyerCount(postData.buyerCount + 1, postData.id);
            console.log("**********"+JSON.stringify(navigate));
            navigate(`/code/${postData.id}`);
            //navigate(-1);

            // 구매알림
            toast.success('구매가 완료되었습니다.');

            setPaymentDialogOpen(true); // 구매후기 dialog open
        },
        onError: async (error) => {
            console.log(JSON.stringify(error));
            toast.error('결제실패 - 결제 중단하신게 아니라면 관리자에게 연락바랍니다.');
        }
    });

    const chargePaymentRequired = async (
                                          paymentRequiredAmount: number,
                                          userLogin: UserModel,
                                          cashData: number,
                                          coinData: number,
                                          postData: CodeModel) => {
        const orderName: string = '[CODEROOM] 코드 결제'
        try{
            const response = await Bootpay.requestPayment({
                application_id: '656db24ee57a7e001a59ff03',
                price: paymentRequiredAmount,
                order_name: `${orderName} - ${postData.title}`,
                order_id: `${orderName}`,
                pg: 'kcp',
                tax_free: 0,
                user: {
                    id: userLogin?.user_token!,
                    username: userLogin?.nickname,
                    email: userLogin?.email,
                },
                items: [
                    {
                        id: 'item_id',
                        name: `${orderName}`,
                        qty: 1,
                        price: paymentRequiredAmount,
                    },
                ],
                extra: {
                    open_type: 'iframe',
                    card_quota: '0,2,3',
                    escrow: false,
                },
            });

            if (response.event === 'done') {
                const entity: BootPayPaymentEntity = {
                    user_token: userLogin?.user_token!,
                    cash: paymentRequiredAmount, // 코드룸 캐시
                    price: paymentRequiredAmount, // 원화
                    purchase_at: response.data.purchased_at,
                    order_name: response.data.order_name,
                    method_origin: response.data.method_origin,
                    company_name: response.data.company_name,
                    receipt_id: response.data.receipt_id,
                };

                if (cashData !== undefined && coinData !== undefined) {

                    await apiClient.insertBootpayPayment(entity);

                    // 유저 캐시 증가 -> 캐시 사용기록 insert
                    const cashHistory: CashHistoryRequestEntity = {
                        user_token: userLogin!.user_token!,
                        cash: paymentRequiredAmount,
                        amount: cashData + paymentRequiredAmount,
                        description: '캐시 충전',
                        cash_history_type: 'earn_cash',
                    };

                    await apiClient.insertUserCashHistory(cashHistory);
                    await apiClient.updateTotalCash(userLogin?.user_token!,cashData + paymentRequiredAmount,);

                    Bootpay.destroy();
                }

            }

        }catch (e: any){
            console.log(e);
            toast.error("캐시 충전이 중단되었습니다.");
            throw new Error('캐시 충전 중단');
        }
    }

    return{
        codePaymentMutate: mutateAsync,
    };
};
