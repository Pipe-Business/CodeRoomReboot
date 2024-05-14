interface PostModel {
	id?: number;
	title: string; // 제목 
	description: string; // 설명
	img_urls?: string[]; // (코드 결과물) 이미지
	user_token: string; //  사용자의 UserEntity id
	category: string; //  코드 카테고리 (사용 언어 등)
	state: 'pending' | 'reject' | 'approve'; // 코드의 현재 상태: 'pending'(대기), 'reject'(거절), 'approve(승인)' 중 하나
	created_at?: number; //코드 생성일
	post_type:'article'|'code' // 폼의 유형 article 게시글, code 코드
	hash_tag : string[] // 해시태그
}