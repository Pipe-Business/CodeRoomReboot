export type MainPageCodeListEntity = {
    id: number,
    title: string,
    description: string,  /** 코드 설명 */
    images: string[],  /** 코드 결과물 이미지 url */
    code_price: number /** 코드 가격 */
    userToken: string, // 게시자 usertoken
    popularity:number, // 코드 평점
    category: string, /** 카테고리(프론트엔드, 웹 퍼블리싱 등..) */
    language:string, // 개발 언어
    createdAt: string,  /** 코드 생성일 */
    postType:string, // 코드 / 글
    hashTag?: string[],
    aiSummary: string, // 구매자가이드
    buyerCount: number, // 구매자수
    state: string, // 상태
    adminGitRepoURL: string,  /** 관리자의 포크뜬 깃헙 url */
    githubRepoUrl: string, // 깃허브 url
    sellerGithubName: string, // 판매자의 GitHub 사용자명
    viewCount : number, // 조회수
    rejectMessage : string, // 반려사유
    reviewCount: number, // 구매자 후기 갯수
    likeCount: number, // 좋아요 수
    is_deleted: boolean; // 삭제된 게시물인지 확인
}