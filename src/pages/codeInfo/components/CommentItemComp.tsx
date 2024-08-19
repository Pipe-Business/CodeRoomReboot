import React, {useEffect, useState} from 'react';
import {
    Typography,
    Button,
    Box,
    Avatar,
    Paper,
    Divider,
    Collapse,
    IconButton,
} from '@mui/material';
import {
    Reply as ReplyIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon
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
    addComment: (content: string, parentId: number | null) => Promise<void>;
    depth?: number;
}

export const CommentItem: React.FC<CommentItemProps> = ({
                                                            comment,
                                                            replies,
                                                            addComment,
                                                            depth = 0
                                                        }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [expanded, setExpanded] = useState(true);

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
                    <Typography variant="body1" paragraph>
                        {comment.content}
                    </Typography>
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
                    <CommentForm addComment={(content) => addComment(content, comment.id!)} title="답변 내용 작성" placeholder="답변 내용을 입력하세요"
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
                                depth={depth + 1}
                            />
                        ))}
                    </Box>
                </Collapse>
            )}
        </Paper>
    );
};