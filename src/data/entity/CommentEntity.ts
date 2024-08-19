export interface CommentEntity {
    id?: number;
    user_token: string; // uid
    post_id: number; // 게시글 id
    content: string; // 댓글 내용
    parent_comment_id?: number; // 부모 댓글 id (null일 경우 부모 댓글)
    created_at?: Date; // 생성일
}