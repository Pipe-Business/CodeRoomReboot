import {CoinHistoryType} from "../../enums/CoinHistoryType";

/**
 *  파이프코인 사용 및 지급 내역 히스토리 응답 interface
 */

export interface UsersCoinHistoryRes {
    id: string; // ai id
    coin: number; // 코인 금액
    user_token: string; // 유저의 고유값
    amount: number; // 총 코인 값
    description: string; // 상세 내용
    from_user_token?: string; // 포인트 지급한 유저의 토큰
    coin_history_type: CoinHistoryType // 획득 또는 소비
    created_at: string; // 생성 일시
}