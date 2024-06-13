export type UserModel = {
    id: number | null,
    auth_type: string, // 회원가입한 서비스 유형 (gmail,github 등..)
    email: string, // 이메일 (id)
    name: string|null, // 이름
    nickname: string, // 닉네임
    profile_url: string|null, // 프로필이미지
    about_me: string|null, // 내 소개
    contacts: string[]|null, // 연락처 (URL,SNS,이메일)
    user_token: string|null, // 유저 고유 토큰
    is_profile_image_rewarded: boolean, // 프로필 이미지 설정 보상 수령 여부
    is_introduce_rewarded: boolean, // 자기소개 설정 보상 수령 여부
    created_at: string|null, // 생성일
}