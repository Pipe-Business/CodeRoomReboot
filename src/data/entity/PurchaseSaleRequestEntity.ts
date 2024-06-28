export interface PurchaseSaleRequestEntity {
	post_id: number; // 게시글 id
	sell_price?: number; // 가격
	use_cash: number;
	use_coin: number;
	is_confirmed: boolean; //  정산여부
	purchase_user_token: string; // 구매자 유저 토큰
	sales_user_token: string; // 판매자 유저 토큰
    pay_type: string[]; // 구매방식 (캐시,코인)
}
