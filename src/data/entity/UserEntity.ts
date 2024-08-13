export type UserEntity = {
    //id: number | null,
    authType: string, // 회원가입한 서비스 유형 (gmail,github 등..)
    email: string, // 이메일 (id)
    name?: string, // 이름
    nickname: string, // 닉네임
    profileUrl?: string, // 프로필이미지
    aboutMe?: string, // 내 소개
    userToken?: string, // 유저 고유 토큰
    is_profile_image_rewarded: boolean, // 프로필 이미지 설정 보상 수령 여부
    is_introduce_rewarded: boolean, // 자기소개 설정 보상 수령 여부
    //createdAt: string|null, // 생성일
}