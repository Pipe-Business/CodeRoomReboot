import {ArrowBack} from '@mui/icons-material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import {Box, Card, CardContent, CardHeader, CircularProgress, IconButton, Typography} from '@mui/material';
import {useQuery} from '@tanstack/react-query';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import React, {CSSProperties, FC, useCallback, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {apiClient} from '../../api/ApiClient';
import RequiredLoginModal from '../../components/login/modal/RequiredLoginModal';
import {CATEGORY_TO_KOR, REACT_QUERY_KEY} from '../../constants/define';
import {useQueryUserLogin} from '../../hooks/fetcher/UserFetcher';
import useDialogState from '../../hooks/UseDialogState';
import MainLayout from '../../layout/MainLayout';
import {calcTimeDiff} from '../../utils/DayJsHelper';
import {CenterBox} from '../main/styles';
import CodeInfoBuyItByCashButton from './components/CodeInfoBuyItByCashButton';
import CodeInfoBuyItByPointButton from './components/CodeInfoBuyItByPointButton';
import CashPaymentDialog from './components/CashPaymentDialog';
import PointPaymentDialog from './components/PointPaymentDialog';
import {BlurContainer, StyledSlider} from './styles';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import EditCodeButton from './components/EditCodeButton';
import MessageModal from './components/MessageModal';
import ReviewDialog from './components/ReviewDialog';
import {PurchaseReviewEntity} from '../../data/entity/PurchaseReviewEntity';
import ReviewList from './components/ReviewList';
import DeleteCodeButton from './components/DeleteCodeButton';
import {PointHistoryRequestEntity} from '../../data/entity/PointHistoryRequestEntity';
import {PurchaseSaleRequestEntity} from '../../data/entity/PurchaseSaleRequestEntity';
import {PointHistoryType} from '../../enums/PointHistoryType';
import {LikeRequestEntity} from "../../data/entity/LikeRequestEntity";

dayjs.locale('ko');

interface Props {
	children?: React.ReactNode;
}

function SampleNextArrow(props: { className?: string, style?: CSSProperties, onClick?: () => void }) {
	const { className, style, onClick } = props;
	return (
		<div
			className={className}
			style={{ ...style }}
			onClick={onClick}
		/>
	);
}

function SamplePrevArrow(props: { className?: string, style?: CSSProperties, onClick?: () => void }) {
	const { className, style, onClick } = props;
	return (
		<div
			className={className}
			style={{ ...style }}
			onClick={onClick}
		/>
	);
}

const CodeInfo: FC<Props> = () => {
	const [reviews, setReviews] = useState<PurchaseReviewEntity[]>([]);

	const { id } = useParams();

	const { isLoading: isCashDataLoading, data: cashData } = useQuery({
		queryKey: [REACT_QUERY_KEY.cash],
		queryFn: () => apiClient.getUserTotalCash(userLogin?.userToken!),
	});

	const { isLoading: isPointDataLoading, data: pointData } = useQuery({
		queryKey: [REACT_QUERY_KEY.point],
		queryFn: () => apiClient.getUserTotalPoint(userLogin?.userToken!),
	});


	const { isLoading, data: postData } = useQuery({
		queryKey: [REACT_QUERY_KEY.code, id],
		queryFn: () => apiClient.getTargetCode(Number(id!)),
	});

	const { isLoading: isUserDataLoading, data: postUserData } = useQuery({
		queryKey: [REACT_QUERY_KEY.user],
		queryFn: () => apiClient.getTargetUser(postData!.userToken),
	});

	const { isLoading: purchaseSaleLoading, data: purchaseSaleData } = useQuery({
		queryKey: [REACT_QUERY_KEY.purchaseSaleHistory],
		queryFn: () => apiClient.getMyPurchaseSaleHistoryByPostID(userLogin?.userToken!, postData!.id),
	});

	const { isLoading: isLikeLoading, data: likeData } = useQuery({
		queryKey: [REACT_QUERY_KEY.like],
		queryFn: () => apiClient.getLikeData(userLogin?.userToken!, postData!.id),
	});

	const { isLoading: isLikedNumberLoading, data: likedNumberData, refetch:likeNumberRefetch } = useQuery({
		queryKey: [REACT_QUERY_KEY.like, postData?.id],
		queryFn: () => apiClient.getTargetPostLikedNumber(postData!.id),
	});

	useEffect(() => {
		if (likeData != null) {
			//console.log("likedata" + { likeData });
			setLike(true);
		}
	}, [likeData]);

	const navigate = useNavigate();
	const { isLoadingUserLogin, userLogin } = useQueryUserLogin();
	const [isOpenLoginDialog, onOpenLoginDialog, onCloseDialogDialog] = useDialogState();
	const [isOpenPointDialog, onOpenPointDailog, onClosePointDialog] = useDialogState();
	const [isLike, setLike] = useState<boolean>(false);
	const [onCashClickConfirm] = CashPaymentDialog(() => {
		//console.log("현금 결제가 확인되었습니다!");
		// 현금 결제 확인 후 추가 로직
		setDialogOpen(true);
	});

	const [onPointClickConfirm] = PointPaymentDialog(() => {
		//console.log("포인트 결제가 확인되었습니다!");
		// 포인트 결제 확인 후 추가 로직
		setDialogOpen(true);
	});
	const [isBlur, setBlur] = useState<boolean>(false);
	const [openRequireLoginModal, onOpenRequireLoginModal, onCloseLoginModal] = useDialogState();
	const [dialogOpen, setDialogOpen] = useState(false);

	const handleReviewSubmit = async () =>  {	
		// 리뷰 작성 완료시 이 콜백을 수행	
		const purchaseData: PurchaseSaleRequestEntity|null = await apiClient.getMyPurchaseSaleHistoryByPostID(userLogin?.userToken!, postData!.id);
		const currentAmount = await apiClient.getUserTotalPoint(userLogin?.userToken!);
	
		let amountUpdateValue;
		if (purchaseData?.pay_type === "point") {
			// 구매를 포인트로 했었다면 구매가의 5% -> 현재 디비 컬럼이 정수타입이라서 절대값으로 반올림
			amountUpdateValue = Math.round(purchaseData.price! * 0.05);
		} else {
			// 구매를 캐시로 했었다면 구매가의 5% * 10 -> 현재 디비 컬럼이 정수타입이라서 절대값으로 반올림
			amountUpdateValue = Math.round((purchaseData?.price! * 0.05) * 10);
		}
		 
		const pointHistoryRequest : PointHistoryRequestEntity = {			
			description: "리뷰 작성 보상",
			amount: (currentAmount + amountUpdateValue),
			user_token: userLogin?.userToken!,
			point: amountUpdateValue,
			point_history_type: PointHistoryType.earn_point,
		}
	
		await apiClient.insertUserPointHistory(pointHistoryRequest);
	
		setDialogOpen(false);
		navigate(0);
	};

	useEffect(() => {
		async function fetchReviews() {
			const reviews: PurchaseReviewEntity[]|null = await apiClient.getPurchaseReviews(Number(id));
			setReviews(reviews!);
		}
		if (id) {
			apiClient.updateViewCount(Number(id));
			fetchReviews();
			//console.log(`reviews is ${reviews}`);
		}
	}, []);

	useEffect(() => {
		if (!userLogin) { // 로그인 확인 필요
			setBlur(true);
			onOpenRequireLoginModal();
		} else {
			setBlur(false);
		}
	}, [userLogin]);



	const onClickLike = async () => {
		if (isLike) {
			setLike(false);
			await apiClient.deleteLikeData(userLogin?.userToken!, postData!.id);
		} else {
			setLike(true);
			const likedData: LikeRequestEntity = {
				user_token: userLogin?.userToken!,
				post_id: postData!.id,
			}
			await apiClient.insertLikedData(likedData);
		}
		await likeNumberRefetch();
	}

	const onClickBuyItButton = useCallback(() => {
		if (!userLogin?.id) {
			onOpenLoginDialog();
			return;
		}
	}, [userLogin?.id]);

	const onClickBackButton = useCallback(() => {
		navigate(-1);
	}, []);



	if (isLoading || !postData || isUserDataLoading || purchaseSaleLoading || isLikeLoading || isPointDataLoading || isLoadingUserLogin || isLikedNumberLoading) {
		return <MainLayout><CenterBox><CircularProgress /></CenterBox></MainLayout>;
	}

	if (!postUserData) {
		return <>no User Data</>;
	}

	return (
		<MainLayout>
			<Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, mt: 2, px: { xs: 2, md: 4 } }}>
				<Card
					elevation={2}
					sx={{
						width: { xs: '100%', md: '60%' },
						borderRadius: 2,
						overflow: 'hidden',
						mb: { xs: 2, md: 0 },
					}}
				>
					<CardHeader
						avatar={
							<IconButton onClick={onClickBackButton}>
								<ArrowBack sx={{ fontSize: '32px' }} />
							</IconButton>
						}
						title={
							<Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: '#333' }}>
								{postData.title}
							</Typography>
						}
					/>
					<BlurContainer isBlur={isBlur}>
						<CardContent sx={{ p: 3 }}>
							<Typography variant="body2" color="textSecondary" gutterBottom>
								{calcTimeDiff(postData.createdAt)}
							</Typography>
							<Typography variant="body2" color="textSecondary" gutterBottom>
								조회수: {postData.viewCount}
							</Typography>
							<Box my={2}>
								<Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
									카테고리
								</Typography>
								<Typography variant="body1" color="textPrimary">
									{postData.postType} / {CATEGORY_TO_KOR[postData.category as keyof typeof CATEGORY_TO_KOR]} / {postData.language}
								</Typography>
							</Box>
							{postData.images && (
								<Box mb={3}>
									<Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
										템플릿 결과물 이미지
									</Typography>
									<StyledSlider
										nextArrow={<SampleNextArrow />}
										prevArrow={<SamplePrevArrow />}
										dots={true}
										arrows={false}
										slidesToShow={1}
										slidesToScroll={1}
										speed={500}
										infinite={false}
									>
										{postData.images.map((url, key) => (
											<img
												alt={`image-${key}`}
												key={key}
												style={{ objectFit: 'contain', maxHeight: 400, width: '100%' }}
												src={url}
											/>
										))}
									</StyledSlider>
								</Box>
							)}
							<Box my={2}>
								<Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
									코드 설명
								</Typography>
								<Typography variant="body1" color="textPrimary">
									{postData.description}
								</Typography>
							</Box>
							<Box my={2}>
								<Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
									구매자 가이드
								</Typography>
								<Typography variant="body2" color="textSecondary">
									판매자가 코드를 작성했을때 당시 환경(버전,에디터 등)정보입니다.
								</Typography>
								<Typography variant="body1" color="textPrimary" sx={{ mt: 1 }}>
									{postData.buyerGuide}
								</Typography>
							</Box>
							<Box my={3} sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
								<CodeInfoBuyItByCashButton
									isBlur={isBlur}
									point={postData.price}
									codeHostId={postData.userToken}
									userId={userLogin?.userToken!}
									userHavePoint={cashData ?? 0}
									githubRepoUrl={postData.adminGitRepoURL}
									purchasedSaleData={purchaseSaleData}
									onClickBuyItButton={onClickBuyItButton}
									onPaymentConfirm={onCashClickConfirm}
									onClickLoginRegister={onOpenLoginDialog}
									onOpenPointDialog={onOpenPointDailog}
								/>
								<CodeInfoBuyItByPointButton
									isBlur={isBlur}
									point={postData.price * 5}
									codeHostId={postData.userToken}
									userId={userLogin?.userToken!}
									userHavePoint={pointData ?? 0}
									githubRepoUrl={postData.adminGitRepoURL}
									purchasedSaleData={purchaseSaleData}
									onClickBuyItButton={onClickBuyItButton}
									onPaymentConfirm={onPointClickConfirm}
									onClickLoginRegister={onOpenLoginDialog}
									onOpenPointDialog={onOpenPointDailog}
								/>
							</Box>
							<Box my={3} sx={{ textAlign: 'center' }}>
								<Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
									이 코드 템플릿이 좋아요
								</Typography>
								<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
									<Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: '#3179f8' }}>
										{likedNumberData!.toString()}
									</Typography>
									<IconButton onClick={onClickLike}>
										<ThumbUpIcon sx={{ color: isLike ? '#3179f8' : 'grey', fontSize: '40px' }} />
									</IconButton>
								</Box>
							</Box>
							{!userLogin && (
								<CenterBox>
									<RequiredLoginModal isOpen={openRequireLoginModal} onClose={onCloseLoginModal} />
								</CenterBox>
							)}
							{reviews && <ReviewList reviews={reviews} />}
						</CardContent>
					</BlurContainer>
				</Card>
				<Box sx={{ ml: { md: 3 }, flex: { xs: '1 1 100%', md: '1 1 40%' } }}>
					<BlurContainer isBlur={isBlur}>
						<Box sx={{ textAlign: 'center' }}>
							<Card
								elevation={2}
								sx={{
									width: '100%',
									borderRadius: 2,
									p: 3,
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									mb: 2,
								}}
							>
								<Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
									코드 템플릿 판매자
								</Typography>
								<Typography variant="body1" color="textPrimary" sx={{ mb: 2 }}>
									{postUserData.nickname}
								</Typography>
								<Typography variant="body1" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
									이 템플릿은 {postData.buyerCount * postData.price}의 인기도를 가지고 있습니다 🔥
								</Typography>
								<Box my={1}>
									{userLogin?.userToken === postData.userToken && <EditCodeButton codePost={postData} />}
								</Box>
								<Box my={1}>
									{userLogin?.userToken === postData.userToken && <DeleteCodeButton codePost={postData} />}
								</Box>
								<CodeInfoBuyItByCashButton
									isBlur={isBlur}
									point={postData.price}
									codeHostId={postData.userToken}
									userId={userLogin?.userToken!}
									userHavePoint={cashData ?? 0}
									githubRepoUrl={postData.githubRepoUrl}
									purchasedSaleData={purchaseSaleData}
									onClickBuyItButton={onClickBuyItButton}
									onPaymentConfirm={onCashClickConfirm}
									onClickLoginRegister={onOpenLoginDialog}
									onOpenPointDialog={onOpenPointDailog}
								/>
								<Box my={1} />
								<CodeInfoBuyItByPointButton
									isBlur={isBlur}
									point={postData.price * 5}
									codeHostId={postData.userToken}
									userId={userLogin?.userToken!}
									userHavePoint={pointData ?? 0}
									githubRepoUrl={postData.githubRepoUrl}
									purchasedSaleData={purchaseSaleData}
									onClickBuyItButton={onClickBuyItButton}
									onPaymentConfirm={onPointClickConfirm}
									onClickLoginRegister={onOpenLoginDialog}
									onOpenPointDialog={onOpenPointDailog}
								/>
								<Box my={2}>
									{
										(postData.userToken !== userLogin!.userToken) &&
										<MessageModal targetUserToken={postData.userToken}/>
									}
								</Box>
							</Card>
						</Box>
					</BlurContainer>
				</Box>
			</Box>
			<ReviewDialog postId={postData.id} open={dialogOpen} onClose={() => setDialogOpen(false)} onReviewSubmit={handleReviewSubmit} />
		</MainLayout>
	);
};

export default CodeInfo;
