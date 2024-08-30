import React, { FC, useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Typography, Avatar, Tabs, Tab, Container, Grid } from '@mui/material';
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { apiClient } from '../../api/ApiClient';
import { REACT_QUERY_KEY } from '../../constants/define';
import { useQueryUserLogin } from '../../hooks/fetcher/UserFetcher';
import FullLayout from '../../layout/FullLayout';
import MainLayout from '../../layout/MainLayout';
import ReviewDialog from '../codeInfo/components/ReviewDialog';
import { UsersCoinHistoryReq } from '../../data/entity/UsersCoinHistoryReq';
import { CoinHistoryType } from '../../enums/CoinHistoryType';
import { PurchaseSaleRes } from "../../data/entity/PurchaseSaleRes";
import { PurchaseReviewEntity } from "../../data/entity/PurchaseReviewEntity";
import { CodeModel } from "../../data/model/CodeModel";
import MyFavoriteTabPage from "./components/favorite/favoriteTabPage";
import MyPurchasedTabPage from "./components/purchased/MyPurchasedTabPage";
import SellReviewTabPage from "./components/sale/SellReviewTabPage";
import CoinHistoryTabPage from "./components/coinHistory/CoinHistoryTabPage";
import ProfitTabPage from "./components/profit/ProfitTabPage";
import QnATabPage from "./components/qnaTabPage/QnATabPage";
import UserProfileImage from "../../components/profile/UserProfileImage";

const MyPage: FC = () => {
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [purchasePostId, setPurchasePostId] = useState(-1);
    const [readonly, setReadonly] = useState(false);
    const [reviewData, setReviewData] = useState<PurchaseReviewEntity | undefined>(undefined);

    const { userLogin, isLoadingUserLogin } = useQueryUserLogin();
    const navigate = useNavigate();
    const location = useLocation();
    const [value, setValue] = React.useState('1');
    const [searchParams, setSearchParams] = useSearchParams();

    const { data: cashConfirmData, isLoading: cashConfirmLoading, refetch: refetchCashConfirmData } = useQuery({
        queryKey: [REACT_QUERY_KEY.cashConfirm, userLogin?.user_token!],
        queryFn: () => apiClient.getMySaleConfirmedHistory(userLogin!.user_token!, true),
    });

    const {
        data: cashConfirmPendingData,
        isLoading: cashConfirmPendingLoading,
        refetch: refetchCashConfirmPendingData
    } = useQuery({
        queryKey: [REACT_QUERY_KEY.cashConfirmPending, userLogin?.user_token!],
        queryFn: () => apiClient.getMySaleConfirmedHistory(userLogin!.user_token!, false),
    });

    useEffect(() => {
        setValue(searchParams.get('tab') ?? '1');
    }, [searchParams]);

    const handleChange = (_: React.SyntheticEvent, newValue: string) => {
        searchParams.set('tab', newValue);
        setSearchParams(searchParams);
        setValue(newValue);
    };

    const handleWriteReviewClick = async(purchaseData: PurchaseSaleRes) => {
        console.log('Review click event received for:', purchaseData);
        const targetCode: CodeModel = await apiClient.getTargetCode(purchaseData.post_id);
        if(targetCode.isDeleted){
            console.log("targetCode");
            window.alert('삭제된 게시글입니다.');
        } else {
            setPurchasePostId(purchaseData.post_id);
            setReadonly(false);
            setReviewData(undefined);
            setReviewDialogOpen(true);
        }
    };

    const handleReadReviewClick = async (purchaseData: PurchaseSaleRes) => {
        console.log('Review click event received for:', purchaseData);
        setPurchasePostId(purchaseData.post_id);
        setReadonly(true);
        try {
            const review = await apiClient.getReviewData(purchaseData.post_id);
            setReviewData(review);
        } catch (error) {
            console.error('Error fetching review data:', error);
        }
        setReviewDialogOpen(true);
    };

    const handleReviewSubmit = async () => {
        const purchaseData: PurchaseSaleRes | null = await apiClient.getMyPurchaseSaleHistoryByPostID(userLogin?.user_token!, purchasePostId);
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

        setReviewDialogOpen(false);
        navigate(0);
        await refetchCashConfirmData();
        await refetchCashConfirmPendingData();
    };

    if (cashConfirmLoading || cashConfirmPendingLoading) {
        return (
            <FullLayout>
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <Typography variant="h5">로딩 중...</Typography>
                </Box>
            </FullLayout>
        );
    }

    if (!userLogin) {
        return (
            <MainLayout>
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
                    <Typography variant="h5" gutterBottom>로그인 먼저 해주세요</Typography>
                    <Button variant="contained" color="primary" component={Link} to="/">
                        홈으로 돌아가기
                    </Button>
                </Box>
            </MainLayout>
        );
    }

    return (
        <FullLayout>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Grid container spacing={2} sx={{ minHeight: 'calc(100vh - 128px)' }}>
                    <Grid item xs={12} md={3}> {/* 좌측 탭 너비 축소 */}
                        <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
                                <Box mb={3} display="flex" flexDirection="column" alignItems="center" width="100%">
                                    <UserProfileImage
                                        size={100} // 크기를 약간 줄임
                                        userId={userLogin.user_token ?? ''}
                                    />
                                    <Typography variant="h6" align="center" sx={{ width: '100%', mt: 2 }}> {/* h5 -> h6 */}
                                        {userLogin.nickname}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" align="center" sx={{ width: '100%', mb: 2 }}>
                                        {userLogin.email}
                                    </Typography>
                                </Box>
                                <Typography variant="subtitle1" gutterBottom align="center" sx={{ width: '100%' }}> {/* h6 -> subtitle1 */}
                                    자기소개
                                </Typography>
                                {userLogin.about_me && userLogin.about_me.trim() !== '' ? (
                                    <Typography variant="body2" paragraph sx={{ mb: 3, textAlign: 'center', width: '100%' }}> {/* body1 -> body2 */}
                                        {userLogin.about_me}
                                    </Typography>
                                ) : (
                                    <Typography variant="body2" color="textSecondary" paragraph sx={{ mb: 3, textAlign: 'center', width: '100%' }}>
                                        자기소개를 작성해주세요.
                                    </Typography>
                                )}
                                <Box mt={2} width="100%">
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        fullWidth
                                        size="small" // 버튼 크기 축소
                                        onClick={() => navigate('/profile/my/edit', { state: { userData: userLogin } })}
                                    >
                                        프로필 수정
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={9}> {/* 우측 탭 너비 확장 */}
                        <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                <Tabs
                                    value={value}
                                    onChange={handleChange}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    variant="scrollable" // fullWidth에서 scrollable로 변경
                                    scrollButtons="auto"
                                    sx={{
                                        mb: 2,
                                        '& .MuiTabs-flexContainer': {
                                            display: 'flex',
                                            width: '100%',
                                        },
                                    }}
                                >
                                    <Tab label="관심 목록" value="1" sx={{ flex: 1, minWidth: 0 }} />
                                    <Tab label="구매 목록" value="2" sx={{ flex: 1, minWidth: 0 }} />
                                    <Tab label="판매 목록" value="3" sx={{ flex: 1, minWidth: 0 }} />
                                    <Tab label="파이프 코인" value="4" sx={{ flex: 1, minWidth: 0 }} />
                                    <Tab label="수익 목록" value="5" sx={{ flex: 1, minWidth: 0 }} />
                                    <Tab label="Q&A" value="6" sx={{ flex: 1, minWidth: 0 }} />
                                </Tabs>
                                <Box sx={{ flexGrow: 1, overflowY: 'auto', minHeight: '500px' }}>
                                    {value === '1' && <MyFavoriteTabPage />}
                                    {value === '2' && <MyPurchasedTabPage />}
                                    {value === '3' && <SellReviewTabPage />}
                                    {value === '4' && <CoinHistoryTabPage />}
                                    {value === '5' && <ProfitTabPage />}
                                    {value === '6' && <QnATabPage />}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <ReviewDialog
                postId={purchasePostId}
                open={reviewDialogOpen}
                onClose={() => setReviewDialogOpen(false)}
                onReviewSubmit={handleReviewSubmit}
                readonly={readonly}
                reviewData={reviewData}
            />
        </FullLayout>
    );
}

export default MyPage;