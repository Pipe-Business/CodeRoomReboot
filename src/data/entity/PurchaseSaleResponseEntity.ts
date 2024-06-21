export interface PurchaseSaleResponseEntity {
	id?: number;
	post_id: number; // 게시글 idPurchaseSaleResponseEntity
	price?: number; // 가격
	is_confirmed: boolean; //  정산여부
	purchase_user_token: string; // 구매자 유저 토큰
	sales_user_token: string; // 판매자 유저 토큰
    pay_type: string[]; // 구매방식 (캐시,코인)
	created_at?: string; //코드 생성일
}
