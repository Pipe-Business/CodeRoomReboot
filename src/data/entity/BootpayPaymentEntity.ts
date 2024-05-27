/**
 * @param {string} [id] - 결제 결과의 고유 식별자
 * @param {string} user_token - 사용자 userToken
 * @param {string} company_name - 결제를 진행한 회사 param이름
 * @param {number} price - 결제한 금액param
 * @param {string} purchase_at - 결제가 이루어진 시간param
 * @param {string} order_name - 구매한 상품의 이름param
 * @param {string} method_origin - 사용된 결제 수단 param(예: 토스, 카카오페이, 카드 등)
 * @param {string} receipt_id - 결제 영수증 번호param
 */

/**
 * 부트페이 결제 결과 Entity
 */
export type BootPayPaymentEntity = {
	id?: string, // ai id
	user_token: string, // userToken
	company_name: string, // 결제 회사 이름 (파이프 빌더)
	price: number, // 지불한 금액 
	cash:number // 결제한 캐시
	purchase_at: Date, // 결제된 시각
	order_name: string, // 결제한 상품의 이름
	method_origin: string, // 결제수단 ex) 토스,카카오페이,카드 등
	receipt_id?: string // 영수증 번호
}