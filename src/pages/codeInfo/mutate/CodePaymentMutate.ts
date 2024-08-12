import {useMutation} from "@tanstack/react-query";
import {UserModel} from "../../../data/model/UserModel";
import {CodeModel} from "../../../data/model/CodeModel";
import {toast} from "react-toastify";
import {useRecoilState} from "recoil";
import {paymentDialogState} from "../../payment/atom";
import {useNavigate} from "react-router-dom";
import {apiClient} from "../../../api/ApiClient";
import {PurchaseSaleRequestEntity} from "../../../data/entity/PurchaseSaleRequestEntity";
import {Bootpay} from "@bootpay/client-js";
import {BootPayPaymentModel} from "../../../data/entity/BootPayPaymentModel";
import {CashHistoryType} from "../../../enums/CashHistoryType";
import {PayType} from "../../../enums/PayType";
// TODO : 캐시 결제 사라짐 -> 결제 로직 변경 필요
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

            if( inputCash !== 0 || paymentRequiredAmount !== 0 ) {
                lstPayType.push(PayType.cash);
            }
            // if( inputCoin !== 0 ) {
            //     lstPayType.push(PayType.point);
            // }


            // purchase sale history insert (구매기록)

            const purchaseSaleHistory: PurchaseSaleRequestEntity = {
                post_id: postData!.id,
                sell_price: postData!.price,
                use_cash: inputCash + paymentRequiredAmount,
                //use_coin: inputCoin,
                is_confirmed: false,
                purchase_user_token: userLogin!.user_token!,
                sales_user_token: postData!.userToken,
                pay_type: lstPayType
            }

            let purchaseSaleHistoryId:number;

            // 충전 필요금액 처리
            if(paymentRequiredAmount !== 0){
                purchaseSaleHistoryId = await chargePaymentRequired(paymentRequiredAmount, userLogin, cashData, coinData, postData, purchaseSaleHistory); // 충전
                const currentCash= await apiClient.getUserTotalCash(userLogin!.user_token!);

                // // 유저 캐시 차감 -> 캐시 사용기록 insert
                // const cashHistory: CashHistoryRequestEntity = {
                //     user_token: userLogin!.user_token!,
                //     cash: paymentRequiredAmount,
                //     amount: currentCash - paymentRequiredAmount,
                //     description: "코드 구매",
                //     cash_history_type: CashHistoryType.use_cash,
                //     purchase_id: purchaseSaleHistoryId,
                // }
                //
                // await apiClient.insertUserCashHistory(cashHistory);
                await apiClient.updateTotalCash(userLogin?.user_token!,currentCash - paymentRequiredAmount);
            }else{

                purchaseSaleHistoryId = await apiClient.insertPurchaseSaleHistory(purchaseSaleHistory);

            }

            const currentCash= await apiClient.getUserTotalCash(userLogin!.user_token!);
            const currentCoin = await apiClient.getUserTotalPoint(userLogin!.user_token!);

            // cash, coin amount 값 set
            const cashAmount = currentCash - inputCash;
            //const coinAmount = currentCoin - inputCoin;


            // 캐시결제
            if(inputCash !== 0){

                // 유저 캐시 차감 -> 캐시 사용기록 insert
                // const cashHistory: CashHistoryRequestEntity = {
                //     user_token: userLogin!.user_token!,
                //     cash: inputCash,
                //     amount: cashAmount,
                //     description: "코드 구매",
                //     cash_history_type: CashHistoryType.use_cash,
                //     purchase_id: purchaseSaleHistoryId,
                // }
                //
                // await apiClient.insertUserCashHistory(cashHistory);
            }


            // // 코인결제
            // if(inputCoin !== 0){
            //
            //     // 유저 코인 차감 -> 코인 사용기록 insert
            //     const pointHistory: PointHistoryRequestEntity = {
            //         user_token: userLogin!.user_token!,
            //         point: inputCoin,
            //         amount: coinAmount,
            //         description: "코드 구매",
            //         point_history_type: PointHistoryType.use_point,
            //         purchase_id: purchaseSaleHistoryId,
            //     }
            //
            //     await apiClient.insertUserPointHistory(pointHistory);
            // }


            // point cash amount update

            await apiClient.updateTotalCash(userLogin!.user_token!,cashAmount);
            //await apiClient.updateTotalPoint(userLogin!.user_token!,coinAmount);


        return postData;
        },
        onSuccess: async (postData: CodeModel) => {
            //console.log("OnSuccess in purchase: "+JSON.stringify(postData));
            // 구매자수 update
            await apiClient.updateBuyerCount(postData.buyerCount + 1, postData.id);
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
                                          postData: CodeModel,
                                          purchaseSaleHistory: PurchaseSaleRequestEntity):Promise<number> => {
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
                const entity: BootPayPaymentModel = {
                    user_token: userLogin?.user_token!,
                    company_name: response.data.company_name,
                    price: paymentRequiredAmount, // 코드 가격
                    purchased_at: response.data.purchased_at,
                    cancelled_at: response.data.cancelled_at,
                    requested_at: response.data.requested_at,
                    receipt_url: response.data.receipt_url,
                    order_name: response.data.order_name,
                    method_origin: response.data.method_origin,
                    receipt_id: response.data.receipt_id,
                };

                if (cashData !== undefined && coinData !== undefined) {

                    await apiClient.insertBootpayPayment(entity);

                    // 유저 캐시 증가 -> 캐시 사용기록 insert
                    // const cashHistory: CashHistoryRequestEntity = {
                    //     user_token: userLogin!.user_token!,
                    //     cash: paymentRequiredAmount,
                    //     amount: cashData + paymentRequiredAmount,
                    //     description: '캐시 충전',
                    //     cash_history_type: 'earn_cash',
                    // };
                    //
                    // await apiClient.insertUserCashHistory(cashHistory);
                    await apiClient.updateTotalCash(userLogin?.user_token!,cashData + paymentRequiredAmount,);

                    Bootpay.destroy();
                }
            }
            return await apiClient.insertPurchaseSaleHistory(purchaseSaleHistory);

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
