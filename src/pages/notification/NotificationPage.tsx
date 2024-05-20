import React, { FC } from 'react';
import styled from '@emotion/styled';
import MainLayout from '../../layout/MainLayout';
import { Box, Typography, Paper } from '@mui/material';
import { NotificationEntity } from '../../data/entity/NotificationEntity';
import { NotificationType } from '../../enums/NotificationType';
import { format } from 'date-fns';

const notifications: NotificationEntity[] = [
  { id: 1, title: '심사승인 알림', content: '귀하의 코드가 심사에 승인되었습니다.', to_user_token: "abcde", from_user_token: "abcde", notification_type: NotificationType.granted, created_at: new Date() },
  { id: 2, title: '코드판매 알림', content: '귀하의 코드가 판매되었습니다.', to_user_token: "abcde", from_user_token: "abcde", notification_type: NotificationType.sale, created_at: new Date() },
  { id: 3, title: '1:1 쪽지 알림', content: '새로운 1:1 쪽지가 도착했습니다.', to_user_token: "abcde", from_user_token: "abcde", notification_type: NotificationType.message_from_user, created_at: new Date() },
  { id: 4, title: '관리자 쪽지 알림', content: '관리자로부터 새로운 쪽지가 도착했습니다.', to_user_token: "abcde", from_user_token: "abcde", notification_type: NotificationType.message_from_admin, created_at: new Date() },
  { id: 5, title: '포인트 지급 알림', content: '포인트가 지급되었습니다.', to_user_token: "abcde", from_user_token: "abcde", notification_type: NotificationType.get_point, created_at: new Date() },
];

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
  return (
    <MainLayout>
      <h1>알림함</h1>    
      <NotificationContainer elevation={3} sx={{ width: {xs:400, sm: 500, md: 1000 } }}>
        {notifications.map(notification => (
          <NotificationItem key={notification.id} notificationType={notification.notification_type} elevation={3} sx={{ width: {xs:300, sm: 400, md: 800 } }}>
            <NotificationTitle variant="h6">{notification.title}</NotificationTitle>
            <NotificationContent variant="body1">{notification.content}</NotificationContent>
            <NotificationItemType variant="body2">{notification.notification_type}</NotificationItemType>
            <NotificationTimestamp variant="body2">{notification.created_at ? format(notification.created_at, 'yyyy-MM-dd HH:mm') : ''}</NotificationTimestamp>
          </NotificationItem>
        ))}
      </NotificationContainer>
      <Box height={128} />
    </MainLayout>
  );
};

export default NotificationPage;
