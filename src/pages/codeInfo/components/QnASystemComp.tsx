import React, {useEffect, useState} from "react";
import {CommentList} from "./CommentListComp";
import {CommentForm} from "./CommentFormComp";
import {CommentEntity} from "../../../data/entity/CommentEntity";
import {apiClient} from "../../../api/ApiClient";
import {useQueryUserLogin} from "../../../hooks/fetcher/UserFetcher";
import {useQuery} from "@tanstack/react-query";
import {REACT_QUERY_KEY} from "../../../constants/define";
import {useNavigate} from "react-router-dom";

interface QnASystemProps {
    postId: number;
}

const QnASystem: React.FC<QnASystemProps> = ({postId}) => {
    const {userLogin} = useQueryUserLogin();
    const {isLoading: isPostDataLoading, data: postData} = useQuery({
        queryKey: [REACT_QUERY_KEY.code, postId],
        queryFn: () => apiClient.getTargetCode(Number(postId)),
    });

    const [comments, setComments] = useState<CommentEntity[]>([]);

    const fetchComments = async () => {
        if (userLogin?.user_token) {
            const commentListData = await apiClient.fetchComments(postId, userLogin.user_token);
            if (commentListData) {
                setComments(commentListData);
            }
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId, userLogin]);

    const handleAddComment = async (content: string, parentCommentId?: number) => {
        if (userLogin?.user_token) {
            await apiClient.addComment(content, parentCommentId, userLogin.user_token, postId.toString());
            // 댓글 추가 후 목록 다시 불러오기
            fetchComments();
        }
    };

    const handleUpdateComment = async (commentId: number, content: string) => {
        if (userLogin) {
            const data = await apiClient.updateComment(commentId, content, userLogin?.user_token!);
            if (data) {
                fetchComments();
            }
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        if (userLogin) {
            const data = await apiClient.deleteComment(commentId, userLogin?.user_token!);
            if (data) {
                fetchComments();
            }
        }
    };

    return (
        <div className="qna-system">
            <CommentList
                comments={comments}
                addComment={handleAddComment}
                updateComment={handleUpdateComment}
                 deleteComment={handleDeleteComment}
                currentUserToken={userLogin?.user_token!}/>
            {/* 판매자 본인은 문의를 남길 수 없음 only 답변 댓글만 가능 */}
            {userLogin?.user_token !== postData?.userToken &&
                <CommentForm addComment={handleAddComment} title="문의 내용 작성" placeholder="내용을 입력하세요"
                             buttonText="작성 완료"/>}
        </div>
    );
};

export default QnASystem;