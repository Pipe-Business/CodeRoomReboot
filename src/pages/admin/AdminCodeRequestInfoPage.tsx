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
	Divider,
	Paper
} from '@mui/material';
import { ArrowBack, Code as CodeIcon, CheckCircle as CheckCircleIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

import AdminLayout from '../../layout/AdminLayout';
import useDialogState from '../../hooks/UseDialogState';
import ReviewResultModal from '../../components/review/modal/ReviewResultModal';
import { reformatTime } from "../../utils/DayJsHelper";
import { useQueryUserById } from "../../hooks/fetcher/UserFetcher";
import { CATEGORY_TO_KOR } from "../../constants/define";
import { apiClient } from "../../api/ApiClient";
import { PostStateType } from "../../enums/PostStateType";
import ReadMeHtml from "../codeInfo/components/ReadMeHtml";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

const StyledCard = styled(Card)(({ theme }) => ({
	marginBottom: theme.spacing(3),
	borderRadius: theme.shape.borderRadius * 2,
	boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
	'&:last-child': {
		paddingBottom: theme.spacing(2),
	},
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
	fontWeight: 'bold',
	marginBottom: theme.spacing(1),
	color: theme.palette.primary.main,
}));

const ContentTypography = styled(Typography)(({ theme }) => ({
	marginBottom: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
	borderRadius: theme.shape.borderRadius * 2,
	textTransform: 'none',
	fontWeight: 'bold',
	padding: theme.spacing(1.5, 3),
	boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
	transition: 'all 0.3s ease',
	'&:hover': {
		transform: 'translateY(-2px)',
		boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
	},
}));

const StyledChip = styled(Chip)(({ theme }) => ({
	borderRadius: theme.shape.borderRadius * 2,
	fontWeight: 'bold',
	fontSize: '1rem',
	padding: theme.spacing(2, 3),
}));

const StatusContainer = styled(Box)(({theme}) => ({
	display: 'inline-flex',
	alignItems: 'center',
	padding: theme.spacing(0.5, 1.5),
	borderRadius: theme.shape.borderRadius,
	fontWeight: 500,
}));

const StatusDot = styled('span')(({theme}) => ({
	width: 8,
	height: 8,
	borderRadius: '50%',
	marginRight: theme.spacing(1),
}));

const StyledMarkdown = styled(ReactMarkdown)(({ theme }) => ({
	'& pre': {
		backgroundColor: theme.palette.grey[100],
		padding: theme.spacing(2),
		borderRadius: theme.shape.borderRadius,
		overflow: 'auto',
	},
	'& code': {
		fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
	},
	'& p': {
		marginBottom: theme.spacing(2),
	},
	'& h1, & h2, & h3, & h4, & h5, & h6': {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(1),
	},
}));

interface PostStatusProps {
	state: PostStateType;
}

const getStatusColor = (state: PostStateType) => {
	switch (state) {
		case PostStateType.pending:
			return {
				bg: 'rgba(255, 193, 7, 0.1)',
				text: '#F9A825',
				dot: '#F9A825'
			};
		case PostStateType.rejected:
			return {
				bg: 'rgba(244, 67, 54, 0.1)',
				text: '#D32F2F',
				dot: '#D32F2F'
			};
		default:
			return {
				bg: 'rgba(76, 175, 80, 0.1)',
				text: '#388E3C',
				dot: '#388E3C'
			};
	}
};

const getStatusText = (state: PostStateType) => {
	switch (state) {
		case PostStateType.pending:
			return '검토 중';
		case PostStateType.rejected:
			return '반려됨';
		default:
			return '승인됨';
	}
};

export const PostStatus: React.FC<PostStatusProps> = ({state}) => {
	const colors = getStatusColor(state);

	return (
		<StatusContainer style={{backgroundColor: colors.bg}}>
			<StatusDot style={{backgroundColor: colors.dot}}/>
			<Typography variant="body2" style={{color: colors.text}}>
				{getStatusText(state)}
			</Typography>
		</StatusContainer>
	);
};

const stringToPostStateType = (state: string): PostStateType => {
	switch (state.toLowerCase()) {
		case 'pending':
			return PostStateType.pending;
		case 'rejected':
			return PostStateType.rejected;
		case 'approved':
			return PostStateType.approve;
		case 'deleted':
			return PostStateType.deleted;
		default:
			console.warn(`Unknown state: ${state}. Defaulting to pending.`);
			return PostStateType.pending;
	}
};

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
	const [shouldRefetch, setShouldRefetch] = React.useState(false);

	const { isLoading, data, refetch } = useQuery({
		queryKey: ['codeRequest', codeId],
		queryFn: () => apiClient.getTargetCode(Number(codeId)),
	});

	const { userById } = useQueryUserById(userId!);
	const [openReviewModal, onOpenReviewModal, onCloseReviewModal] = useDialogState();
	const [isApproval, setIsApproval] = React.useState(false);


	const handleReviewComplete = React.useCallback(() => {
		setShouldRefetch(true);
	}, []);

	React.useEffect(() => {
		if (shouldRefetch) {
			refetch();
			setShouldRefetch(false);
		}
	}, [shouldRefetch, refetch]);



	const handleSmartAnalysis = () => {
		navigate(`/admin/codeRequest/${userId}/${codeId}/smart-analysis/`, {
			state: {
				githubRepoUrl: extractRepoName(data?.githubRepoUrl as string),
				sellerGithubName: data?.sellerGithubName
			}
		});
	};

	const handleOpenReviewModal = (approval: boolean) => {
		setIsApproval(approval);
		onOpenReviewModal();
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
					<Typography variant="h5" fontWeight="bold">{userById?.nickname} 님의 {data?.title}</Typography>
				</Box>

				<Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
					<PostStatus state={stringToPostStateType(data?.state)} />
					<StyledButton
						variant="contained"
						color="info"
						startIcon={<CodeIcon />}
						onClick={handleSmartAnalysis}
						sx={{ ml: 2 }}
					>
						스마트 코드 분석
					</StyledButton>
				</Box>

				{data.state === PostStateType.rejected && (
					<StyledCard>
						<StyledCardContent>
							<TitleTypography variant="h6">반려사유</TitleTypography>
							<ContentTypography>{'todo'}</ContentTypography>
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
							<StyledMarkdown
								rehypePlugins={[rehypeHighlight]}
							>
								{data.description}
							</StyledMarkdown>
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
						<ContentTypography>{data.price.toLocaleString()} 원</ContentTypography>
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

				{data?.state === PostStateType.pending && (
					<Paper elevation={3} sx={{ position: 'sticky', bottom: 20, zIndex: 2, mt: 4, borderRadius: 4, overflow: 'hidden', padding: 2 }}>
						<Grid container spacing={2}>
							<Grid item xs={6}>
								<StyledButton
									fullWidth
									variant="contained"
									color="success"
									startIcon={<CheckCircleIcon />}
									sx={{ height: 60, fontSize: 18 }}
									onClick={() => handleOpenReviewModal(true)}
								>
									승인
								</StyledButton>
							</Grid>
							<Grid item xs={6}>
								<StyledButton
									fullWidth
									variant="contained"
									color="error"
									startIcon={<CancelIcon />}
									sx={{ height: 60, fontSize: 18 }}
									onClick={() => handleOpenReviewModal(false)}
								>
									반려
								</StyledButton>
							</Grid>
						</Grid>
					</Paper>
				)}
				<ReviewResultModal
					postId={data?.id!.toString()}
					title={data?.title}
					userToken={data?.userToken}
					open={openReviewModal}
					onClose={onCloseReviewModal}
					refetch={refetch}
					isApproval={isApproval}
					onReviewComplete={handleReviewComplete}
				/>
			</Box>
		</AdminLayout>
	);
};

export default AdminCodeRequestInfo;