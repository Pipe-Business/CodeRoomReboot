export interface CodeEditRequestEntity {
    post_id: number; // Post 테이블의 Pk 참조키
    title: string; // 제목 
    category: string; //  코드 카테고리 (사용 언어 등)
    cost:number; //가격
    language:string, // 개발 언어
    buyer_guide: string; // 구매자 가이드
	description: string; // 설명
	img_urls?: string[]; // (코드 결과물) 이미지
    created_at?: number;
}