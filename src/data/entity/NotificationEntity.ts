import { NotificationType } from "../../enums/NotificationType";

export interface NotificationEntity {
    id?: number;
	title: string; // 알림함 제목 
	content: string; // 알림함 내용
	to_user_token: string; // 알림 전송자 uid
	from_user_token: string; // 알림 수신자 uid		
	notification_type: NotificationType; // 알림 유형
	created_at?: Date; // 생성일
}