
export interface PurchaseReviewEntity {
    id?: number;
	post_id: number; // 리뷰 남긴 게시글 id
	review_title: string; // 리뷰 제목
	review_content: string; // 리뷰 내용
	rating: number; // 평점 (소수점)
	reviewer_user_token: string; // 리뷰 작성자 유저토큰
	created_at?: Date; // 생성일
}