import React, { FC, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import MainLayout from '../../layout/MainLayout';
import { Box, Typography, Paper } from '@mui/material';
import { NotificationEntity } from '../../data/entity/NotificationEntity';
import { NotificationType } from '../../enums/NotificationType';
import { format } from 'date-fns';
import { apiClient } from '../../api/ApiClient.ts'; // supabase가 필요 없는 것으로 보임

const NotificationContainer = styled(Paper)`
  width: 100%;  
  margin: 0 auto;
  padding: 16px;
  box-sizing: border-box;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center; /* Center align the NotificationItem elements */
`;

const NotificationItem = styled(Paper)<{ notificationType: string }>`
  margin-bottom: 16px;
  padding: 16px;
  background-color: #ffffff;
  border-left: 5px solid;
  border-left-color: ${(props) => {
    switch (props.notificationType) {
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
  width: 100%; /* Ensure the item takes full width */
  max-width: 800px; /* Optional: Max width for the item */
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
  // get last notification db
  


  // subscribe insert listener for notification table
  const handleInserts = async (payload) => {
    console.log('Change received!', payload);
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
      setNotifications((prevNotifications) => [...prevNotifications, notificationData]);
    }
    console.log('current_notifications', notifications);
  };

  useEffect(() => {
    console.log('NotificationPage가 마운트되었습니다.');

    const initialize = async () => {
      console.log('초기화 로직 실행');
      await apiClient.subscribeInsertNotification(handleInserts);
    };

    initialize();
  }, []); // 빈 배열을 두 번째 인자로 전달하여 컴포넌트가 마운트될 때만 실행되도록 합니다.

  const handleRemoveNotification = () => {
    setNotifications((prevNotifications) => {
      const updatedNotifications = [...prevNotifications];
      updatedNotifications.pop();
      return updatedNotifications;
    });
  };

  return (
    <MainLayout>
      <h1>알림함</h1>    
      <NotificationContainer elevation={3} sx={{ width: { xs: 400, sm: 500, md: 1000 } }}>
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notificationType={notification.notification_type} elevation={3} sx={{ width: { xs: 300, sm: 400, md: 800 } }}>
            <NotificationTitle variant="h6">{notification.title}</NotificationTitle>
            <NotificationContent variant="body1">{notification.content}</NotificationContent>
            <NotificationItemType variant="body2">{notification.notification_type}</NotificationItemType>
            <NotificationTimestamp variant="body2">{notification.created_at ? format(notification.created_at, 'yyyy-MM-dd HH:mm') : ''}</NotificationTimestamp>
          </NotificationItem>
        ))}
      </NotificationContainer>
      <Box height={128} />
      <button onClick={handleRemoveNotification}>Remove Last Notification</button>
    </MainLayout>
  );
};

export default NotificationPage;
