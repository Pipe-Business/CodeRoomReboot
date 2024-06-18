import React, { FC, useCallback } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import useInput from '../../../hooks/UseInput';
import {apiClient} from "../../../api/ApiClient";
import { toast } from 'react-toastify';
import {NotificationEntity} from "../../../data/entity/NotificationEntity";
import {NotificationType} from "../../../enums/NotificationType";

interface Props {
	children?: React.ReactNode,
	open: boolean,
	onClose: () => void,
	userToken: string,
	title: string,
	postId: string,
	refetch: () => void,
}

const RejectModal: FC<Props> = ({ postId, title, open, onClose, userToken,refetch }) => {
	const [inputText, onChangeInputText] = useInput('');
	const onClickConfirm = useCallback(async () => {
		if(!inputText || inputText.trim()===''){
			toast.error("반려사유를 입력해주세요")
			return
		}

	
		await apiClient.updateCodeRequestState(userToken, postId, 'rejected');
		await apiClient.updateCodeRequestRejectMessage(userToken, postId, inputText);

		const notificationEntity: NotificationEntity ={
			title : '심사 반려 알림',
			content: inputText,
			from_user_token: 'admin',
			to_user_token: userToken,
			notification_type: NotificationType.rejected,
		}
		await apiClient.insertNotification(notificationEntity);

		toast.info('반려처리가 완료되었습니다.');

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