/**
 *  코드 거래 내역  Model interface
 */
// TODO : 안쓸 경우 제거

export interface PurchaseSaleModel {
	id: number;
	post_id: number; // 거래된 게시글의 id
	purchaseUserToken: string; // 구매자 유저 토큰
	salesUserToken: string; // 판매한 유저의 ID
	bootpayPaymentId?: number; // bootpay pay 결제 이력 시퀀스 id
	isConfirmed: boolean; //  정산여부
	payType: string[]; // 구매방식 (결제 수단)
	sellPrice: number; // 판매가
	useCash?: number; // 지불한 금액
	confirmedTime?: string; // 정산시각
	createdAt?: string; //구매시각
}
