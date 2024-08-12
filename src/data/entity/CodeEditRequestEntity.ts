export interface CodeEditRequestEntity {
    post_id: number; // Post 테이블의 Pk 참조키
    title: string; // 제목 
    category: string; //  코드 카테고리 (사용 언어 등)
    price:number; //가격
    language:string, // 개발 언어
    ai_summary?: string; // ai가 요약하는 코드 핵심요약
	description?: string; // 설명
	img_urls?: string[]; // (코드 결과물) 이미지
    created_at?: number;
}