import React, { FC, useCallback } from 'react';
//import PointDoneDialog from './dialog/PointDoneDialog.tsx';
import useDialogState from '../../../hooks/useDialogState.ts';
import { Bootpay } from '@bootpay/client-js';
import dayjs from 'dayjs';
import { DATE_FORMAT } from '../../../utils/DayJsHelper.ts';
// import { BootPayPaymentEntity } from '../../../data/entity/firebase/realtime/admin/BootpayPaymentEntity.ts';
// import { BootpayPaymentForUser } from '../../../data/entity/firebase/realtime/user/BootpayPaymentForUser.ts';
// import { firebaseSetFetcher } from '../../../utils/QueryFetcher.ts';
//import { useQueryUserLogin } from '../../../hooks/fetcher/UserFetcher.ts';
//import { useMutateBootPayPaymentRequest } from '../../../hooks/mutate/PaymentMutate.ts';
import { Card, CardActionArea, CardContent } from '@mui/material';
import PointDoneDialog from './dialog/PointDoneDialog.tsx';

interface Props {
	children?: React.ReactNode;
	paymentPoint: number,
	paymentPrice: number,
	orderName: string,
	bonusPoint?: number,
}

const PointItem: FC<Props> = ({ bonusPoint, orderName, paymentPrice, paymentPoint }) => {
	const [isOpenDialog, handleOpenDialog, handleCloseDialog] = useDialogState();
	//const { userLogin } = useQueryUserLogin();
	//const { mutateBootpayRequest } = useMutateBootPayPaymentRequest();
	const payHandler = useCallback(async () => {    //await과 함께 사용하는 함수
	}, []);

	// const payHandler = useCallback(async () => {    //await과 함께 사용하는 함수
	// 	const response = await Bootpay.requestPayment({

	// 		'application_id': '656db24ee57a7e001a59ff03',
	// 		//최초회원가입한 사람 연동키 암호화
	// 		'price': paymentPrice,
	// 		'order_name': orderName,
	// 		'order_id': 'TEST_ORDER_ID',
	// 		'pg': 'kcp',       //밑의 그림과 같이 변경해야 함
	// 		'tax_free': 0,
	// 		'user': {
	// 			'id': 'user',
	// 			'username': '승호',
	// 			'phone': '01041115077',
	// 			'email': 'test@test.com',
	// 		},
	// 		'items': [
	// 			{
	// 				'id': 'item_id',
	// 				'name': orderName,
	// 				'qty': 1,
	// 				'price': paymentPrice,
	// 			},
	// 		],
	// 		'extra': {
	// 			'open_type': 'iframe',
	// 			'card_quota': '0,2,3',
	// 			'escrow': false,
	// 		},
	// 	});
	// 	switch (response.event) {
	// 		case 'issued':
	// 			// 가상계좌 입금 완료 처리
	// 			break;
	// 		case 'done':
	// 			// company name : 회사이름
	// 			// price 얼만지
	// 			//purchase_at 결제
	// 			// requested_at 셜제요청
	// 			//ordername 코드룸캐시 초특가 할인
	// 			//method_origin 카카오페이
	// 			// status_locale
	// 			console.log(response);
	// 			handleOpenDialog();
	// 			// 결제 완료 처리
	// 			break;
	// 		case 'confirm': //payload.extra.separately_confirmed = true; 일 경우 승인 전 해당 이벤트가 호출됨
	// 			console.log(response.receipt_id);
	// 			/**
	// 			 * 1. 클라이언트 승인을 하고자 할때
	// 			 * // validationQuantityFromServer(); //예시) 재고확인과 같은 내부 로직을 처리하기 한다.
	// 			 */
	// 			const confirmedData = await Bootpay.confirm(); //결제를 승인한다
	// 			if (confirmedData.event === 'done') {
	// 				//결제 성공
	// 			}

	// 			/**
	// 			 * 2. 서버 승인을 하고자 할때
	// 			 * // requestServerConfirm(); //예시) 서버 승인을 할 수 있도록  API를 호출한다. 서버에서는 재고확인과 로직 검증 후 서버승인을 요청한다.
	// 			 * Bootpay.destroy(); //결제창을 닫는다.
	// 			 */
	// 			break;
	// 	}
	// 	console.log(response.data);
	// 	// company name : 회사이름
	// 	// price 얼만지
	// 	//purchase_at 결제
	// 	// requested_at 셜제요청
	// 	//ordername 코드룸캐시 초특가 할인
	// 	//method_origin 카카오페이
	// 	const date = dayjs(response.data.purchased_at).format(DATE_FORMAT);
	// 	let resultPoint = paymentPoint;
	// 	if (bonusPoint) {
	// 		resultPoint += bonusPoint;
	// 	}
	// 	const entity: BootPayPaymentEntity = {
	// 		userId: userLogin?.id!,
	// 		point: resultPoint,
	// 		price: paymentPrice,
	// 		purchaseAt: date,
	// 		orderName: response.data.order_name,
	// 		methodOrigin: response.data.method_origin,
	// 		companyName: response.data.company_name,
	// 		receiptId: response.data.receipt_id,
	// 		type: 'payment',
	// 	};

	// 	console.log(entity);
	// 	const pushKey = await mutateBootpayRequest(entity);
	// 	const userBootPayEntity: BootpayPaymentForUser = {
	// 		id: pushKey,
	// 		userId: userLogin?.id!,
	// 		createdAt: date,
	// 	};
	// 	await firebaseSetFetcher(['bootpayPaymentForUser', userLogin?.id, pushKey], userBootPayEntity);
	// }, []);
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
									}}>{paymentPoint.toLocaleString()}</span>
									<span className={'filter'} style={{ fontSize: '32px' }}>p</span>
								</div>
								{bonusPoint === undefined ?
									<span className={'filter'} style={{ color: '#999', fontSize: '22px' }}>혜택없음</span> :
									<div>
										<span style={{ color: '#f00', fontSize: '22px' }}>+{bonusPoint}</span>
										<span className={'filter'} style={{ color: '#999', fontSize: '22px' }}> 보너스캐시</span>
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
			<PointDoneDialog point={paymentPoint + (bonusPoint ? bonusPoint : 0)} orderName={orderName}
							 isOpen={isOpenDialog}
							 onClose={handleCloseDialog} />
		</>
	);
};

export default PointItem;