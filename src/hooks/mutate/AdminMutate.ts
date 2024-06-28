import { useMutation } from '@tanstack/react-query';
import {PointHistoryRequestEntity} from "../../data/entity/PointHistoryRequestEntity";
import {PointHistoryType} from "../../enums/PointHistoryType";
import {apiClient} from "../../api/ApiClient";

export const useMutateSendPoint = () => {
    // 관리자 코인 지급

	const { mutateAsync } = useMutation({
		mutationFn: async (data: { userToken: string, point: number ,prevPoint: number, description:string}) => {


            const coinAmount = data.point + data.prevPoint!;
				// 코인 증가
                const pointHistory: PointHistoryRequestEntity = {
                    user_token: data.userToken!,
                    point: data.point!,
                    amount: coinAmount,
                    description: data.description,
                    point_history_type: PointHistoryType.earn_point,
                }
        
                await apiClient.insertUserPointHistory(pointHistory);
                await apiClient.updateTotalPoint(data.userToken,coinAmount);

        },
		onSuccess: () => {

		},
	});
	return { adminSendToPointForUser: mutateAsync };
};