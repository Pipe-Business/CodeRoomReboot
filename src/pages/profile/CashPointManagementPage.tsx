import FullLayout from "../../layout/FullLayout";

import React, { FC, useCallback, useRef, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../api/ApiClient';
import { Button, Card, CardContent, CardHeader, Divider, Typography, Box, Skeleton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "../../api/ApiClient";
import { REACT_QUERY_KEY } from '../../constants/define';
import { SectionWrapper } from "./styles";

interface Props {
	children?: React.ReactNode;
}

const CashPointManagementPage: FC<Props> = () => {
	const [userLogin, setUser] = useState<User | null>(null);
	const navigate = useNavigate();
	const { data: purchaseData, isLoading: purchaseCodeDataLoading } = useQuery({
		queryKey: [REACT_QUERY_KEY.user, userLogin?.id],
		queryFn: () => apiClient.getMyPurchaseSaleHistory(userLogin!.id),
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


	return (
		<FullLayout>
			<Box height={64} />
			<h2>캐시, 커밋 포인트 관리 / 수익 통계</h2>
			
			{
				userLogin &&
				<div>
					<Box height={16} />

					<h3>판매</h3>
						<SectionWrapper>
					<Card sx={{ marginTop: '16px', marginLeft: '8px', }} raised
						elevation={1}>
						<CardHeader
							title={<div style={{ fontSize: 18, fontWeight: 'bold' }}>캐시 정산 내역</div>}
							action={
								<Button variant={'text'} endIcon={<AddIcon />} onClick={() => {
									navigate(`/profile/my/purchase`, { state: { purchaseData: purchaseData, userLogin: userLogin } });
								}}>
									더보기</Button>
							}
						/>
						<CardContent>
							{/* <PurchaseList purchaseData={purchaseData?.slice(0, 3)} userLogin={userLogin} /> */}
						</CardContent>
					</Card>

					<Card sx={{ marginTop: '16px', marginLeft: '8px', }} raised
						elevation={1}>
						<CardHeader
							title={<div style={{ fontSize: 18, fontWeight: 'bold' }}>캐시 정산 대기 내역</div>}
							action={
								<Button variant={'text'} endIcon={<AddIcon />} onClick={() => {
									navigate(`/profile/my/purchase`, { state: { purchaseData: purchaseData, userLogin: userLogin } });
								}}>
									더보기</Button>
							}
						/>
						<CardContent>
							{/* <PurchaseList purchaseData={purchaseData?.slice(0, 3)} userLogin={userLogin} /> */}
						</CardContent>
					</Card>

					</SectionWrapper>




					<Box height={16} />
			
					<h3>캐시 관리</h3>
						<SectionWrapper>

					<Card sx={{ marginTop: '16px', marginLeft: '8px', }} raised
						elevation={1}>
						<CardHeader
							title={<div style={{ fontSize: 18, fontWeight: 'bold' }}>캐시 사용 내역</div>}
							action={
								<Button variant={'text'} endIcon={<AddIcon />} onClick={() => {
									navigate(`/profile/my/purchase`, { state: { purchaseData: purchaseData, userLogin: userLogin } });
								}}>
									더보기</Button>
							}
						/>
						<CardContent>
							{/* <PurchaseList purchaseData={purchaseData?.slice(0, 3)} userLogin={userLogin} /> */}
						</CardContent>
					</Card>
					</SectionWrapper>


					<Box height={16} />

					<h3>포인트 관리</h3>
						<SectionWrapper>
	
					<Card sx={{ marginTop: '16px', marginLeft: '8px', }} raised
						elevation={1}>
						<CardHeader
							title={<div style={{ fontSize: 18, fontWeight: 'bold' }}>포인트 획득 내역</div>}
							action={
								<Button variant={'text'} endIcon={<AddIcon />} onClick={() => {
									navigate(`/profile/my/purchase`, { state: { purchaseData: purchaseData, userLogin: userLogin } });
								}}>
									더보기</Button>
							}
						/>
						<CardContent>
							{/* <PurchaseList purchaseData={purchaseData?.slice(0, 3)} userLogin={userLogin} /> */}
						</CardContent>
					</Card>


					<Box height={8} />

					<Card sx={{ marginTop: '16px', marginLeft: '8px', }} raised
						elevation={1}>
						<CardHeader
							title={<div style={{ fontSize: 18, fontWeight: 'bold' }}>포인트 사용 내역</div>}
							action={
								<Button variant={'text'} endIcon={<AddIcon />} onClick={() => {
									navigate(`/profile/my/purchase`, { state: { purchaseData: purchaseData, userLogin: userLogin } });
								}}>
									더보기</Button>
							}
						/>
						<CardContent>
							{/* <PurchaseList purchaseData={purchaseData?.slice(0, 3)} userLogin={userLogin} /> */}
						</CardContent>
					</Card>
					</SectionWrapper>
				</div>



			}
		</FullLayout>
	);
}
export default CashPointManagementPage;