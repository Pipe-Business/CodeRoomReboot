import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import {useRecoilState} from "recoil";
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    CircularProgress,
    Divider,
    IconButton,
    Typography,
    Paper
} from '@mui/material';
import {ArrowBack, Delete, ShoppingBag, LocalOffer as PriceIcon} from '@mui/icons-material';
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import gravatar from "gravatar";
import {apiClient} from '../../api/ApiClient';
import {CATEGORY_TO_KOR, REACT_QUERY_KEY} from '../../constants/define';
import {useQueryUserLogin} from '../../hooks/fetcher/UserFetcher';
import useDialogState from '../../hooks/UseDialogState';
import useInput from "../../hooks/UseInput";
import MainLayout from '../../layout/MainLayout';
import {calcTimeDiff} from '../../utils/DayJsHelper';
import {CenterBox} from '../main/styles';
import {BlurContainer} from './styles';
import MessageModal from './components/MessageModal';
import PurchaseButton from "./components/Purchasebutton";
import CodeDownloadButton from "./components/CodeDownloadButton";
import {paymentDialogState} from "../payment/atom";
import LoginModal from "../../components/login/modal/LoginModal";
import QnASystem from "./components/QnASystemComp";
import PaymentDialog from "./components/PaymentDialog";
import {PurchaseReviewEntity} from '../../data/entity/PurchaseReviewEntity';
import {LikeRequestEntity} from "../../data/entity/LikeRequestEntity";
import {PurchaseSaleRes} from "../../data/entity/PurchaseSaleRes";
import {UsersCoinHistoryReq} from '../../data/entity/UsersCoinHistoryReq';
import {CoinHistoryType} from '../../enums/CoinHistoryType';
import DeleteModal from './components/DeleteModal';

dayjs.locale('ko');

const CodeInfo: FC = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {isLoadingUserLogin, userLogin} = useQueryUserLogin();
    const [reviews, setReviews] = useState<PurchaseReviewEntity[]>([]);
    const [isLike, setLike] = useState<boolean>(false);

    const {isLoading: isPostDataLoading, data: postData} = useQuery({
        queryKey: [REACT_QUERY_KEY.code, id],
        queryFn: () => apiClient.getTargetCode(Number(id!)),
    });
    const {isLoading: isUserDataLoading, data: postUserData} = useQuery({
        queryKey: [REACT_QUERY_KEY.user, postData?.userToken],
        queryFn: () => apiClient.getTargetUser(postData!.userToken),
    });
    const {isLoading: purchaseSaleLoading, data: purchaseSaleData} = useQuery({
        queryKey: [REACT_QUERY_KEY.purchaseSaleHistory, userLogin?.user_token, postData?.id],
        queryFn: () => apiClient.getMyPurchaseSaleHistoryByPostID(userLogin?.user_token!, postData!.id),
    });
    const {isLoading: isLikeLoading, data: likeData} = useQuery({
        queryKey: [REACT_QUERY_KEY.like],
        queryFn: () => apiClient.getLikeData(userLogin?.user_token!, postData!.id),
    });
    const {isLoading: isLikedNumberLoading, data: likedNumberData, refetch: likeNumberRefetch} = useQuery({
        queryKey: [REACT_QUERY_KEY.like, postData?.id],
        queryFn: () => apiClient.getTargetPostLikedNumber(postData!.id),
    });

    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const handleOpenDeleteModal = () => {
        setOpenDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
    };

    useEffect(() => {
        if (likeData != null) {
            setLike(true);
        }
    }, [likeData]);

    const [isOpenLoginDialog, onOpenLoginDialog, onCloseDialogDialog] = useDialogState();
    const [isPurchaseSection, setIsPurchaseSection] = useState<boolean>(false);
    const inputCashRef = useRef<HTMLInputElement | null>(null);
    const [inputCash, , setCash] = useInput<number>(0);
    const [inputCoin, , setCoin] = useInput<number>(0);
    const handlePurchaseBtn = () => {
        setIsPurchaseSection(true);
    }

    const [paymentRequiredAmount, setPaymentRequiredAmount] = useState<number>(postData?.price ?? 0);
    const onPaymentConfirm: () => void = PaymentDialog(userLogin!, postData!);
    const onClickPurchase = () => {
        const result = window.confirm(`결제하시겠습니까?: ${postData!.price}원`);
        if (result) {
            onPaymentConfirm();
        }
    }

    const [isBlur, setBlur] = useState<boolean>(false);
    const [openLoginModal, onOpenLoginModal, onCloseLoginModal] = useDialogState();
    const [paymentDialogOpen, setPaymentDialogOpen] = useRecoilState(paymentDialogState);

    const handleReviewSubmit = async () => {
        const purchaseData: PurchaseSaleRes | null = await apiClient.getMyPurchaseSaleHistoryByPostID(userLogin?.user_token!, postData!.id);
        const currentAmount = await apiClient.getUserTotalPoint(userLogin?.user_token!);

        let amountUpdateValue = Math.round((purchaseData?.sell_price! * 0.05) * 10);

        const pointHistoryRequest: UsersCoinHistoryReq = {
            description: "리뷰 작성 보상",
            amount: (currentAmount + amountUpdateValue),
            user_token: userLogin?.user_token!,
            coin: amountUpdateValue,
            coin_history_type: CoinHistoryType.earn_coin,
        }

        await apiClient.insertUserCoinHistory(pointHistoryRequest);
        await apiClient.updateTotalCoin(userLogin?.user_token!, (currentAmount + amountUpdateValue));

        setPaymentDialogOpen(false);
        navigate(0);
    };

    useEffect(() => {
        async function fetchReviews() {
            const reviews: PurchaseReviewEntity[] | null = await apiClient.getPurchaseReviews(Number(id));
            setReviews(reviews!);
        }

        if (id) {
            apiClient.updateViewCount(Number(id));
            fetchReviews();
        }
    }, [id]);

    useEffect(() => {
        if (!userLogin) {
            onOpenLoginModal();
        }
    }, [userLogin, onOpenLoginModal]);

    const onClickLike = async () => {
        if (isLike) {
            setLike(false);
            await apiClient.deleteLikeData(userLogin?.user_token!, postData!.id);
        } else {
            setLike(true);
            const likedData: LikeRequestEntity = {
                user_token: userLogin?.user_token!,
                post_id: postData!.id,
            }
            await apiClient.insertLikedData(likedData);
        }
        await likeNumberRefetch();
    }

    const onClickBackButton = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    if (isPostDataLoading || !postData || isUserDataLoading || purchaseSaleLoading || isLikeLoading || isLoadingUserLogin || isLikedNumberLoading) {
        return <MainLayout><CenterBox><CircularProgress/></CenterBox></MainLayout>;
    }

    if (!postUserData) {
        return <>no User Data</>;
    }

    return (
        <MainLayout>
            <Box sx={{display: 'flex', flexDirection: {xs: 'column', md: 'row'}, mt: 2, px: {xs: 2, md: 4}}}>
                <Card
                    elevation={2}
                    sx={{
                        width: {xs: '100%', md: '60%'},
                        borderRadius: 2,
                        overflow: 'hidden',
                        mb: {xs: 2, md: 0},
                    }}
                >
                    <CardHeader
                        avatar={
                            <IconButton onClick={onClickBackButton}>
                                <ArrowBack sx={{fontSize: '32px'}}/>
                            </IconButton>
                        }
                        title={
                            <Typography variant="h5" component="div" sx={{fontWeight: 'bold', color: '#333'}}>
                                {postData.title}
                            </Typography>
                        }
                    />
                    <BlurContainer isBlur={isBlur}>
                        <CardContent sx={{p: 3}}>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                {calcTimeDiff(postData.createdAt)}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                조회수: {postData.viewCount} / 구매수: {postData.buyerCount}
                            </Typography>
                            <Divider sx={{my: 2}}/>
                            <Box my={2}>
                                <Typography variant="h6" component="div" sx={{fontWeight: 'bold', mb: 1}}>
                                    카테고리
                                </Typography>
                                <Typography variant="body1" color="textPrimary">
                                    {CATEGORY_TO_KOR[postData.category as keyof typeof CATEGORY_TO_KOR]} / {postData.language}
                                </Typography>
                            </Box>
                            <Divider sx={{my: 2}}/>
                            <Box my={2}>
                                <Typography variant="h6" component="div" sx={{fontWeight: 'bold', mb: 1}}>
                                    코드 템플릿 상품 설명
                                </Typography>
                                <Typography variant="body1" sx={{whiteSpace: 'pre-line'}}>
                                    {postData.aiSummary}
                                </Typography>
                            </Box>
                            <Divider sx={{my: 2}}/>
                            <Box my={2}>
                                <Typography variant="h6" component="div" sx={{fontWeight: 'bold', mb: 1}}>
                                    코드 설명
                                </Typography>
                                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                    {postData.description!}
                                </ReactMarkdown>
                            </Box>
                            {userLogin?.user_token !== postData.userToken && <Divider sx={{my: 2}}/>}
                            {userLogin?.user_token !== postData.userToken &&
                                <Box my={3} sx={{textAlign: 'center'}}>
                                    <Typography variant="h6" component="div" sx={{fontWeight: 'bold', mb: 1}}>
                                        위시 리스트에 코드 담아두기
                                    </Typography>
                                    <IconButton onClick={onClickLike}>
                                        <ShoppingBag sx={{color: isLike ? 'orange' : 'grey', fontSize: '60px'}}/>
                                    </IconButton>
                                </Box>}
                            {!userLogin && (
                                <CenterBox>
                                    <LoginModal isOpen={openLoginModal} onClose={onCloseLoginModal}/>
                                </CenterBox>
                            )}
                            <Divider sx={{my: 2}}/>
                            <Box mt={4}>
                                <Typography variant="h6" component="div" sx={{fontWeight: 'bold', mb: 2}}>
                                    상품 Q&A
                                </Typography>
                                <QnASystem postId={postData.id}/>
                            </Box>
                        </CardContent>
                    </BlurContainer>
                </Card>
                <Box sx={{ml: {md: 3}, flex: {xs: '1 1 100%', md: '1 1 40%'}}}>
                    <BlurContainer isBlur={isBlur}>
                        <Box sx={{textAlign: 'center'}}>
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
                                <Avatar
                                    src={postUserData.profile_url ?? gravatar.url(postUserData?.email!, {
                                        s: '100',
                                        d: 'retro'
                                    })}
                                    alt={postUserData.nickname + "님의 프로필 이미지"}
                                    sx={{width: 120, height: 120, mb: 2, bgcolor: '#BDBDBD'}}
                                >
                                    C
                                </Avatar>
                                <Typography variant="h6" component="div" sx={{fontWeight: 'bold', mb: 1}}>
                                    판매자 [ {postUserData.nickname} ] 님의 코드 템플릿
                                </Typography>
                                <Typography variant="body1" color="textPrimary" sx={{mb: 2, textAlign: 'center'}}>
                                    {postUserData.about_me || '안녕하세요 많은 관심 부탁드립니다'}
                                </Typography>
                                <Divider sx={{width: '100%', my: 2}}/>
                                <Paper
                                    elevation={3}
                                    sx={{
                                        width: '100%',
                                        backgroundColor: '#f5f5f5',
                                        borderRadius: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, p: 2 }}>
                                        <PriceIcon sx={{ fontSize: 24, color: '#1976d2', mr: 1 }} />
                                        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', fontSize: '24px' }}>
                                            코드 판매가격
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={`${postData.price.toLocaleString()}원`}
                                        sx={{
                                            backgroundColor: 'black',
                                            color:'white',
                                            fontSize: '28px',
                                            py: 3,
                                            px: 2,
                                            fontWeight: 'bold',
                                            mb: 2,
                                        }}
                                    />

                                    {userLogin?.user_token === postData.userToken && (
                                        <Button
                                            onClick={handleOpenDeleteModal}
                                            startIcon={<Delete />}
                                            color="error"
                                            sx={{ mt: 3, fontSize: '14px' }}
                                        >
                                            코드 템플릿 삭제
                                        </Button>
                                    )}

                                    <DeleteModal
                                        open={openDeleteModal}
                                        onClose={handleCloseDeleteModal}
                                        codePost={postData}
                                    />

                                    <PurchaseButton
                                        postData={postData}
                                        purchasedSaleData={purchaseSaleData}
                                        handlePurchase={onClickPurchase}
                                    />

                                    {purchaseSaleData && (
                                        <CodeDownloadButton repoURL={postData.githubRepoUrl} />
                                    )}
                                    {postData.userToken !== userLogin?.user_token && (
                                        <Box mt={2}>
                                            <MessageModal targetUserToken={postData.userToken} />
                                        </Box>
                                    )}
                                </Paper>
                            </Card>
                        </Box>
                    </BlurContainer>
                </Box>
            </Box>
        </MainLayout>
    );
};

export default CodeInfo;