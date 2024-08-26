import {PostStateType} from "../../enums/PostStateType";

export interface ReviewResultHistoryEntity {
    id?: number;
    post_id: number;
    user_token: string; // 심사 대상자의 user_token
    review_msg: string; // 리뷰 결과 메시지
    state: PostStateType.pending | PostStateType.rejected | PostStateType.approve; // 코드의 현재 상태: 'pending'(대기), 'rejected'(거절), 'approve(승인)' 중 하나
    created_at?: number; //코드 생성일
}
