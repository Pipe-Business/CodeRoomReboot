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
	codePost: CodeModel,
	open: boolean,
	onClose: () => void
}

const DeleteModal: FC<Props> = ({ open, onClose, codePost}) => {
	const { userId, codeId } = useParams();
	const navigate = useNavigate();

	 const { mutate } = useMutation({
		mutationFn: async () => {
			apiClient.deletePost(codePost.id);
			},
		onSuccess: async () => {
		toast.success('게시글이 삭제처리 되었습니다.')
		},
		onError: (e) => {
			toast.error('게시글 삭제에 실패했습니다. 관리자에게 연락주세요');
			console.log(e);
	 	},
	 });


	 const onClickConfirm = useCallback(() => {
		mutate();
		onClose();
		navigate('/');
    }, [codePost.id]);



	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>게시글을 삭제하시겠습니까?</DialogTitle>
			{/*<TextField sx={{width:'400px'}} value={data.forkUrl} onChange={onChangeGithubRepoUrl} placeholder={"관리자가 포크뜬 레포주소"}/>*/}
			<DialogActions>
				<Button variant={'outlined'} onClick={onClickConfirm}>예</Button>
				<Button variant={'outlined'} onClick={onClose}>아니오</Button>
			</DialogActions>

		</Dialog>
	);
};

export default DeleteModal;