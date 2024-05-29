import React, { FC, useCallback } from 'react';
import useDialogState from '../../../hooks/useDialogState.ts';
import { Bootpay } from '@bootpay/client-js';
import dayjs from 'dayjs';
import { DATE_FORMAT } from '../../../utils/DayJsHelper.ts';
import { useQueryUserLogin } from '../../../hooks/fetcher/UserFetcher.ts';
import { useMutateBootPayPaymentRequest } from '../../../hooks/mutate/PaymentMutate.ts';
import { Card, CardActionArea, CardContent } from '@mui/material';
import PointDoneDialog from './dialog/PointDoneDialog.tsx';
import { BootPayPaymentEntity } from '../../../data/entity/BootpayPaymentEntity.ts';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../api/ApiClient.ts';
import { REACT_QUERY_KEY } from '../../../constants/define.ts';
import { PointHistoryRequestEntity } from '../../../data/entity/PointHistoryRequestEntity.ts';
import { PointHistoryType } from '../../../enums/PointHistoryType.tsx';
interface Props {
	children?: React.ReactNode;
	paymentCash: number, // 코드룸 캐시
	paymentPrice: number, // 실제 돈 (원)
	orderName: string,
	bonusPoint?: number,
}

const PointItem: FC<Props> = ({ bonusPoint, orderName, paymentPrice, paymentCash }) => {
	const [isOpenDialog, handleOpenDialog, handleCloseDialog] = useDialogState();
	const { userLogin } = useQueryUserLogin();
	const { isLoading : isCashDataLoading, data: cashData } = useQuery({
		queryKey: [REACT_QUERY_KEY.cash],
		queryFn: () => apiClient.getUserTotalCash(userLogin?.userToken!),
	});
	const { isLoading : isPointDataLoading, data: pointData } = useQuery({
		queryKey: [REACT_QUERY_KEY.point],
		queryFn: () => apiClient.getUserTotalPoint(userLogin?.userToken!),
	});
	const { mutateBootpayRequest } = useMutateBootPayPaymentRequest();

	const payHandler = useCallback(async () => {    //await과 함께 사용하는 함수
		const response = await Bootpay.requestPayment({

			'application_id': '656db24ee57a7e001a59ff03',
			//최초회원가입한 사람 연동키 암호화
			'price': paymentPrice,
			'order_name': orderName,
			'order_id': orderName,
			'pg': 'kcp',
			'tax_free': 0,
			'user': {
				'id': userLogin?.userToken!,
				'username': userLogin?.nickname,
				'email': userLogin?.email,
			},
			'items': [
				{
					'id': 'item_id',
					'name': orderName,
					'qty': 1,
					'price': paymentPrice,
				},
			],
			'extra': {
				'open_type': 'iframe',
				'card_quota': '0,2,3',
				'escrow': false,
			},
		});
		switch (response.event) {
			case 'issued':
				// 가상계좌 입금 완료 처리
				break;
			case 'done':
				// company name : 회사이름
				// price 얼만지
				//purchase_at 결제
				// requested_at 셜제요청
				//ordername 코드룸캐시 초특가 할인
				//method_origin 카카오페이
				// status_locale
				console.log(response);
				// 결제 완료 처리
				break;
			case 'confirm': //payload.extra.separately_confirmed = true; 일 경우 승인 전 해당 이벤트가 호출됨
				console.log(response.receipt_id);
				/**
				 * 1. 클라이언트 승인을 하고자 할때
				 * // validationQuantityFromServer(); //예시) 재고확인과 같은 내부 로직을 처리하기 한다.
				 */
				const confirmedData = await Bootpay.confirm(); //결제를 승인한다
				if (confirmedData.event === 'done') {
					//결제 성공
				}

				/**
				 * 2. 서버 승인을 하고자 할때
				 * // requestServerConfirm(); //예시) 서버 승인을 할 수 있도록  API를 호출한다. 서버에서는 재고확인과 로직 검증 후 서버승인을 요청한다.
				 * Bootpay.destroy(); //결제창을 닫는다.
				 */
				break;
		}
		console.log("responseData : "+JSON.stringify(response.data));
		// company name : 회사이름
		// price 얼만지
		//purchase_at 결제
		// requested_at 셜제요청
		//ordername 코드룸캐시 초특가 할인
		//method_origin 카카오페이
		const date:Date = response.data.purchased_at;
		//todo point 추가 로직 구현
		// if (bonusPoint) {
		// 	resultPoint += bonusPoint;
		// }
		const entity: BootPayPaymentEntity = {
			user_token: userLogin?.userToken!,
			cash: paymentCash, // 코드룸 캐시
			price: paymentPrice, // 원화
			purchase_at: date,
			order_name: response.data.order_name,
			method_origin: response.data.method_origin,
			company_name: response.data.company_name,
			receipt_id: response.data.receipt_id,
		};

		console.log(entity);
		if(cashData && pointData){
			await mutateBootpayRequest(entity);

			// 유저 캐시 증가 -> 캐시 사용기록 insert
			const cashHistory: CashHistoryRequestEntity = {
				user_token: userLogin!.userToken!,
				cash: paymentCash,
				amount: cashData + paymentCash,
				description: "캐시 충전",
				cash_history_type: "earn_cash"
			}
	
			await apiClient.insertUserCashHistory(cashHistory);

			// 포인트 증가
			const pointHistory: PointHistoryRequestEntity = {
				user_token: userLogin!.userToken!,
				point: bonusPoint!,
				amount: pointData + bonusPoint!,
				description: "캐시 충전 보너스 포인트",
				point_history_type: PointHistoryType.earn_point,
			}
	
			await apiClient.insertUserPointHistory(pointHistory);
	
			handleOpenDialog();
		}

	}, []);
	return (
		<>

			<Card
				sx={{
					'&:hover': {
						backgroundColor: '#999',
						'.filter': {
							fill:'#fff',
							color:'#fff !important'
						}
					},
				}}
				style={{ margin: '32px' ,borderRadius:'8px'}} elevation={3}>
				<CardActionArea onClick={payHandler}>
					<CardContent style={{ padding: '32px' }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<div>
								<div>
									<span className={'filter'} style={{
										fontSize: '32px',
										fontWeight: 'bold',
									}}>{paymentCash.toLocaleString()}</span>
									<span className={'filter'} style={{ fontSize: '32px' }}> 캐시</span>
								</div>
								{bonusPoint === undefined ?
									<span className={'filter'} style={{ color: '#999', fontSize: '22px' }}>혜택없음</span> :
									<div>
										<span style={{ color: '#f00', fontSize: '22px' }}>+{bonusPoint}</span>
										<span className={'filter'} style={{ color: '#999', fontSize: '22px' }}> 보너스 포인트</span>
									</div>

								}
							</div>
							<div  style={{
								padding: '16px',
								backgroundColor: '#ddd',
								fontSize: '23px',
								paddingLeft: '16px',
								paddingRight: '16px',
								borderRadius: '8px',
								fontWeight: 'bold',
							}}>
								{paymentPrice}원
							</div>
						</div>
					</CardContent>
				</CardActionArea>
			</Card>
			<PointDoneDialog cash={paymentCash} orderName={orderName}
							 isOpen={isOpenDialog}
							 onClose={handleCloseDialog} />
		</>
	);
};

export default PointItem;