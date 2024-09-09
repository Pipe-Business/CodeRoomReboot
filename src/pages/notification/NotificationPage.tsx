import React, {FC, useEffect, useState} from 'react';
import styled from '@emotion/styled';
import MainLayout from '../../layout/MainLayout';
import {Box, Paper, Typography, Badge, Dialog, DialogTitle, DialogContent, IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {NotificationEntity} from '../../data/entity/NotificationEntity';
import {format} from 'date-fns';
import {useNavigate} from 'react-router-dom';
import {apiClient} from '../../api/ApiClient';
import AlertDialog from './components/AlertDialogProps';
import {RealtimePostgresInsertPayload} from "@supabase/realtime-js/src/RealtimeChannel";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const EmptyStateContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
    width: 100%;
`;

const EmptyStateMessage = styled(Typography)`
    color: #666666;
    text-align: center;
`;

const FeedbackDialog = styled(Dialog)({
    '& .MuiDialogContent-root': {
        padding: '16px',
    },
    '& .MuiDialogActions-root': {
        padding: '8px',
    },
});

const NotificationContainer = styled(Paper)`
    width: 100%;
    margin: 0 auto;
    padding: 16px;
    box-sizing: border-box;
    background-color: #f5f5f5;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const NotificationItem = styled(Paper) <{ notification_type: string }>`
    margin-bottom: 16px;
    padding: 16px;
    background-color: #ffffff;
    border-left: 5px solid;
    border-left-color: ${(props) => {
        switch (props.notification_type) {
            case 'granted':
                return '#4caf50'; // Green
            case 'sale':
                return '#2196f3'; // Blue
            case 'question_qna':
                return '#ff9800'; // Orange
            case 'answer_qna':
                return '#ea6cef'; // Orange
            case 'rejected':
                return '#f44336'; // Red
            case 'get_point':
                return '#9c27b0'; // Purple
            default:
                return '#3f51b5'; // Default color
        }
    }};
    width: 100%;
    max-width: 1200px;
    cursor: pointer;
    position: relative;
`;

const NotificationTitle = styled(Typography)`
    font-weight: bold;
    margin-bottom: 8px;
`;

const NotificationContent = styled(Typography)`
    margin-bottom: 8px;
`;

const NotificationItemType = styled(Typography)`
    font-style: italic;
    color: #666666;
    margin-bottom: 8px;
`;

const NotificationTimestamp = styled(Typography)`
    color: #999999;
`;

const UnreadBadge = styled(Badge)`
    position: absolute;
    top: 10px;
    right: 10px;
`;

const NotificationPage: FC = () => {
    const [notifications, setNotifications] = useState<NotificationEntity[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogContent, setDialogContent] = useState('');
    const [dialogFromToken, setDialogFromToken] = useState('');
    const [showReply, setShowReply] = useState(false);
    const [feedbackOpen, setFeedbackOpen] = useState(false);
    const [feedbackContent, setFeedbackContent] = useState('');
    const navigate = useNavigate();

    const handleInserts = async (payload: RealtimePostgresInsertPayload<NotificationEntity>) => {
        const notificationData: NotificationEntity = {
            id: payload.new.id,
            title: payload.new.title,
            content: payload.new.content,
            to_user_token: payload.new.to_user_token,
            from_user_token: payload.new.from_user_token,
            notification_type: payload.new.notification_type,
            is_read: payload.new.is_read,
            argument: payload.new.argument,
            created_at: payload.new.created_at,
        };

        const user = await apiClient.getCurrentLoginUser();
        if (notificationData.from_user_token === user.id) {
            setNotifications((prevNotifications) => {
                const newNotifications = prevNotifications.filter(
                    (notification) => notification.id !== notificationData.id
                );

                const notiList: NotificationEntity[] = [...newNotifications, notificationData];
                notiList.sort((a, b) => {
                    if (!a.created_at || !b.created_at) {
                        return 0; // created_at이 없는 경우 정렬하지 않음
                    }
                    return b.created_at.getTime() - a.created_at.getTime();
                });
                return notiList;
            });
        }
    };

    useEffect(() => {
        const initialize = async () => {
            const user = await apiClient.getCurrentLoginUser();
            const lastNotifications: NotificationEntity[] = await apiClient.getLastMyNotifications(user.id);
            setNotifications(lastNotifications);
            await apiClient.subscribeInsertNotification(handleInserts);
            await apiClient.updateNotificationIsRead(user.id);
        };

        initialize();
    }, []);

    const handleNotificationClick = (notification: NotificationEntity) => {
        switch (notification.notification_type) {
            case 'granted':
            case 'rejected':
                console.log('rejected');
                if (notification.argument) {
                    setFeedbackContent(notification.argument);
                    setFeedbackOpen(true);
                }
                // navigate('/profile/my');
                break;
            case 'get_point':
            case 'sale':
                navigate('/profile/my');
                break;
            case 'message_from_admin':
                break;
            case 'message_from_user':
                setDialogTitle(notification.title);
                setDialogContent(notification.content);
                setDialogFromToken(notification.from_user_token);
                setShowReply(true);
                setDialogOpen(true);
                break;
            default:
                break;
        }
    };

    const handleCloseFeedback = () => {
        setFeedbackOpen(false);
    };

    return (
        <MainLayout>
            <h1>알림함</h1>
            <NotificationContainer elevation={3} sx={{width: {xs: 400, sm: 600, md: 800, lg: 1200}}}>
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            notification_type={notification.notification_type}
                            elevation={3}
                            sx={{width: {xs: 300, sm: 500, md: 700, lg: 1100}}}
                            onClick={() => handleNotificationClick(notification)}
                        >
                            {notification.is_read === false && (
                                <UnreadBadge color="primary" variant="dot"/>
                            )}
                            <NotificationTitle variant="h6">{notification.title}</NotificationTitle>
                            <NotificationContent variant="body1">{notification.content}</NotificationContent>
                            <NotificationTimestamp variant="body2">
                                {notification.created_at ? format(new Date(notification.created_at), 'yyyy-MM-dd HH:mm') : ''}
                            </NotificationTimestamp>
                        </NotificationItem>
                    ))
                ) : (
                    <EmptyStateContainer>
                        <EmptyStateMessage variant="h6">
                            알림이 없습니다.
                        </EmptyStateMessage>
                        <EmptyStateMessage variant="body1">
                            새로운 알림이 오면 이곳에 표시됩니다.
                        </EmptyStateMessage>
                    </EmptyStateContainer>
                )}
            </NotificationContainer>
            <Box height={128}/>
            <AlertDialog
                open={dialogOpen}
                title={dialogTitle}
                content={dialogContent}
                fromUserToken={dialogFromToken}
                onClose={() => setDialogOpen(false)}
                showReply={showReply}
            />
            <FeedbackDialog
                open={feedbackOpen}
                onClose={handleCloseFeedback}
                aria-labelledby="feedback-dialog-title"
                maxWidth="md"
                fullWidth
            >
                <DialogTitle id="feedback-dialog-title">
                    심사 피드백
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseFeedback}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {feedbackContent}
                    </ReactMarkdown>
                </DialogContent>
            </FeedbackDialog>
        </MainLayout>
    );
};

export default NotificationPage;