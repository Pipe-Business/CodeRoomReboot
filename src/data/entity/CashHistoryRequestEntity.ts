interface CashHistoryRequestEntity {
    user_token: string; // 캐시 충전 및 사용한 사람의 usertoken
    cash: number; // 캐시 금액
    amount: number; // 총 금액
    cash_history_type?: string // 획득 또는 소비
    description : string; // 설명
}