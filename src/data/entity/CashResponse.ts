interface CashResponseEntity {
    id?: string; // ai id
    user_token: string; // 캐시 충전한 사람의 usertoken
    cash: number; // 캐시 금액
    amount: number; // 총 금액
    charged_at?: number; // 캐시 충전 일시
}