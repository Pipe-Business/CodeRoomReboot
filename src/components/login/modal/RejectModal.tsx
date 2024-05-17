import React, { FC, useCallback } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import useInput from '../../../hooks/useInput';
import { apiClient } from '../../../api/ApiClient';
import { createTodayDate } from '../../../utils/DayJsHelper';
import { toast } from 'react-toastify';

interface Props {
	children?: React.ReactNode,
	open: boolean,
	onClose: () => void,
	userId: string,
	title: string,
	reqId: string,
	refetch: () => void
}

const RejectModal: FC<Props> = ({ reqId, title, open, onClose, userId, refetch }) => {
	const [inputText, onChangeInputText] = useInput('');
	const onClickConfirm = useCallback(async () => {
		if(!inputText || inputText.trim()===''){
			toast.error("반려사유를 입력해주세요")
			return
		}
		// const todayDate = createTodayDate();
		// // firebaseSetFetcher(['codeRequest'])
		// await apiClient.updateCodeRequestType(userId, reqId, 'reject');
		// await apiClient.updateTypeForCodeRequestByUser(userId, reqId, 'reject');
		// await firebaseSetFetcher(['codeRequest',reqId,'createdAt'],createTodayDate())
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