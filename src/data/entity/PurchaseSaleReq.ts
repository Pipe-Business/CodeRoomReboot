/**
 *  거래 내역 요청 interface
 */

export interface PurchaseSaleReq {
	post_id: number; // 게시글 id
	purchase_user_token: string; // 구매자 유저 토큰
	sales_user_token: string; // 판매한 유저의 ID
	bootpay_payment_id: number; // bootpay pay 결제 이력 시퀀스 id
	is_confirmed: boolean; //  정산여부
	pay_type: string[]; // 구매방식 (결제 수단)
	sell_price: number; // 판매가
	use_cash: number; // 지불한 금액
	confirmed_time?: string; // 정산시각
}
