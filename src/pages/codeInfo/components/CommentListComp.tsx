// 댓글 목록 컴포넌트
import React from "react";
import {CommentItem} from "./CommentItemComp";
import {CommentEntity} from "../../../data/entity/CommentEntity";

export const CommentList: React.FC<{
    comments: CommentEntity[],
    addComment: (content: string) => Promise<void>
}> = ({comments, addComment}) => {
    const rootComments = comments.filter(comment => !comment.parent_comment_id);

    return (
        <div className="comment-list">
            {rootComments.map(comment => (
                <CommentItem key={comment.id} comment={comment}
                             replies={comments.filter(reply => reply.parent_comment_id === comment.id)}
                             addComment={addComment}/>
            ))}
        </div>
    );
};