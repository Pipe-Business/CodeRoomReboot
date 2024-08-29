import React, {useEffect, useState} from 'react';
import {
    Typography,
    Button,
    Box,
    Avatar,
    Paper,
    Divider,
    Collapse,
    IconButton, TextField,
} from '@mui/material';
import {
    Reply as ReplyIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import {CommentEntity} from "../../../data/entity/CommentEntity";
import {CommentForm} from "./CommentFormComp";
import {useQuery} from "@tanstack/react-query";
import {apiClient} from "../../../api/ApiClient";
import {useQueryUserById, useQueryUserLogin} from "../../../hooks/fetcher/UserFetcher";
import CloseIcon from "@mui/icons-material/Close";
import {REACT_QUERY_KEY} from "../../../constants/define";

interface CommentItemProps {
    comment: CommentEntity;
    replies: CommentEntity[];
    addComment: (content: string, parentCommentId?: number) => Promise<void>;
    updateComment: (commentId: number, content: string) => Promise<void>;
    deleteComment: (commentId: number) => Promise<void>;
    currentUserToken: string;
    depth?: number;
}

export const CommentItem: React.FC<CommentItemProps> = ({
                                                            comment,
                                                            replies,
                                                            addComment,
                                                            updateComment,
                                                            deleteComment,
                                                            currentUserToken,
                                                            depth = 0
                                                        }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [expanded, setExpanded] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const { userLogin } = useQueryUserLogin();
    const { isLoading: isPostDataLoading, data: postData } = useQuery({
        queryKey: [REACT_QUERY_KEY.code, comment.post_id],
        queryFn: () => apiClient.getTargetCode(Number(comment.post_id)),
    });

    const handleReply = () => {
        setShowReplyForm(!showReplyForm);
    };

    const handleExpand = () => {
        setExpanded(!expanded);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedContent(comment.content);
    };

    const handleSaveEdit = async () => {
        if (editedContent.trim() !== comment.content) {
            await updateComment(comment.id!, editedContent);
        }
        setIsEditing(false);
    };

    const handleDelete = async () => {
        if (window.confirm('선택하신 댓글이 제거됩니다. 계속하시겠습니까?')) {
            await deleteComment(comment.id!);
        }
    };

    const handleAddComment = async (content: string) => {
        await addComment(content, comment.id!);
        setShowReplyForm(false);  // 답변 추가 후 폼 닫기
    };

    const canEditOrDelete = currentUserToken === comment.user_token;

    const { userById } = useQueryUserById(comment.user_token);

    const avatarColor = `#${((userById?.id! * 0xffffff) << 0).toString(16).padStart(6, '0')}`;

    return (
        <Paper elevation={depth === 0 ? 3 : 0} sx={{p: 2, mb: 2, ml: depth * 2}}>
            <Box display="flex" alignItems="flex-start">
                {userById?.profile_url == null ? (<Avatar sx={{bgcolor: avatarColor, mr: 2}}>
                {userById?.email ? userById?.email[0].toUpperCase() : 'U'} </Avatar>) : (<Avatar src={userById?.profile_url} sx={{mr: 2}}></Avatar>)}
                <Box flexGrow={1}>
                    <Typography variant="subtitle2" fontWeight="bold">
                        {userById?.nickname || 'Anonymous'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        {new Date(comment.created_at!).toLocaleString()}
                    </Typography>
                    {isEditing ? (
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            margin="normal"
                        />
                    ) : (
                        <Typography variant="body1" paragraph>
                            {comment.content}
                        </Typography>
                    )}
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        {/* 문의글을 남긴 사람과 판매자만 문의사항에 대한 답글을 남길 수 있음*/}
                        {postData?.userToken === userLogin?.user_token && comment.user_token !== userLogin?.user_token &&
                            <Button
                                startIcon={showReplyForm ? <CloseIcon/> : <ReplyIcon/>}
                                onClick={handleReply}
                                size="small"
                            >
                                {showReplyForm ? '답변취소' : '답변하기'}
                            </Button>}
                        {canEditOrDelete && (
                            <Box>
                                {isEditing ? (
                                    <>
                                        <Button onClick={handleCancelEdit} size="small">취소</Button>
                                        <Button onClick={handleSaveEdit} size="small">완료</Button>
                                    </>
                                ) : (
                                    <>
                                        <IconButton onClick={handleEdit} size="small">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={handleDelete} size="small">
                                            <DeleteIcon />
                                        </IconButton>
                                    </>
                                )}
                            </Box>
                        )}
                        {replies.length > 0 && (
                            <IconButton onClick={handleExpand} size="small">
                                {expanded ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                            </IconButton>
                        )}
                    </Box>
                </Box>
            </Box>

            <Collapse in={showReplyForm}>
                <Box mt={2}>
                    <CommentForm addComment={handleAddComment} title="답변 내용 작성" placeholder="답변 내용을 입력하세요"
                                 buttonText="답변 완료"/>
                </Box>
            </Collapse>

            {replies.length > 0 && (
                <Collapse in={expanded}>
                    <Divider sx={{my: 2}}/>
                    <Box>
                        {replies.map(reply => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                replies={[]}
                                addComment={addComment}
                                updateComment={updateComment}
                                deleteComment={deleteComment}
                                currentUserToken={currentUserToken}
                                depth={depth + 1}
                            />
                        ))}
                    </Box>
                </Collapse>
            )}
        </Paper>
    );
};