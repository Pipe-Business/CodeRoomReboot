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
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    IconButton,
    Paper,
    Typography, useTheme
} from '@mui/material';
import {ArrowBack, LocalOffer as PriceIcon, ShoppingBag, Edit as EditIcon, Refresh as RefreshIcon} from '@mui/icons-material';
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
import {CodeEditRequestEntity} from "../../data/entity/CodeEditRequestEntity";
import {PostStateType} from "../../enums/PostStateType";
import {codeInfo} from "../createCode/createCodeAtom";

dayjs.locale('ko');

const CodeInfo: FC = () => {
    const theme = useTheme();
    const {id} = useParams();
    const navigate = useNavigate();
    const {isLoadingUserLogin, userLogin} = useQueryUserLogin();
    const [reviews, setReviews] = useState<PurchaseReviewEntity[]>([]);
    const [isLike, setLike] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [codeModel, setCodeInfo] = useRecoilState(codeInfo);


    const onClickNavigateModifyForm = useCallback(() => {
        setCodeInfo(postData!);
        navigate('/create/code/codesubmission', {state: {isEdit: true}});
    }, [navigate, setCodeInfo]);

    const handleOpenDialog = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenDialog(true);
    }, []);

    const handleCloseDialog = useCallback(() => {
        setOpenDialog(false);
    }, []);

    const handleConfirmCodeUpdate = useCallback(async () => {
        console.log("코드 갱신 요청 처리");

        try {
            const codeEditRequest: CodeEditRequestEntity = {
                post_id: postData!.id,
                title: postData?.title!,
                category: postData?.category!,
                price: postData?.price!,
                language: postData?.language!,
                ai_summary: postData?.aiSummary!,
                description: postData?.description!,
                state: PostStateType.pending,
            };
            await apiClient.updatePostData(codeEditRequest);

            // API 호출이 성공적으로 완료된 후 페이지를 새로고침합니다.
            window.location.reload();
        } catch (error) {
            console.log(error);
            // 에러가 발생한 경우에도 다이얼로그를 닫습니다.
            handleCloseDialog();
        }
    }, [handleCloseDialog]);

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
        const result = window.confirm(`결제하시겠습니까?: ${postData!.price.toLocaleString()}원`);
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
                                    elevation={0}
                                    sx={{
                                        width: '100%',
                                        backgroundColor: 'transparent',
                                        borderRadius: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        width: '100%',
                                        mb: 3
                                    }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                            코드 판매 가격
                                        </Typography>
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                fontWeight: 'bold',
                                                color: theme.palette.primary.main
                                            }}
                                        >
                                            {postData.price.toLocaleString()}원
                                        </Typography>
                                    </Box>

                                    {userLogin?.user_token === postData.userToken && (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3, width: '100%' }}>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={onClickNavigateModifyForm}
                                                startIcon={<EditIcon />}
                                                sx={{ borderRadius: '20px', flex: 1 }}
                                            >
                                                수정
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                onClick={handleOpenDialog}
                                                startIcon={<RefreshIcon />}
                                                sx={{ borderRadius: '20px', flex: 1 }}
                                            >
                                                갱신
                                            </Button>
                                        </Box>
                                    )}

                                    <PurchaseButton
                                        postData={postData}
                                        purchasedSaleData={purchaseSaleData}
                                        handlePurchase={onClickPurchase}
                                    />

                                    {purchaseSaleData && (
                                        <Box mt={2} width="100%">
                                            <CodeDownloadButton repoURL={postData.githubRepoUrl} />
                                        </Box>
                                    )}

                                    {postData.userToken !== userLogin?.user_token && (
                                        <Box mt={2} width="100%">
                                            <MessageModal targetUserToken={postData.userToken} />
                                        </Box>
                                    )}
                                </Paper>
                            </Card>
                        </Box>
                    </BlurContainer>
                </Box>
            </Box>


            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"코드 갱신 요청"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        코드 갱신 요청을 진행하시겠습니까?
                    </DialogContentText>
                    <DialogContentText id="alert-dialog-description">
                        (요청 시 심사중 상태로 변경됩니다)
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>아니오</Button>
                    <Button onClick={handleConfirmCodeUpdate} autoFocus>
                        예
                    </Button>
                </DialogActions>
            </Dialog>
        </MainLayout>
    );
};

export default CodeInfo;