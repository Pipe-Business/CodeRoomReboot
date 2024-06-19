import {TabContext} from '@mui/lab';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {Box, Button, Card, CardHeader, Skeleton} from '@mui/material';
import Tab from '@mui/material/Tab';
import {useQuery} from "@tanstack/react-query";
import React, {FC, useEffect, useRef, useState} from 'react';
import {Link, useLocation, useNavigate, useSearchParams} from 'react-router-dom';
import {apiClient} from '../../api/ApiClient';
import UserProfileImage from '../../components/profile/UserProfileImage';
import {REACT_QUERY_KEY} from '../../constants/define';
import {useQueryUserLogin} from '../../hooks/fetcher/UserFetcher';
import FullLayout from '../../layout/FullLayout';
import MainLayout from '../../layout/MainLayout';
import {TextButton} from '../main/styles';
import BuyerContentData from './components/BuyerContentData';
import {SectionWrapper, StyledTab, StyledTabList} from './styles';
import SellerContentData from './components/SellerContentData';
import ReviewDialog from '../codeInfo/components/ReviewDialog';
import {PointHistoryRequestEntity} from '../../data/entity/PointHistoryRequestEntity';
import {PurchaseSaleRequestEntity} from '../../data/entity/PurchaseSaleRequestEntity';
import {PointHistoryType} from '../../enums/PointHistoryType';
import {PurchaseSaleResponseEntity} from "../../data/entity/PurchaseSaleResponseEntity";
import {PurchaseReviewEntity} from "../../data/entity/PurchaseReviewEntity";
import {CodeModel} from "../../data/model/CodeModel";

interface Props {
    children?: React.ReactNode;
}

const MyPage: FC<Props> = () => {
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [purchasePostId, setPurchasePostId] = useState(-1);
    const [readonly, setReadonly] = useState(false);
    const [reviewData, setReviewData] = useState<PurchaseReviewEntity | undefined>(undefined); // reviewData 상태 추가

    const {userLogin, isLoadingUserLogin} = useQueryUserLogin();
    const navigate = useNavigate();
    const location = useLocation();
    const [value, setValue] = React.useState('1');
    const tab = location.state?.tab;
    const [searchParams, setSearchParams] = useSearchParams();

    const {data: codeData, isLoading: isCodeDataLoading, refetch: refetchCodeData} = useQuery({
        queryKey: [REACT_QUERY_KEY.code, userLogin?.user_token!],
        queryFn: () => apiClient.getAllMyCode(userLogin?.user_token!),
    });


    const {data: purchaseData, isLoading: purchaseCodeDataLoading, refetch: refetchPurchaseData} = useQuery({
        queryKey: ['/purchase', userLogin?.user_token!],
        queryFn: () => apiClient.getMyPurchaseSaleHistory(userLogin!.user_token!),
    });

    const {data: saleData, isLoading: saleCodeDataLoading, refetch: refetchSaleData} = useQuery({
        queryKey: ['/sale', userLogin?.user_token!],
        queryFn: () => apiClient.getMySaleHistory(userLogin!.user_token!),
    });

    const {data: mentoringData, isLoading: mentoringDataLoading, refetch: refetchMentoringData} = useQuery({
        queryKey: [REACT_QUERY_KEY.mentoring, userLogin?.user_token!],
        queryFn: () => apiClient.getMyMentorings(userLogin!.user_token!),
    });
    const {data: cashConfirmData, isLoading: cashConfirmLoading, refetch: refetchCashConfirmData} = useQuery({
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

    const {data: cashPointHistory, isLoading: isCashPointHistoryLoading} = useQuery({
        queryKey: [REACT_QUERY_KEY.cashPointHistory, userLogin?.user_token!],
        queryFn: () => apiClient.getUserCashPointHistory(userLogin!.user_token!),
    });

    const {data: cashHistoryData, isLoading: cashHistoryLoading, refetch: refetchCashHistoryData} = useQuery({
        queryKey: [REACT_QUERY_KEY.cashHistory, userLogin?.user_token!],
        queryFn: () => apiClient.getUserCashHistory(userLogin!.user_token!),
    });

    const {data: pointHistoryData, isLoading: pointHistoryLoading, refetch: refetchPointHistoryData} = useQuery({
        queryKey: [REACT_QUERY_KEY.pointistory, userLogin?.user_token!],
        queryFn: () => apiClient.getUserPointHistory(userLogin!.user_token!),
    });

    useEffect(() => {
        setValue(searchParams.get('tab') ?? '1');
    }, []);

    const handleChange = (_: React.SyntheticEvent, newValue: string) => {
        searchParams.set('tab', newValue);
        setSearchParams(searchParams);
        setValue(newValue);
    };


    const handleWriteReviewClick = async(purchaseData: PurchaseSaleResponseEntity) => {
        console.log('Review click event received for:', purchaseData);
        const targetCode:CodeModel	= await apiClient.getTargetCode(purchaseData.post_id);
        if(targetCode.is_deleted){
            console.log("targetCode");
            window.alert('삭제된 게시글입니다.');
        }else{
            setPurchasePostId(purchaseData.post_id);
            setReadonly(false);
            setReviewData(undefined); // 리뷰 작성이므로 초기화
            setReviewDialogOpen(true);
        }
    };

    const handleReadReviewClick = async (purchaseData: PurchaseSaleResponseEntity) => {
        console.log('Review click event received for:', purchaseData);
        setPurchasePostId(purchaseData.post_id);
        setReadonly(true);
        try {
            const review = await apiClient.getReviewData(purchaseData.post_id);
            setReviewData(review); // 조회한 리뷰 데이터를 설정
        } catch (error) {
            console.error('Error fetching review data:', error);
        }

        setReviewDialogOpen(true);
    };

    const handleReviewSubmit = async () => {
        // 리뷰 작성 완료시 이 콜백을 수행
        const purchaseData: PurchaseSaleRequestEntity | null = await apiClient.getMyPurchaseSaleHistoryByPostID(userLogin?.user_token!, purchasePostId);
        const currentAmount = await apiClient.getUserTotalPoint(userLogin?.user_token!);
        let amountUpdateValue;
        // if (purchaseData?.pay_type == "point") {
        //     // 구매를 코인으로 했었다면 구매가의 5% -> 현재 디비 컬럼이 정수타입이라서 절대값으로 반올림
        //     amountUpdateValue = Math.round(purchaseData.price! * 0.05);
        // } else {
            // 구매를 캐시로 했었다면 구매가의 5% * 10 -> 현재 디비 컬럼이 정수타입이라서 절대값으로 반올림
            amountUpdateValue = Math.round((purchaseData?.price! * 0.05) * 10);
     //}

        const pointHistoryRequest: PointHistoryRequestEntity = {
            description: "리뷰 작성 보상",
            amount: (currentAmount + amountUpdateValue),
            user_token: userLogin?.user_token!,
            point: amountUpdateValue,
            point_history_type: PointHistoryType.earn_point,
        }

        await apiClient.insertUserPointHistory(pointHistoryRequest);
        await apiClient.updateTotalPoint(userLogin?.user_token!, (currentAmount + amountUpdateValue));  // total point update


        setReviewDialogOpen(false);
        navigate(0);
        await refetchPurchaseData();
        await refetchMentoringData();
        await refetchCashConfirmData();
        await refetchCashConfirmPendingData();
        await refetchCashHistoryData();
        await refetchPointHistoryData();
    };


    if (isCodeDataLoading || mentoringDataLoading || cashConfirmLoading || cashConfirmPendingLoading || cashHistoryLoading || pointHistoryLoading || saleCodeDataLoading) {
        return (
            <FullLayout>
                <Skeleton style={{height: '200px'}}/>
                <Skeleton style={{height: '500px'}}/>
                <Skeleton style={{height: '30px'}}/>
                <Skeleton style={{height: '200px'}}/>
            </FullLayout>
        );
    }

    if (!userLogin) {
        return <MainLayout>로그인 먼저 해주세요
            <Link to={'/'}>
                <Button>
                    홈으로 돌아가기
                </Button>
            </Link>
        </MainLayout>
    }

    return (
        <FullLayout>
            <Box height={64}/>

            <ReviewDialog postId={purchasePostId} open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)}
                          onReviewSubmit={handleReviewSubmit} readonly={readonly}
                          reviewData={reviewData}/> {/* 수정된 부분 */}

            {userLogin ?
                <div>
                    <Box height={8}/>
                    <SectionWrapper>
                        <div style={{display: 'flex', flexDirection: 'column'}}>

                            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                <h2>기본 정보</h2> <Box width={16}/> <TextButton onClick={() => {
                                navigate('/profile/my/edit', {state: {userData: userLogin}})
                            }} style={{color: '#448FCE', backgroundColor: '#F4F5F8'}}>수정하기</TextButton>
                            </div>
                            <Card raised elevation={0} style={{width: 'fit-content', maxWidth: '100%'}}>
                                <CardHeader
                                    avatar={<UserProfileImage size={60} userId={userLogin.user_token!}/>}
                                    title={userLogin?.nickname}
                                    titleTypographyProps={{
                                        fontSize: 25,
                                    }}
                                    subheader={userLogin.email}
                                    subheaderTypographyProps={{
                                        fontSize: 20,
                                    }}
                                />
                            </Card>
                            <h2>자기소개</h2>
                            <div>
                                {userLogin.about_me}
                            </div>
                        </div>
                    </SectionWrapper>
                    <Box height={32}/>
                    <SectionWrapper>
                        {tab}
                        <TabContext value={value}>
                            <Box sx={{ width: '100%'}}>
                                <StyledTabList onChange={handleChange} aria-label="lab API tabs example">
                                    <StyledTab label="나의 활동 내역" value="1" />
                                    <StyledTab label="판매 / 수익통계" value="2" />
                                </StyledTabList>
                            </Box>
                            <TabPanel value="1" sx={{ flex: 1 }}>
                                <BuyerContentData
                                    saleData={saleData!}
                                    purchaseData={purchaseData!}
                                    codeData={codeData!}
                                    cashPointHistoryData={cashPointHistory!}
                                    onWriteReviewClick={handleWriteReviewClick}
                                    onReadReviewClick={handleReadReviewClick}
                                />
                            </TabPanel>
                            <TabPanel value="2" sx={{ flex: 1 }}>
                                <SellerContentData
                                    cashConfirmData={cashConfirmData!}
                                    cashConfirmPendingData={cashConfirmPendingData!}
                                />
                            </TabPanel>
                        </TabContext>

                    </SectionWrapper>

                </div>
                :
                <></>
            }
            <Box height={128}/>
        </FullLayout>
    );
}
export default MyPage;
