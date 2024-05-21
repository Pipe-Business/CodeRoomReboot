import React, { FC, useCallback, useRef, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import MainLayout from '../../layout/MainLayout';
import { Button, Card, CardContent, CardHeader, Divider, Typography, Box } from '@mui/material';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../api/ApiClient';
import { Link, useNavigate } from 'react-router-dom';
import UserProfileImage from '../../components/UserProfileImage';
import {useQuery} from "@tanstack/react-query"
import { apiClient } from '../../api/ApiClient';
import FullLayout from '../../layout/FullLayout';
import { TextButton } from '../main/styles';
import AddIcon from '@mui/icons-material/Add';
import CodePendingOrPendingList from './components/code/MyCodeList';
import { REACT_QUERY_KEY } from '../../constants/define';
import PurchaseList from './components/purchaseData/PurchaseList';
import MentoringList from './components/mentoringData/MentoringList';

interface Props {
	children?: React.ReactNode;
}


const MyPage: FC<Props> = () => {

  const [userLogin, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const inputNickNameRef = useRef<HTMLInputElement | null>(null);
  const {data:userData, isLoading} = useQuery({queryKey:['users',userLogin?.id],queryFn:() => apiClient.getTargetUser(userLogin!.id)})
  const {data : approvedCodeData} = useQuery({
    queryKey : [REACT_QUERY_KEY.approvedCode, userLogin?.id, 'state'],
    queryFn: () => apiClient.getMyCodeByStatus(userLogin!.id, 'approve')
  });
  const {data : pendingCodeData} = useQuery({
    queryKey : [REACT_QUERY_KEY.pendingCode, userLogin?.id],
    queryFn: () => apiClient.getMyCodeByStatus(userLogin!.id, 'pending')
  });
  const {data : rejectedCodeData} = useQuery({
    queryKey : [REACT_QUERY_KEY.rejectedCode, userLogin?.id],
    queryFn: () => apiClient.getMyCodeByStatus(userLogin!.id, 'rejected')
  });

  const {data : purchaseData} = useQuery({
    queryKey : [REACT_QUERY_KEY.user, userLogin?.id],
    queryFn : () => apiClient.getMyPurchaseSaleHistory(userLogin!.id),
  });

  const {data : mentoringData} = useQuery({
    queryKey : [REACT_QUERY_KEY.mentoring, userLogin?.id],
    queryFn : () => apiClient.getMyMentorings(userLogin!.id),
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

if(isLoading){
  <></>
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
      <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
      <h2>기본 정보</h2> <Box width={16}/> <TextButton onClick={() => {}} style={{color:'#448FCE'}}>수정하기</TextButton>
      </div>
  {userLogin ?
  <div>
				<Card raised elevation={0} style={{display:'inline-block',}}>
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
          <Box height={32}/>
          <h2>나의 활동 내역</h2>

		  <Box height={16}/>
          <h4>내가 신청한 멘토링</h4>
		  <Card sx={{marginTop: '16px', marginLeft: '8px', }} raised
							  elevation={1}>
							<CardHeader
								title={<div style ={{fontSize: 18,fontWeight:'bold'}}>멘토링 목록</div>}
								action={
								<Button variant={'text'} endIcon={<AddIcon /> } onClick={ () => {
									navigate(`/profile/my/mentoring`,{state: {mentoringData : mentoringData ,userLogin : userLogin}});
								}}>
									더보기</Button>
							}
							/>
							<CardContent>
								<MentoringList mentoringData={mentoringData?.slice(0,3)} userLogin={userLogin}/>
							</CardContent>
						</Card>
		  <Box height={32}/>

          <h4>내가 구매한 코드</h4>
          <Card sx={{marginTop: '16px', marginLeft: '8px', }} raised
							  elevation={1}>
							<CardHeader
								title={<div style ={{fontSize: 18,fontWeight:'bold'}}>구매 목록</div>}
								// action={<Link to={'/profile/my/purchase'}><Button variant={'text'} endIcon={
								// 	<AddIcon />}>더보기</Button></Link>}
								action={
								<Button variant={'text'} endIcon={<AddIcon /> } onClick={ () => {
									navigate(`/profile/my/purchase`,{state: {purchaseData : purchaseData ,userLogin : userLogin}});
								}}>
									더보기</Button>
							}
							/>
							<CardContent>
								<PurchaseList purchaseData={purchaseData?.slice(0,3)} userLogin={userLogin}/>
							</CardContent>
						</Card>
						<Box height={32}/>
          <h4>나의 코드</h4>
          <Card sx={{marginTop: '16px', marginLeft: '8px', }} raised
							  elevation={1}>
							<CardHeader
								title={<div style ={{fontSize: 18,fontWeight:'bold'}}>승인 대기 내역</div>}
								action={<Link to={'/profile/my/requestPending'}><Button variant={'text'} endIcon={
									<AddIcon />}>더보기</Button></Link>}
							/>
							<CardContent>
								<CodePendingOrPendingList maxCount={true} data={pendingCodeData?.slice(0,3)} type={'pending'} />
							</CardContent>
						</Card>
            <Card sx={{marginTop: '16px', marginLeft: '8px', }} raised
							  elevation={1}>
							<CardHeader
								title={<div style ={{fontSize: 18,fontWeight:'bold'}}>반려 내역</div>}
								action={<Link to={'/profile/my/requestReject'}><Button variant={'text'} endIcon={
									<AddIcon />}>더보기</Button></Link>}
							/>
							<CardContent>
								<CodePendingOrPendingList maxCount={true} data={rejectedCodeData?.slice(0,3)} type={'rejected'} />
							</CardContent>
						</Card>
						<Card sx={{marginTop: '16px', marginLeft: '8px', }} raised
							  elevation={1}>
							<CardHeader
								title={<div style ={{fontSize: 18,fontWeight:'bold'}}>승인 내역</div>}
								action={<Link to={'/profile/my/requestApproved'}><Button variant={'text'} endIcon={
									<AddIcon />}>더보기</Button></Link>}
							/>
							<CardContent>
								<CodePendingOrPendingList maxCount={true} data={approvedCodeData?.slice(0,3)} type={'approve'} />
							</CardContent>
						</Card>
  
          </div>
           :
           <></>
  }
  <Box height={128}/>
  </FullLayout>
  );
}
export default MyPage;