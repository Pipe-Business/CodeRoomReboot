interface PostRequestEntity {
	id?: string;
	title: string; // 제목 
	description: string; // 설명
	images?: string[]; // 코드 결과물 이미지
	price: number; // 가격
	userToken: string; // 코드를 게시한 사용자의 UserEntity id
	category: string; //  코드 카테고리 (사용 언어 등)
	url: string; // 코드의 URL
	state: 'pending' | 'reject' | 'approve'; // 코드의 현재 상태: 'pending'(대기), 'reject'(거절), 'approve(승인)' 중 하나
	createdAt?: string; //코드 생성일
	sellerGithubName: string; // 판매자의 GitHub 사용자명
	adminGitRepoURL?: string; // 관리자의 포크한 깃헙 URL
	forkUrl?: string; // 포크된 깃헙 URL
	formType:'article'|'code' // 폼의 유형 article 게시글, code 코드
	hash_tag : string[] // 해시태그
}
