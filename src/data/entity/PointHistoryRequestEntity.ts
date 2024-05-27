interface PointHistoryRequestEntity {
    user_token: string; // 포인트 충전 및 사용한 사람의 usertoken
    point: number; // 캐시 금액
    amount: number; // 총 금액
    point_history_type?: string // 획득 또는 소비
    description: string;
}