import React, { FC, useCallback, useMemo } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import 'react-markdown-editor-lite/lib/index.css';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from "../../../api/ApiClient";
import { toast } from 'react-toastify';
import { NotificationEntity } from "../../../data/entity/NotificationEntity";
import { NotificationType } from "../../../enums/NotificationType";
import { PostStateType } from "../../../enums/PostStateType";
import { Octokit } from "@octokit/rest";
import { CodeModel } from "../../../data/model/CodeModel";

interface Props {
	children?: React.ReactNode,
	open: boolean,
	onClose: () => void,
	userToken: string,
	title: string,
	postId: string,
	refetch: () => void,
	isApproval: boolean,
	onReviewComplete: () => void,
}

const ReviewResultModal: FC<Props> = ({ postId, title, open, onClose, userToken, refetch, isApproval, onReviewComplete }) => {
	const [inputText, setInputText] = React.useState('');
	const mdParser = useMemo(() => new MarkdownIt(), []);
	const navigate = useNavigate();

	const { data: codeData } = useQuery({
		queryKey: ['codeRequest', postId],
		queryFn: () => apiClient.getTargetCode(Number(postId)),
	});

	const handleEditorChange = ({ text }: { text: string }) => {
		setInputText(text);
	};

	const approveMutation = useMutation({
		mutationFn: async (data: CodeModel) => {
			const octokit = new Octokit({ auth: process.env.REACT_APP_GITHUB_TOKEN });
			const forkUrl = await apiClient.forkForSellerGitRepo(octokit, data.sellerGithubName, data.githubRepoUrl);

			await apiClient.updateAdminGithubRepoUrl(data.id.toString(), forkUrl);

			const notificationEntity: NotificationEntity = {
				title: '심사 승인 알림',
				content: `업로드 하신 [ ${title} ] 의 심사 결과 승인 되었습니다.`,
				from_user_token: 'admin',
				to_user_token: data.userToken,
				notification_type: NotificationType.granted,
				argument: inputText,
			}
			console.log(`심사 승인 피드백 메시지 : ${inputText}`);
			await apiClient.insertNotification(notificationEntity);
			return true;
		},
		onSuccess: async (result) => {
			if (result) {
				await apiClient.updateCodeRequestState(userToken, postId, PostStateType.approve);
				await apiClient.insertCodeReviewResultHistory(userToken, postId, inputText, PostStateType.approve);
				toast.info('심사결과가 판매자에게 전달 되었습니다. (승인)');
				onReviewComplete(); // Call the callback function
			}
		},
		onError: (e) => {
			toast.error('포크도중 오류가 발생했습니다. 관리자가 초대를 안받았거나 url 이 잘못된경우에요');
			console.log(e);
		},
	});

	const rejectMutation = useMutation({
		mutationFn: async () => {
			await apiClient.updateCodeRequestState(userToken, postId, PostStateType.rejected);
			await apiClient.insertCodeReviewResultHistory(userToken, postId, inputText, PostStateType.rejected);

			const notificationEntity: NotificationEntity = {
				title: '심사 반려 알림',
				content: `업로드 하신 [ ${title} ] 의 심사 결과 반려 되었습니다.`,
				from_user_token: 'admin',
				to_user_token: userToken,
				notification_type: NotificationType.rejected,
				argument: inputText,
			}
			console.log(`심사 반려 피드백 메시지 : ${inputText}`);
			await apiClient.insertNotification(notificationEntity);
		},
		onSuccess: () => {
			toast.info('심사결과가 판매자에게 전달 되었습니다. (반려)');
			onReviewComplete(); // Call the callback function
		},
		onError: (e) => {
			toast.error('반려 처리 중 오류가 발생했습니다.');
			console.log(e);
		},
	});

	const onClickConfirm = useCallback(async () => {
		if(!inputText || inputText.trim() === ''){
			toast.error("심사 결과 내용을 입력해주세요")
			return
		}

		if (isApproval) {
			if (codeData) {
				approveMutation.mutate(codeData);
			}
		} else {
			rejectMutation.mutate();
		}

		onClose();
		// navigate('/admin');
	}, [inputText, isApproval, codeData, onClose, navigate, approveMutation, rejectMutation]);

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth={'lg'}>
			<DialogTitle>{isApproval ? '승인' : '반려'} 결과내용</DialogTitle>
			<DialogContent>
				<MdEditor
					style={{ height: '500px' }}
					renderHTML={text => mdParser.render(text)}
					onChange={handleEditorChange}
					placeholder={`${isApproval ? '승인' : '반려'} 결과 내용을 작성해주세요`}
				/>
			</DialogContent>
			<DialogActions>
				<Button variant={'outlined'} onClick={onClickConfirm}>확인</Button>
				<Button variant={'outlined'} onClick={onClose}>취소</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ReviewResultModal;