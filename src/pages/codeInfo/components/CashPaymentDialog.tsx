import {useCallback} from 'react';
import {useMutation} from '@tanstack/react-query';
import {apiClient} from '../../../api/ApiClient';
import {toast} from 'react-toastify';
import {PurchaseSaleRequestEntity} from '../../../data/entity/PurchaseSaleRequestEntity';
import {NotificationType} from '../../../enums/NotificationType';
import {NotificationEntity} from '../../../data/entity/NotificationEntity';
import {CashHistoryRequestEntity} from "../../../data/entity/CashHistoryRequestEntity";
import {UserModel} from "../../../data/model/UserModel";
import {CodeModel} from "../../../data/model/CodeModel";

const CashPaymentDialog = (onConfirm: () => void, userLogin: UserModel, cashData: number, postData: CodeModel) => {
    const {mutate} = useMutation({
        mutationFn: async () => {

            // 유저 캐시 차감 -> 캐시 사용기록 insert
            const cashHistory: CashHistoryRequestEntity = {
                user_token: userLogin!.user_token!,
                cash: postData?.price!,
                amount: cashData == undefined ? 0 : cashData - postData?.price!,
                description: "코드 구매",
                cash_history_type: "use_cash"
            }

            await apiClient.insertUserCashHistory(cashHistory);
            await apiClient.updateTotalCash( userLogin.user_token!,cashData == undefined ? 0 : cashData - postData?.price!);

            // purchase sale history insert(코드 거래내역 insert) 로직
            if (postData) {
                const purchaseSaleHistory: PurchaseSaleRequestEntity = {
                    post_id: postData!.id,
                    price: postData!.price,
                    is_confirmed: false,
                    purchase_user_token: userLogin!.user_token!,
                    sales_user_token: postData!.userToken,
                    pay_type: "cash"
                }

                await apiClient.insertPurchaseSaleHistory(purchaseSaleHistory);
            }

        },
        onSuccess: async () => {
            if (postData) {
                // 구매자수 update
                console.log("구매자수 update")
                await apiClient.updateBuyerCount(postData.buyerCount + 1, postData.id);
            }

            toast.success('구매가 완료되었습니다.');
            if (onConfirm) {
                onConfirm();
            }

        },
    });

    const onClickConfirm = useCallback(async () => {
        try {
            if (postData && userLogin?.user_token) {
                mutate();
                //  판매자에게 판매알림
                const notificationEntity: NotificationEntity = {
                    title: '코드 판매 알림',
                    content: `'${postData?.title}' 게시글이 판매 되었습니다`,
                    from_user_token: 'admin',
                    to_user_token: postData?.userToken!,
                    notification_type: NotificationType.sale,
                }

                await apiClient.insertNotification(notificationEntity);
            }
        } catch (e) {
            console.log(e);
        }
    }, [userLogin, postData]);

    return [onClickConfirm];
};

export default CashPaymentDialog;
