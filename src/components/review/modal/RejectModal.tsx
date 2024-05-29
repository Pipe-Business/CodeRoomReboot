import React, { FC, useCallback } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import useInput from '../../../hooks/useInput';
import { apiClient } from '../../../api/ApiClient';
import { createTodayDate } from '../../../utils/DayJsHelper';
import { toast } from 'react-toastify';
import { NotificationEntity } from '../../../data/entity/NotificationEntity';
import { NotificationType } from '../../../enums/NotificationType';

interface Props {
	children?: React.ReactNode,
	open: boolean,
	onClose: () => void,
	userToken: string,
	title: string,
	postId: string,
	refetch: () => void
}

const RejectModal: FC<Props> = ({ postId, title, open, onClose, userToken, refetch }) => {
	const [inputText, onChangeInputText] = useInput('');
	const onClickConfirm = useCallback(async () => {
		if(!inputText || inputText.trim()===''){
			toast.error("반려사유를 입력해주세요")
			return
		}
		const todayDate = createTodayDate();
	
		await apiClient.updateCodeRequestState(userToken, postId, 'rejected');
		await apiClient.updateCodeRequestRejectMessage(userToken, postId, inputText);

		const notificationEntity: NotificationEntity ={
			title : '심사 반려 알림',
			content: inputText,
			from_user_token: '045148b1-77db-4dfc-8d76-e11f7f9a4a10', // todo 관리자 토큰으로 수정 필요. 현재 관리자토큰을 입력하면 유저 알림함에서 보이지 않음
			to_user_token: userToken,
			notification_type: NotificationType.rejected,
		}
		await apiClient.insertNotification(notificationEntity);

		toast.info('반려처리가 완료되었습니다.');

		//await apiClient.updateTypeForCodeRequestByUser(userId, reqId, 'reject');
		//await firebaseSetFetcher(['codeRequest',reqId,'createdAt'],createTodayDate())
		// await firebaseSetFetcher(['codeRequest',reqId,'rejectMessage'],inputText)
		// await apiClient.sendNotificationByUser(userId, {
		// 	id: todayDate,
		// 	sender: 'admin',
		// 	content: `회원님의 ${title} 요청이 반려되었습니다. 반려 사유 :${inputText}`,
		// 	createdAt: todayDate,
		// });
		refetch();

		onClose();

	}, [inputText]);
	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth={'lg'}>
			<DialogTitle>반려사유</DialogTitle>
			<DialogContent>
				<TextField  multiline rows={3} value={inputText} fullWidth placeholder={'반려사유를 작성해주세요'} onChange={onChangeInputText} />
			</DialogContent>
			<DialogActions>
				<Button variant={'outlined'} onClick={onClickConfirm}>예</Button>
				<Button variant={'outlined'} onClick={onClose}>취소</Button>
			</DialogActions>

		</Dialog>
	);
};

export default RejectModal;