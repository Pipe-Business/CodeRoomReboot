import {PointHistoryType} from "../../enums/PointHistoryType";

export interface PointHistoryRequestEntity {
    id?: number;
    point: number; // 캐시 금액
    user_token: string; // 충전 및 사용한 사람의 usertoken
    amount:number;
    point_history_type?: PointHistoryType // 획득 또는 소비
    description: string;
    from_user_token?: string;
    purchase_id? : number; // 구매기록 id
    created_at?: string;
}