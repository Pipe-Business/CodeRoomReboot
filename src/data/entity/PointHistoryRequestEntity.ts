import { PointHistoryType } from "src/enums/PointHistoryType";

export interface PointHistoryRequestEntity {
    id?: number;
    point: number; // 캐시 금액
    amount: number; // 총 금액    
    user_token: string; // 포인트 충전 및 사용한 사람의 usertoken    
    point_history_type?: PointHistoryType // 획득 또는 소비
    description: string;
    from_user_token?: string;
    created_at?: string;
}