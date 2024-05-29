import { TabContext } from '@mui/lab';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, Button, Card, CardHeader, Skeleton } from '@mui/material';
import Tab from '@mui/material/Tab';
import { useQuery } from "@tanstack/react-query";
import React, { FC, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { apiClient } from '../../api/ApiClient';
import UserProfileImage from '../../components/profile/UserProfileImage';
import { REACT_QUERY_KEY } from '../../constants/define';
import { useQueryUserLogin } from '../../hooks/fetcher/UserFetcher';
import FullLayout from '../../layout/FullLayout';
import MainLayout from '../../layout/MainLayout';
import { TextButton } from '../main/styles';
import BuyerContentData from './components/buyerContentData';
import { SectionWrapper } from './styles';
import SellerContentData from './components/sellerContentData';

interface Props {
	children?: React.ReactNode;
}


const MyPage: FC<Props> = () => {

	const { userLogin, isLoadingUserLogin } = useQueryUserLogin();
	const navigate = useNavigate();
	const location = useLocation();
	const [value, setValue] = React.useState('1');
	const tab = location.state?.tab;
	const [searchParams, setSearchParams] = useSearchParams();
	const inputNickNameRef = useRef<HTMLInputElement | null>(null);
	const { data: userData, isLoading: userDataLoading } = useQuery({ queryKey: ['users', userLogin?.id], queryFn: () => apiClient.getTargetUser(userLogin!.userToken!) })
	const { data: approvedCodeData } = useQuery({
		queryKey: [REACT_QUERY_KEY.approvedCode, userLogin?.userToken!, 'state'],
		queryFn: () => apiClient.getMyCodeByStatus(userLogin!.userToken!, 'approve')
	});
	const { data: pendingCodeData, isLoading: pendingCodeDataLoading } = useQuery({
		queryKey: [REACT_QUERY_KEY.pendingCode, userLogin?.userToken!],
		queryFn: () => apiClient.getMyCodeByStatus(userLogin!.userToken!, 'pending')
	});
	const { data: rejectedCodeData, isLoading: rejectedCodeDataLoading } = useQuery({
		queryKey: [REACT_QUERY_KEY.rejectedCode, userLogin?.userToken!],
		queryFn: () => apiClient.getMyCodeByStatus(userLogin!.userToken!, 'rejected')
	});

	const { data: purchaseData, isLoading: purchaseCodeDataLoading } = useQuery({
		queryKey: [REACT_QUERY_KEY.user, userLogin?.userToken!],
		queryFn: () => apiClient.getMyPurchaseSaleHistory(userLogin!.userToken!),
	});

	const { data: mentoringData, isLoading: mentoringDataLoading } = useQuery({
		queryKey: [REACT_QUERY_KEY.mentoring, userLogin?.userToken!],
		queryFn: () => apiClient.getMyMentorings(userLogin!.userToken!),
	});
	const { data: cashConfirmData, isLoading: cashConfirmLoading} = useQuery({
		queryKey: [REACT_QUERY_KEY.cashConfirm, userLogin?.userToken!],
		queryFn: () => apiClient.getMySaleConfirmedHistory(userLogin!.userToken!,true),
	});
	const { data: cashConfirmPendingData, isLoading: cashConfirmPendingLoading} = useQuery({
		queryKey: [REACT_QUERY_KEY.cashConfirmPending, userLogin?.userToken!],
		queryFn: () => apiClient.getMySaleConfirmedHistory(userLogin!.userToken!,false),
	});
	const { data: cashHistoryData, isLoading: cashHistoryLoading} = useQuery({
		queryKey: [REACT_QUERY_KEY.cashHistory, userLogin?.userToken!],
		queryFn: () => apiClient.getUserCashHistory(userLogin!.userToken!),
	});

	const { data: pointHistoryData, isLoading: pointHistoryLoading} = useQuery({
		queryKey: [REACT_QUERY_KEY.pointistory, userLogin?.userToken!],
		queryFn: () => apiClient.getUserPointHistory(userLogin!.userToken!),
	});
	useEffect(() => {
		setValue(searchParams.get('tab') ?? '1');
	}, []);

	const handleChange = (_: React.SyntheticEvent, newValue: string) => {
		searchParams.set('tab', newValue);
		setSearchParams(searchParams);
		setValue(newValue);
	};

	const onClickCashPointManage = () => {
		navigate('/my/profile/cashpoint/management')
	}

	if (userDataLoading || pendingCodeDataLoading || rejectedCodeDataLoading || purchaseCodeDataLoading || mentoringDataLoading || cashConfirmLoading || cashConfirmPendingLoading ||cashHistoryLoading ||pointHistoryLoading) {
		return (
			<FullLayout>
				<Skeleton style={{ height: '200px' }} />
				<Skeleton style={{ height: '500px' }} />
				<Skeleton style={{ height: '30px' }} />
				<Skeleton style={{ height: '200px' }} />
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
			<Box height={64} />

			{userLogin ?
				<div>
					<Box height={8} />
					<SectionWrapper>
					<div style={{ display: 'flex', flexDirection:'column'}}>
					
							<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
								<h2>기본 정보</h2> <Box width={16} /> <TextButton onClick={() => { navigate('/profile/my/edit', { state: { userData: userLogin } }) }} style={{ color: '#448FCE', backgroundColor: '#F4F5F8' }}>수정하기</TextButton>
							</div>
							<Card raised elevation={0} style={{ width: 'fit-content', maxWidth: '100%' }}>
								<CardHeader
									avatar={<UserProfileImage size={60} userId={userLogin.userToken!} />}
									title={userData?.nickname}
									titleTypographyProps={{
										fontSize: 25,
									}}
									subheader={userLogin.email}
									subheaderTypographyProps={{
										fontSize: 20,
									}}
								/>
							</Card>
							<h4>자기소개</h4>
							<div>
								{userLogin.aboutMe}
							</div>
					</div>
					</SectionWrapper>
					<Box height={32} />

					<SectionWrapper>

						{tab}
						<TabContext value={value}>
							<Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%', display: 'flex' }}>
								<TabList onChange={handleChange} aria-label='lab API tabs example' style={{ width: '100%', display: 'flex' }} sx={{ flexGrow: 1 }}>
									<Tab label='나의 활동 내역' value='1' sx={{ flex: 1 }} />
									<Tab label='판매 / 수익통계' value='2' sx={{ flex: 1 }} />
								</TabList>
							</Box>
							<TabPanel value='1' sx={{ flex: 1 }}>
								<BuyerContentData purchaseData={purchaseData!} pendingCodeData={pendingCodeData!} approvedCodeData={approvedCodeData!} rejectedCodeData={rejectedCodeData!}  cashHistoryData={cashHistoryData!} pointHistoryData={pointHistoryData!}/>
							</TabPanel>
							<TabPanel value='2' sx={{ flex: 1 }}>
								<SellerContentData purchaseData={purchaseData!} cashConfirmData={cashConfirmData!} cashConfirmPendingData={cashConfirmPendingData!}/>
							</TabPanel>
						</TabContext>

					</SectionWrapper>

				</div>
				:
				<></>
			}
			<Box height={128} />
		</FullLayout>
	);
}
export default MyPage;