import React, { FC, useCallback } from 'react';
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
// import { setOneCode } from '../../../../utils/manager/FireBaseManager.ts';
import { useNavigate, useParams } from 'react-router-dom';
//import { firebaseGetOneFetcher, firebaseSetFetcher, getAllFirebaseData } from '../../../../utils/QueryFetcher.ts';
import { apiClient } from '../../../api/ApiClient.ts';
import { createTodayDate } from '../../../utils/DayJsHelper.ts';
import { toast } from 'react-toastify';
import { CodeModel } from '../../../data/model/CodeModel.ts';
import { NotificationEntity } from '../../../data/entity/NotificationEntity.ts';
import { NotificationType } from '../../../enums/NotificationType.tsx';

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
			
	 		//if(data.formType==='code'){
				const forkUrl = await apiClient.forkForSellerGitRepo(data.sellerGithubName, data.githubRepoUrl);
				console.log(""+ forkUrl);
	 		//}
		
			// fork한 데이터 update
			await apiClient.updateAdminGithubRepoUrl(data.id.toString(),forkUrl);
			// todo 알림보내기
			const notificationEntity: NotificationEntity ={
				title : '심사 승인 알림',
				content: '업로드하신 코드 게시물의 심사를 승인해드렸습니다.',
				from_user_token: '045148b1-77db-4dfc-8d76-e11f7f9a4a10', // todo 관리자 토큰으로 수정 필요. 현재 관리자토큰을 입력하면 유저 알림함에서 보이지 않음
				to_user_token: data.userToken,
				notification_type: NotificationType.granted,
			}
			await apiClient.insertNotification(notificationEntity);
				return true;
			},
		onSuccess: async (result) => {
			if (result) {
				await apiClient.updateCodeRequestState(data?.userToken!, data!.id!.toString(), 'approve');
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
			{/*<TextField sx={{width:'400px'}} value={data.forkUrl} onChange={onChangeGithubRepoUrl} placeholder={"관리자가 포크뜬 레포주소"}/>*/}
			<DialogActions>
				<Button variant={'outlined'} onClick={onClickConfirm}>예</Button>
				<Button variant={'outlined'} onClick={onClose}>아니오</Button>
			</DialogActions>

		</Dialog>
	);
};

export default AcceptModal;