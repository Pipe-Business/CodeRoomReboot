/**
 * 부트페이 결제 결과 Model type
 */
export interface BootPayPaymentModel {
	id?: string, // ai id
	user_token: string, // userToken
	company_name: string, // 결제 회사 이름 (파이프 빌더)
	price: number, // 지불한 금액
	purchased_at: Date, // 결제된 시각
	cancelled_at: Date, // 결제 취소된 시각
	requested_at: Date, // 결제 요청된 시각
	receipt_url: String, // 영수증 url
	order_name: string, // 결제한 상품의 이름
	method_origin: string, // 결제수단 ex) 토스,카카오페이,카드 등
	receipt_id?: string // 영수증 번호
	created_at?:  Date, // db 생성일
}