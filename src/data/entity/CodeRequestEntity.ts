export interface CodeRequestEntity {
    id?: string; // ai id
    post_id: number; // Post 테이블의 Pk 참조키
    created_at?: number;
    github_repo_url:string; // 깃허브 URL
    cost:number; //가격
    language:string, // 개발 언어
    github_download_url?: string; // 깃허브 다운로드 url
    seller_github_name: string; // 판매자의 GitHub 사용자명
	admin_git_repo_url?: string; // 관리자의 포크한 깃헙 URL
	fork_url?: string; // 포크된 깃헙 URL
    popularity: number; // 코드평점
    ai_summary?: string; // ai가 요약하는 코드 핵심요약
    buyer_count: number; // 구매자수
}