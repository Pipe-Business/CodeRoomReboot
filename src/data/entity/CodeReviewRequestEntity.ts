export interface CodeReviewRequestEntity {
	id?: number;
	title: string; // 코드리뷰 신청 제목 
	content: string; // 코드리뷰 신청 내용
	to_user_token?: string; // 신청 대상 uid
	from_user_token: string; // 신청자 uid		
	request_date: Date; // 코드리뷰 가능일
	created_at?: Date; // 생성일	
}
