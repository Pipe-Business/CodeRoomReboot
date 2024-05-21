import React, { FC, useCallback, useRef, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import MainLayout from '../../layout/MainLayout';
import { Button, Card, CardContent, CardHeader, Divider, Typography, Box, Skeleton } from '@mui/material';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../api/ApiClient';
import { Link, useNavigate } from 'react-router-dom';
import UserProfileImage from '../../components/profile/UserProfileImage';
import { useQuery } from "@tanstack/react-query"
import { apiClient } from '../../api/ApiClient';
import FullLayout from '../../layout/FullLayout';
import { TextButton } from '../main/styles';
import AddIcon from '@mui/icons-material/Add';
import CodePendingOrPendingList from './components/code/MyCodeList';
import { REACT_QUERY_KEY } from '../../constants/define';
import PurchaseList from './components/purchaseData/PurchaseList';
import MentoringList from './components/mentoringData/MentoringList';
import { ColorButton,SectionWrapper, CashColorButton } from './styles';

interface Props {
	children?: React.ReactNode;
}


const MyPage: FC<Props> = () => {

	const [userLogin, setUser] = useState<User | null>(null);
	const navigate = useNavigate();
	const inputNickNameRef = useRef<HTMLInputElement | null>(null);
	const { data: userData, isLoading: userDataLoading } = useQuery({ queryKey: ['users', userLogin?.id], queryFn: () => apiClient.getTargetUser(userLogin!.id) })
	const { data: approvedCodeData } = useQuery({
		queryKey: [REACT_QUERY_KEY.approvedCode, userLogin?.id, 'state'],
		queryFn: () => apiClient.getMyCodeByStatus(userLogin!.id, 'approve')
	});
	const { data: pendingCodeData, isLoading: pendingCodeDataLoading } = useQuery({
		queryKey: [REACT_QUERY_KEY.pendingCode, userLogin?.id],
		queryFn: () => apiClient.getMyCodeByStatus(userLogin!.id, 'pending')
	});
	const { data: rejectedCodeData, isLoading: rejectedCodeDataLoading } = useQuery({
		queryKey: [REACT_QUERY_KEY.rejectedCode, userLogin?.id],
		queryFn: () => apiClient.getMyCodeByStatus(userLogin!.id, 'rejected')
	});

	const { data: purchaseData, isLoading: purchaseCodeDataLoading } = useQuery({
		queryKey: [REACT_QUERY_KEY.user, userLogin?.id],
		queryFn: () => apiClient.getMyPurchaseSaleHistory(userLogin!.id),
	});

	const { data: mentoringData, isLoading: mentoringDataLoading } = useQuery({
		queryKey: [REACT_QUERY_KEY.mentoring, userLogin?.id],
		queryFn: () => apiClient.getMyMentorings(userLogin!.id),
	});



	useEffect(() => {
		const getSession = async () => {
			const { data, error } = await supabase.auth.getSession()
			if (error) {
				console.error(error)
			} else {
				const { data: { user } } = await supabase.auth.getUser()
				setUser(user);
			}
		}
		getSession()
	}, []);

	if (userDataLoading || pendingCodeDataLoading || rejectedCodeDataLoading || purchaseCodeDataLoading || mentoringDataLoading) {
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
					<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent:'space-between'}}>
					<SectionWrapper>
						<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
							<h2>기본 정보</h2> <Box width={16} /> <TextButton onClick={() => { }} style={{ color: '#448FCE', backgroundColor:'#F4F5F8'}}>수정하기</TextButton>
						</div>
						<Card raised elevation={0} style={{ width: 'fit-content', maxWidth: '100%' }}>
							<CardHeader
								avatar={<UserProfileImage size={60} userId={userLogin.id} />}
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
					</SectionWrapper>
					<CashColorButton style={{width:150, height:70}}>캐시 관리</CashColorButton>
					</div>
					<Box height={32} />
					<SectionWrapper>
					<h2>나의 활동 내역</h2>

					{/* <Box height={16} />
					<h4>내가 신청한 멘토링</h4>
					<Card sx={{ marginTop: '16px', marginLeft: '8px', }} raised
						elevation={1}>
						<CardHeader
							title={<div style={{ fontSize: 18, fontWeight: 'bold' }}>멘토링 목록</div>}
							action={
								<Button variant={'text'} endIcon={<AddIcon />} onClick={() => {
									navigate(`/profile/my/mentoring`, { state: { mentoringData: mentoringData, userLogin: userLogin } });
								}}>
									더보기</Button>
							}
						/>
						<CardContent>
							<MentoringList mentoringData={mentoringData?.slice(0, 3)} userLogin={userLogin} />
						</CardContent>
					</Card> */}
					
					<Box height={32} />

					<h4>내가 구매한 코드</h4>
					<Card sx={{ marginTop: '16px', marginLeft: '8px', }} raised
						elevation={1}>
						<CardHeader
							title={<div style={{ fontSize: 18, fontWeight: 'bold' }}>구매 목록</div>}
							action={
								<Button variant={'text'} endIcon={<AddIcon />} onClick={() => {
									navigate(`/profile/my/purchase`, { state: { purchaseData: purchaseData, userLogin: userLogin } });
								}}>
									더보기</Button>
							}
						/>
						<CardContent>
							<PurchaseList purchaseData={purchaseData?.slice(0, 3)} userLogin={userLogin} />
						</CardContent>
					</Card>
					<Box height={32} />
					<h4>나의 코드</h4>
					<Card sx={{ marginTop: '16px', marginLeft: '8px', }} raised
						elevation={1}>
						<CardHeader
							title={<div style={{ fontSize: 18, fontWeight: 'bold' }}>승인 대기 내역</div>}
							action={
								// todo maxCount변수 제거 필요 : 맨 처음 코드는 maxcount가 false면 3개만 보이도록 지정하고 있다.
								// 지금은 여기서 data 넘길 때 3개만 넘김
								<Button variant={'text'} endIcon={<AddIcon />} onClick={() => {
									navigate(`/profile/my/code-page`, { state: { codeData: pendingCodeData, type: 'pending', maxCount: false } });
								}}>
									더보기</Button>
							}
						/>
						<CardContent>
							<CodePendingOrPendingList maxCount={true} data={pendingCodeData?.slice(0, 3)} type={'pending'} />
						</CardContent>
					</Card>
					<Card sx={{ marginTop: '16px', marginLeft: '8px', }} raised
						elevation={1}>
						<CardHeader
							title={<div style={{ fontSize: 18, fontWeight: 'bold' }}>반려 내역</div>}
							action={
								<Button variant={'text'} endIcon={<AddIcon />} onClick={() => {
									navigate(`/profile/my/code-page`, { state: { codeData: rejectedCodeData, type: 'rejected', maxCount: false } });
								}}>
									더보기</Button>
							}
						/>
						<CardContent>
							<CodePendingOrPendingList maxCount={true} data={rejectedCodeData?.slice(0, 3)} type={'rejected'} />
						</CardContent>
					</Card>
					<Card sx={{ marginTop: '16px', marginLeft: '8px', }} raised
						elevation={1}>
						<CardHeader
							title={<div style={{ fontSize: 18, fontWeight: 'bold' }}>승인 내역</div>}
							action={
								<Button variant={'text'} endIcon={<AddIcon />} onClick={() => {
									navigate(`/profile/my/code-page`, { state: { codeData: approvedCodeData, type: 'approve', maxCount: false } });
								}}>
									더보기</Button>
							}
						/>
						<CardContent>
							<CodePendingOrPendingList maxCount={true} data={approvedCodeData?.slice(0, 3)} type={'approve'} />
						</CardContent>
					</Card>
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