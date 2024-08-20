// 댓글 목록 컴포넌트
import React from "react";
import {CommentItem} from "./CommentItemComp";
import {CommentEntity} from "../../../data/entity/CommentEntity";


interface CommentListProps {
    comments: CommentEntity[];
    addComment: (content: string, parentCommentId?: number) => Promise<void>;
    updateComment: (commentId: number, content: string) => Promise<void>;
    deleteComment: (commentId: number) => Promise<void>;
    currentUserToken: string;
}

export const CommentList: React.FC<CommentListProps>= ({comments,
                                                           addComment,
                                                           updateComment,
                                                           deleteComment,
                                                           currentUserToken}) => {
    const rootComments = comments.filter(comment => !comment.parent_comment_id);

    return (
        <div className="comment-list">
            {rootComments.map(comment => (
                <CommentItem key={comment.id} comment={comment}
                             replies={comments.filter(reply => reply.parent_comment_id === comment.id)}
                             addComment={addComment}
                             updateComment={updateComment}
                             deleteComment={deleteComment}
                             currentUserToken={currentUserToken}/>
            ))}
        </div>
    );
};