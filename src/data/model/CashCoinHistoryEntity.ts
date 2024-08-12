export interface CashCoinHistoryEntity {
    id?: string; // ai id
    user_token: string; // 코인 충전 및 사용한 사람의 usertoken
    price: number; // 금액
    amount: number; // 총 금액
    price_history_type: string // 획득, 소비, 충전, 지출
    pay_type:string; // 코인 또는 캐시
    description: string;
    created_at?: string; // 생성 일시
}