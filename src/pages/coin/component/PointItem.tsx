import React, { FC, useCallback } from 'react';
import { Card, CardActionArea, CardContent, Typography, Box } from '@mui/material';
import useDialogState from '../../../hooks/UseDialogState';
import { Bootpay } from '@bootpay/client-js';
import { useQueryUserLogin } from '../../../hooks/fetcher/UserFetcher';
import { useMutateBootPayPaymentRequest } from '../../../hooks/mutate/PaymentMutate';
import PointDoneDialog from './dialog/PointDoneDialog';
import { BootPayPaymentEntity } from '../../../data/entity/BootpayPaymentEntity';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../api/ApiClient';
import { REACT_QUERY_KEY } from '../../../constants/define';
import { PointHistoryRequestEntity } from '../../../data/entity/PointHistoryRequestEntity';
import { PointHistoryType } from '../../../enums/PointHistoryType';
import { NotificationEntity } from '../../../data/entity/NotificationEntity';
import { NotificationType } from '../../../enums/NotificationType';
import {CashHistoryRequestEntity} from "../../../data/entity/CashHistoryRequestEntity";

interface Props {
  children?: React.ReactNode;
  paymentCash: number; // 코드룸 캐시
  paymentPrice: number; // 실제 돈 (원)
  orderName: string;
  bonusPoint?: number;
}

const PointItem: FC<Props> = ({ bonusPoint, orderName, paymentPrice, paymentCash }) => {
  const [isOpenDialog, handleOpenDialog, handleCloseDialog] = useDialogState();
  const { userLogin } = useQueryUserLogin();
  const { data: cashData, refetch:refetchCash } = useQuery({
    queryKey: [REACT_QUERY_KEY.cash],
    queryFn: () => apiClient.getUserTotalCash(userLogin?.user_token!),
  });
  const { data: pointData, refetch:refetchPoint } = useQuery({
    queryKey: [REACT_QUERY_KEY.point],
    queryFn: () => apiClient.getUserTotalPoint(userLogin?.user_token!),
  });
  const { mutateBootpayRequest } = useMutateBootPayPaymentRequest();

  const payHandler = useCallback(async () => {
    const response = await Bootpay.requestPayment({
      application_id: '656db24ee57a7e001a59ff03',
      price: paymentPrice,
      order_name: orderName,
      order_id: orderName,
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
          name: orderName,
          qty: 1,
          price: paymentPrice,
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
        cash: paymentCash, // 코드룸 캐시
        price: paymentPrice, // 원화
        purchase_at: response.data.purchased_at,
        order_name: response.data.order_name,
        method_origin: response.data.method_origin,
        company_name: response.data.company_name,
        receipt_id: response.data.receipt_id,
      };

      if (cashData !== undefined && pointData !== undefined) {

        await mutateBootpayRequest(entity);

        // 유저 캐시 증가 -> 캐시 사용기록 insert
        const cashHistory: CashHistoryRequestEntity = {
          user_token: userLogin!.user_token!,
          cash: paymentCash,
          //amount: cashData + paymentCash, //todo 제거 필요
          description: '캐시 충전',
          cash_history_type: 'earn_cash',
        };

        await apiClient.insertUserCashHistory(cashHistory);
        await apiClient.updateTotalCash(userLogin?.user_token!,cashData + paymentCash,);

        // 포인트 증가
        const pointHistory: PointHistoryRequestEntity = {
          user_token: userLogin!.user_token!,
          point: bonusPoint!,
          //amount: pointData + bonusPoint!,
          description: '캐시 충전 보너스 포인트',
          point_history_type: PointHistoryType.earn_point,
        };

        await apiClient.insertUserPointHistory(pointHistory);
        await apiClient.updateTotalPoint(userLogin?.user_token!,pointData + bonusPoint!);

        // 포인트 지급 알림
        const notificationEntity: NotificationEntity = {
          title: '포인트 지급 알림',
          content: '캐시 충전 보너스 포인트가 지급되었습니다.',
          from_user_token: 'admin',
          to_user_token: userLogin!.user_token!,
          notification_type: NotificationType.get_point,
        };
        await apiClient.insertNotification(notificationEntity);

        await refetchCash();
        await refetchPoint();

        handleOpenDialog();
      }
    }
  }, [paymentCash, paymentPrice, orderName, userLogin, bonusPoint, cashData, pointData, mutateBootpayRequest]);

  return (
    <>
      <Card
        sx={{
          margin: '16px auto', // 상하좌우 중앙 정렬 및 간격
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          maxWidth: '800px', // 최대 너비 설정
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            transform: 'translateY(-2px)',
          },
          transition: 'box-shadow 0.3s, transform 0.3s',
        }}
      >
        <CardActionArea onClick={payHandler} sx={{ padding: 2 }}>
          <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" component="div" fontWeight="bold" sx={{ fontSize: '24px' }}>
                {paymentCash.toLocaleString()} 캐시
              </Typography>
              {bonusPoint !== undefined ? (
                <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                  <span style={{ color: '#f00', fontSize: '16px', fontWeight: 'bold' }}>+{bonusPoint}</span> 보너스 포인트
                </Typography>
              ) : (
                <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                  혜택 없음
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                padding: '8px 16px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              <Typography variant="body1" component="div">
                {paymentPrice.toLocaleString()} 원
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
      <PointDoneDialog
        cash={cashData!} // 이전 캐시 + 현재 구매한 캐시
        nowPurchaseCash={paymentCash} // 현재 구매한 캐시
        orderName={orderName}
        isOpen={isOpenDialog}
        onClose={handleCloseDialog}
      />
    </>
  );
};

export default PointItem;
