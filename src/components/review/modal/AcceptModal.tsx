import React, { FC, useCallback } from 'react';
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import {apiClient} from "../../../api/ApiClient";
import { toast } from 'react-toastify';
import {CodeModel} from "../../../data/model/CodeModel";
import {NotificationEntity} from "../../../data/entity/NotificationEntity";
import {NotificationType} from "../../../enums/NotificationType"
import {PostStateType} from "../../../enums/PostStateType";

interface Props {
	children?: React.ReactNode
	open: boolean,
	onClose: () => void
}

const AcceptModal: FC<Props> = ({ open, onClose }) => {
	const { userId, codeId } = useParams();
	const navigate = useNavigate();

	const { isLoading, data } = useQuery({
		queryKey: ['codeRequest', codeId],
		queryFn: () => apiClient.getTargetCode(Number(codeId)),
	});
	 const { mutate } = useMutation({
		mutationFn: async (data: CodeModel) => {

			const forkUrl = await apiClient.forkForSellerGitRepo(data.sellerGithubName, data.githubRepoUrl);
			// console.log(""+ forkUrl);
		
			// fork한 데이터 update
			await apiClient.updateAdminGithubRepoUrl(data.id.toString(),forkUrl);

			// readme insert
			 const readMe: string = await apiClient.getReadMe(forkUrl);
			 await apiClient.insertReadme(data.id.toString(), readMe);

			// 알림보내기
			const notificationEntity: NotificationEntity ={
				title : '심사 승인 알림',
				content: '업로드하신 코드 게시물의 심사를 승인해드렸습니다.',
				from_user_token: 'admin',
				to_user_token: data.userToken,
				notification_type: NotificationType.granted,
			}
			await apiClient.insertNotification(notificationEntity);
				return true;
			},
		onSuccess: async (result) => {
			if (result) {
				await apiClient.updateCodeRequestState(data?.userToken!, data!.id!.toString(), PostStateType.approve);
			}
		},
		onError: (e) => {
			toast.error('포크도중 오류가 발생했습니다. 관리자가 초대를 안받았거나 url 이 잘못된경우에요');
			console.log(e);
	 	},
	 });

	const onClickConfirm = useCallback(() => {
			if (!userId || !codeId) {
		return <>404 NotFound Error</>;
	}
	if (isLoading) {
		return <>loading</>;
	}
	if (!data) {
		return <>no data</>;
	}
		mutate(data);
		onClose();
		navigate('/admin');
	}, []);


	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>승인하시겠습니까?</DialogTitle>
			<DialogActions>
				<Button variant={'outlined'} onClick={onClickConfirm}>예</Button>
				<Button variant={'outlined'} onClick={onClose}>아니오</Button>
			</DialogActions>

		</Dialog>
	);
};

export default AcceptModal;