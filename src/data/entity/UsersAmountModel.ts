/**
 * 유저의 보유 재화 Model Type
 */
export interface UsersAmountModel {
    id?: number;
    user_token: string; // 유저 고유값
    coin_amount: number; // 코인 amount
}