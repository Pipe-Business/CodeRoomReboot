export interface PurchaseSaleResponseEntity {
	id?: number;
	post_id: number; // 게시글 idPurchaseSaleResponseEntity
	sell_price: number; // 판매가
	use_cash?: number; // 캐시 사용량
	use_coin?: number; // 코인 사용량
	is_confirmed: boolean; //  정산여부
	purchase_user_token: string; // 구매자 유저 토큰
	sales_user_token: string; // 판매자 유저 토큰
	confirmed_time?: string; // 정산시각
    pay_type: string[]; // 구매방식 (캐시,코인)
	created_at?: string; //구매시각
}
