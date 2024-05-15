interface PurchaseSaleEntity {
	id: number;
	postId: number; // 게시글 id
	price?: number; // 가격
	isConfirmed: boolean; //  정산여부
	purchaseUserToken: string; // 구매자 유저 토큰
	salesUserToken: string; // 판매자 유저 토큰
    payType: string; // 구매방식 (포인트, 토큰)
	createdAt: number; //코드 생성일
}
