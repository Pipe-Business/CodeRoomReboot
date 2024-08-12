import React, { FC } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
	Button,
	IconButton,
	Skeleton,
	Typography,
	Card,
	CardContent,
	Grid,
	Chip,
	Box,
	Divider
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

import AdminLayout from '../../layout/AdminLayout';
import useDialogState from '../../hooks/UseDialogState';
import AcceptModal from '../../components/review/modal/AcceptModal';
import RejectModal from '../../components/review/modal/RejectModal';
import { reformatTime } from "../../utils/DayJsHelper";
import { useQueryUserById } from "../../hooks/fetcher/UserFetcher";
import { CATEGORY_TO_KOR } from "../../constants/define";
import { apiClient } from "../../api/ApiClient";
import { PostStateType } from "../../enums/PostStateType";
import ReadMeHtml from "../codeInfo/components/ReadMeHtml";

const StyledCard = styled(Card)(({ theme }) => ({
	marginBottom: theme.spacing(3),
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
	'&:last-child': {
		paddingBottom: theme.spacing(2),
	},
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
	fontWeight: 'bold',
	marginBottom: theme.spacing(1),
}));

const ContentTypography = styled(Typography)(({ theme }) => ({
	marginBottom: theme.spacing(2),
}));

interface Props {
	children?: React.ReactNode;
}


function extractRepoName(url: string): string {
	// Split the URL by '/' and get the last element
	const parts = url.split('/');
	return parts[parts.length - 1];
}

const AdminCodeRequestInfo: FC<Props> = () => {
	const { userId, codeId } = useParams();
	const navigate = useNavigate();

	const { isLoading, data } = useQuery({
		queryKey: ['codeRequest', codeId],
		queryFn: () => apiClient.getTargetCode(Number(codeId)),
	});

	const { userById } = useQueryUserById(userId!);
	const [openAcceptModal, onOpenAcceptModal, onCloseAcceptModal] = useDialogState();
	const [openRejectModal, onOpenRejectModal, onCloseRejectModal] = useDialogState();

	const handleSmartAnalysis = () => {
		navigate(`/admin/codeRequest/${userId}/${codeId}/smart-analysis/`, {
			state: {
				githubRepoUrl: extractRepoName(data?.githubRepoUrl as string),
				sellerGithubName: data?.sellerGithubName
			}
		});
	};

	if (isLoading) {
		return (
			<AdminLayout>
				<Box sx={{ padding: 3 }}>
					<Skeleton variant="rectangular" width="100%" height={118} />
					<Skeleton />
					<Skeleton width="60%" />
				</Box>
			</AdminLayout>
		);
	}

	if (!userById) {
		return <Typography variant="h6">User not found</Typography>;
	}

	if (!data) {
		return <Typography variant="h6">404 Error: Code request not found</Typography>;
	}

	return (
		<AdminLayout>
			<Box sx={{ padding: 3, maxWidth: 800, margin: 'auto' }}>
				<Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
					<IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
						<ArrowBack />
					</IconButton>
					<Typography variant="h6">{userById.nickname} 님의 {data.title}</Typography>
				</Box>

				<Chip
					label={data.state === PostStateType.pending ? '요청 대기' : data.state === PostStateType.rejected ? '요청 반려' : '승인'}
					color={data.state === PostStateType.pending ? 'warning' : data.state === PostStateType.rejected ? 'error' : 'success'}
					sx={{ mb: 3, fontSize: '1.2rem', padding: '20px 10px' }}
				/>

				<Button
					variant="contained"
					color="primary"
					onClick={handleSmartAnalysis}
					sx={{ mb: 3, ml: 2 }}
				>
					스마트 코드 분석
				</Button>

				{data.state === PostStateType.rejected && (
					<StyledCard>
						<StyledCardContent>
							<TitleTypography variant="h6">반려사유</TitleTypography>
							<ContentTypography>{data.reviewResultMsg}</ContentTypography>
						</StyledCardContent>
					</StyledCard>
				)}

				<StyledCard>
					<StyledCardContent>
						<TitleTypography variant="h6">제목</TitleTypography>
						<ContentTypography>{data.title}</ContentTypography>
					</StyledCardContent>
				</StyledCard>

				<StyledCard>
					<StyledCardContent>
						<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
							<img src='/robot.png' alt='robot' width="32" style={{marginRight: '10px'}}/>
							<TitleTypography variant="h6">AI ROOMY의 KeyPoint ✨</TitleTypography>
						</Box>
						<ContentTypography>{data.aiSummary}</ContentTypography>
					</StyledCardContent>
				</StyledCard>

				{data.description && (
					<StyledCard>
						<StyledCardContent>
							<TitleTypography variant="h6">코드 설명</TitleTypography>
							<ReadMeHtml htmlText={data.description} />
						</StyledCardContent>
					</StyledCard>
				)}

				<Grid container spacing={3}>
					<Grid item xs={12} sm={6}>
						<StyledCard>
							<StyledCardContent>
								<TitleTypography variant="h6">카테고리</TitleTypography>
								<ContentTypography>{CATEGORY_TO_KOR[data.category as keyof typeof CATEGORY_TO_KOR]}</ContentTypography>
							</StyledCardContent>
						</StyledCard>
					</Grid>
					<Grid item xs={12} sm={6}>
						<StyledCard>
							<StyledCardContent>
								<TitleTypography variant="h6">개발언어</TitleTypography>
								<ContentTypography>{data.language}</ContentTypography>
							</StyledCardContent>
						</StyledCard>
					</Grid>
				</Grid>

				<StyledCard>
					<StyledCardContent>
						<TitleTypography variant="h6">{data.state === PostStateType.pending ? '요청' : data.state === PostStateType.rejected ? '반려' : '승인'}시간</TitleTypography>
						<ContentTypography>{reformatTime(data.createdAt)}</ContentTypography>
					</StyledCardContent>
				</StyledCard>

				<StyledCard>
					<StyledCardContent>
						<TitleTypography variant="h6">판매가격</TitleTypography>
						<ContentTypography>{data.price} 💵</ContentTypography>
					</StyledCardContent>
				</StyledCard>

				<StyledCard>
					<StyledCardContent>
						<TitleTypography variant="h6">판매자 정보</TitleTypography>
						<ContentTypography>
							<strong>레포지토리 주소:</strong> <a href={data.githubRepoUrl} target="_blank" rel="noopener noreferrer">{data.githubRepoUrl}</a>
						</ContentTypography>
						<ContentTypography>
							<strong>깃허브 닉네임:</strong> <a href={`https://github.com/${data.sellerGithubName}`} target="_blank" rel="noopener noreferrer">{data.sellerGithubName}</a>
						</ContentTypography>
					</StyledCardContent>
				</StyledCard>

				{data.state === PostStateType.pending && (
					<Box sx={{ position: 'sticky', bottom: 20, zIndex: 2, mt: 4 }}>
						<Grid container spacing={2}>
							<Grid item xs={6}>
								<Button fullWidth variant="contained" sx={{height: 80, fontSize: 20}} color="primary" size="large" onClick={onOpenAcceptModal}>
									승인
								</Button>
							</Grid>
							<Grid item xs={6}>
								<Button fullWidth variant="contained" sx={{height: 80, fontSize: 20}} color="error" size="large" onClick={onOpenRejectModal}>
									반려
								</Button>
							</Grid>
						</Grid>
					</Box>
				)}
				<AcceptModal open={openAcceptModal} onClose={onCloseAcceptModal} />
				<RejectModal
					postId={data.id!.toString()}
					title={data.title}
					userToken={data.userToken}
					open={openRejectModal}
					onClose={onCloseRejectModal}
					refetch={() => navigate('/admin')}
				/>
			</Box>
		</AdminLayout>
	);
};

export default AdminCodeRequestInfo;