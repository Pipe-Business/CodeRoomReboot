import { useMutation } from '@tanstack/react-query';
import {UsersCoinHistoryReq} from "../../data/entity/UsersCoinHistoryReq";
import {CoinHistoryType} from "../../enums/CoinHistoryType";
import {apiClient} from "../../api/ApiClient";

export const useMutateSendPoint = () => {
    // 관리자 코인 지급

	const { mutateAsync } = useMutation({
		mutationFn: async (data: { userToken: string, point: number ,prevPoint: number, description:string}) => {


            const coinAmount = data.point + data.prevPoint!;
				// 코인 증가
                const coinHistory: UsersCoinHistoryReq = {
                    user_token: data.userToken!,
                    coin: data.point!,
                    amount: coinAmount,
                    description: data.description,
                    coin_history_type: CoinHistoryType.earn_coin,
                }
        
                await apiClient.insertUserCoinHistory(coinHistory);
                await apiClient.updateTotalPoint(data.userToken,coinAmount);

        },
		onSuccess: () => {

		},
	});
	return { adminSendToPointForUser: mutateAsync };
};