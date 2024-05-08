export type CodeModel = {
    id: number,
    title: string,
    description: string,  /** 코드 설명 */
    images: string[],  /** 코드 결과물 이미지 url */
    price: number /** 코드 가격 */
    userToken: string, // 게시자 usertoken
    category: string, /** 카테고리(사용언어) */
    createdAt: string,  /** 코드 생성일 */
    hashTag: string[],
    state: string, // 상태
    adminGitRepoURL: string,  /** 관리자의 포크뜬 깃헙 url */

}