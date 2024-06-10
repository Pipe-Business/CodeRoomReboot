import React, {FC, useEffect, useState} from 'react';
import styled from '@emotion/styled';
import MainLayout from '../../layout/MainLayout';
import {Box, Paper, Typography} from '@mui/material';
import {NotificationEntity} from '../../data/entity/NotificationEntity';
import {format} from 'date-fns';
import {useNavigate} from 'react-router-dom';
import {apiClient} from '../../api/ApiClient';
import AlertDialog from './components/AlertDialogProps';

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
      case 'message_from_user':
        return '#ff9800'; // Orange
      case 'message_from_admin':
        return '#f44336'; // Red
      case 'get_point':
        return '#9c27b0'; // Purple
      default:
        return '#3f51b5'; // Default color
    }
  }};
  width: 100%;
  max-width: 1200px;
  cursor: pointer; /* Add cursor pointer to indicate clickable */
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

const NotificationPage: FC = () => {
  const [notifications, setNotifications] = useState<NotificationEntity[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogContent, setDialogContent] = useState('');
  const [dialogFromToken, setDialogFromToken] = useState('');
  const [showReply, setShowReply] = useState(false);
  const navigate = useNavigate();

  const handleInserts = async (payload) => {
    const notificationData: NotificationEntity = {
      id: payload.new.id,
      title: payload.new.title,
      content: payload.new.content,
      to_user_token: payload.new.to_user_token,
      from_user_token: payload.new.from_user_token,
      notification_type: payload.new.notification_type,
      created_at: payload.new.created_at,
    };

    const userResponse = await apiClient.getCurrentLoginUser();
    if (notificationData.from_user_token === userResponse.user.id) {
      setNotifications((prevNotifications) => {
        const newNotifications = prevNotifications.filter(
          (notification) => notification.id !== notificationData.id
        );
        return [...newNotifications, notificationData];
      });
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const userResponse = await apiClient.getCurrentLoginUser();
      const lastNotifications: NotificationEntity[] = await apiClient.getLastMyNotifications(userResponse.user.id);
      setNotifications(lastNotifications);
      await apiClient.subscribeInsertNotification(handleInserts);
    };

    initialize();
  }, []);

  const handleNotificationClick = (notification: NotificationEntity) => {
    switch (notification.notification_type) {
      case 'granted':
        navigate('/profile/my') // Replace with actual route
        break;
      case 'rejected':
        navigate('/profile/my') // Replace with actual route
        break;
      case 'get_point':
      case 'sale':
        navigate('/profile/my') // Replace with actual route
        break;
      case 'message_from_admin':
        break;
      case 'message_from_user':
      
        setDialogTitle(notification.title);
        setDialogContent(notification.content);
        setDialogFromToken(notification.from_user_token)
        setShowReply(true);
        setDialogOpen(true);
        break;
      default:
        break;
    }
  };

  return (
    <MainLayout>
      <h1>알림함</h1>
      <NotificationContainer elevation={3} sx={{ width: { xs: 400, sm: 600, md: 800, lg: 1200 } }}>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification_type={notification.notification_type}
            elevation={3}
            sx={{ width: { xs: 300, sm: 500, md: 700, lg: 1100 } }}
            onClick={() => handleNotificationClick(notification)}
          >
            <NotificationTitle variant="h6">{notification.title}</NotificationTitle>
            <NotificationContent variant="body1">{notification.content}</NotificationContent>
            {/* <NotificationItemType variant="body2">{notification.notification_type}</NotificationItemType> */}
            <NotificationTimestamp variant="body2">{notification.created_at ? format(new Date(notification.created_at), 'yyyy-MM-dd HH:mm') : ''}</NotificationTimestamp>
          </NotificationItem>
        ))}
      </NotificationContainer>
      <Box height={128} />      
      <AlertDialog
        open={dialogOpen}
        title={dialogTitle}
        content={dialogContent}
        fromUserToken={dialogFromToken}
        onClose={() => setDialogOpen(false)}
        showReply={showReply}
      />
    </MainLayout>
  );
};

export default NotificationPage;
