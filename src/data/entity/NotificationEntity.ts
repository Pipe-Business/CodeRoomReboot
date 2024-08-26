import {NotificationType} from "../../enums/NotificationType";


export interface NotificationEntity {
    id?: number;
	title: string; // 알림함 제목 
	content: string; // 알림함 내용
	to_user_token: string; // 알림 전송자 uid
	from_user_token: string; // 알림 수신자 uid		
	notification_type: NotificationType; // 알림 유형
	is_read?: boolean; // 읽음 여부
	argument?: string; // 특정 데이터를 넣고 싶을 때 활용
	created_at?: Date; // 생성일
}