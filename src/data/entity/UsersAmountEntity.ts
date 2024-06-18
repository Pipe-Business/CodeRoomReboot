export interface UsersAmountEntity {
    id?: number;
    user_token: string; // 캐시 충전 및 사용한 사람의 usertoken
    cash_amount: number;
    point_amount: number;
}