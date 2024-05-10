import React, { CSSProperties, FC, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, Button, Card, CardContent, CardHeader, CircularProgress, IconButton, Tooltip } from '@mui/material';
import useDialogState from '../../hooks/useDialogState.ts';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { calcTimeDiff, reformatTime } from '../../utils/DayJsHelper.ts';
import { ArrowBack } from '@mui/icons-material';
// import 'prismjs/themes/prism.css';
// import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
// import '@toast-ui/editor/dist/toastui-editor.css';
// import 'react-slideshow-image/dist/styles.css';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
import HelpIcon from '@mui/icons-material/Help';
import MainLayout from '../../layout/MainLayout.tsx';
import { REACT_QUERY_KEY } from '../../constants/define.ts';
import { CenterBox } from '../main/styles.ts';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../api/ApiClient.ts';
import { apiClient } from '../../api/ApiClient.ts';
import { MarginHorizontal } from '../main/styles.ts';
import { MarginVertical } from '../main/styles.ts';
import { ColorButton } from './styles.ts';
import { BlurContainer } from './styles.ts';
import RequiredLoginModal from '../../components/login/modal/RequiredLoginModal.tsx';

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
	const navigate = useNavigate();
	//const [userLogin, setUser] = useState<User | null>(null);
	const {state:{
		userLogin,
	}} = useLocation();
	const [isBlur, setBlur] = useState<boolean>(false);
	const [openRequireLoginModal, onOpenRequireLoginModal, onCloseLoginModal] = useDialogState();


	const onClickPurchase =
		() => {
			console.log("구매로직 실행");
		}


		useEffect(()=>{
		if (!userLogin) { // 로그인 확인 필요
			setBlur(true);
			onOpenRequireLoginModal();
			// alert('로그인이 필요한 서비스입니다.');
		}else{
			setBlur(false);
		}
	}, [userLogin]);




	// useEffect(() => {
	// 	const getSession = async () => {
	// 		const { data, error } = await supabase.auth.getSession()
	// 		if (error) {
	// 			console.error(error)
	// 		} else {
	// 			const { data: { user } } = await supabase.auth.getUser()
	// 			setUser(user);
	// 		}
	// 	}
	// 	getSession();
	// 	// onClickCode();
	// }, []);

	const onClickBackButton = useCallback(() => {
		navigate(-1);

	}, []);

	const { id } = useParams();


	/*
	* useQery에서 넘어온 data를 postData로 선언
	*/
	const { isLoading, data: postData } = useQuery({
		queryKey: [REACT_QUERY_KEY.code, id],
		queryFn: () => apiClient.getTargetCode(Number(id!)),
	});

	/*
	* 위에서 넘어온 postData의 usertoken을 통해 게시글 작성자의 정보 쿼리
	*/
	const { isLoading: isUserDataLoading, data: postUserData } = useQuery({
		queryKey: [REACT_QUERY_KEY.user],
		queryFn: () => apiClient.getTargetUser(postData!.userToken),
	});

	if (isLoading || !postData || isUserDataLoading) {
		return
		<MainLayout>
			<CenterBox><CircularProgress /></CenterBox>
		</MainLayout>;
	}

	if (!postUserData) {
		return <>no User Data</>;
	}


	return (

		<MainLayout>
			<div style={{ flexDirection: 'row', display: 'flex', marginTop: '16px' }}>
				<Card sx={{
					width: { sm: 700, md: 800 },
				}}>
					<CardHeader
						avatar={
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<IconButton onClick={onClickBackButton}>
									<ArrowBack sx={{ fontSize: '32px' }} />
								</IconButton>
								<div style={{ fontWeight: 'bold' }}>
									코드 목록으로 돌아가기
								</div>
								<span style={{ marginLeft: 4 }}>

								</span>
							</div>
						}
					/>

					<BlurContainer isBlur={isBlur}>
						<CardContent>
							<div style={{ display: 'flex', flexDirection: 'row' }}>

								<MarginHorizontal size={8} style={{ marginTop: 24, }}>
									<span style={{ color: '#000000', fontSize: '16px', fontWeight: 'lighter' }}>{postData.popularity} popularity 🔥</span>
								</MarginHorizontal>

								<Box width={16} />

								<MarginHorizontal size={8} style={{ marginTop: 24, }}>
									<span style={{ color: '#000000', fontSize: '16px', fontWeight: 'lighter' }}>{postData.buyerCount}명 구매 💰</span>
								</MarginHorizontal>
							</div>

							<Box height={8} />

							<MarginHorizontal size={8} style={{ marginTop: 24, }}>
								<span style={{ color: '#000000', fontSize: '16px', fontWeight: 'lighter' }}>{calcTimeDiff(postData.createdAt)} </span>
							</MarginHorizontal>

							<Box height={8} />

							<MarginHorizontal size={8} style={{ marginTop: 8, marginBottom: 8, }}>
								<span style={{ color: '#000000', fontSize: '24px', fontWeight: 'bold' }}>{postData.title} </span>
							</MarginHorizontal>

							<MarginHorizontal size={8} style={{ marginTop: 8, marginBottom: 8, }}>
								<span style={{ color: 'blue', fontSize: '24px', fontWeight: 'lighter' }}>{postData.hashTag.map((e) => `#${e} `)} </span>
							</MarginHorizontal>

							{/* 카테고리, 가격  */}
							<div style={{ display: 'flex', flexDirection: 'row' }}>

								{/* 카테고리 */}
								<div style={{ display: 'flex', flexDirection: 'row' }}>

									<MarginHorizontal size={8} style={{ marginTop: 8, marginBottom: 8, }}>
										<span style={{ color: '#000000', fontSize: '16px', fontWeight: 'bold' }}>카테고리 : </span>
									</MarginHorizontal>

									<div style={{ marginTop: 8, marginBottom: 8, }}>
										<span style={{ color: '#000000', fontSize: '16px', }}>{postData.postType} / {postData.category} </span>
									</div>

								</div>
								<Box width={16} />

								{/* 가격 */}

								<div style={{ display: 'flex', flexDirection: 'row', }}>

									<MarginHorizontal size={8} style={{ marginTop: 8, marginBottom: 8, }}>
										<span style={{ color: '#000000', fontSize: '16px', fontWeight: 'bold' }}>가격 : </span>
									</MarginHorizontal>

									<div style={{ marginTop: 8, marginBottom: 8, }}>
										<span style={{ color: '#000000', fontSize: '16px', }}>{`${postData.price}c `} </span>
									</div>

								</div>

								<div style={{ display: 'flex', flexDirection: 'row', }}>

									<MarginHorizontal size={8} style={{ marginTop: 8, marginBottom: 8, }}>
										<span style={{ color: '#000000', fontSize: '16px', fontWeight: 'bold' }}>판매자 : </span>
									</MarginHorizontal>

									<div style={{ marginTop: 8, marginBottom: 8, }}>
										<span style={{ color: '#000000', fontSize: '16px', }}>{postUserData.nickname} </span>
									</div>

								</div>

							</div>

							<MarginHorizontal size={8} style={{ marginTop: 4, }}>
								<span style={{ color: '#000000', fontSize: '16px', }}>n명 조회 </span>
							</MarginHorizontal>

							<Box height={64} />

							<MarginHorizontal size={8} style={{ marginTop: 8, marginBottom: 8, }}>
								<span style={{ color: '#000000', fontSize: '24px', fontWeight: 'bold' }}>코드 설명 </span>
							</MarginHorizontal>

							<MarginHorizontal size={8} style={{ marginTop: 16, }}>
								<span style={{ color: '#000000', fontSize: '16px', }}>{postData.description} </span>
							</MarginHorizontal>

							<Box height={32} />

							<MarginHorizontal size={8} style={{ marginTop: 8, marginBottom: 8, }}>
								<span style={{ color: '#000000', fontSize: '24px', fontWeight: 'bold' }}>구매자 가이드 </span>
							</MarginHorizontal>

							<MarginHorizontal size={8} style={{ marginTop: 8, marginBottom: 8, }}>
								<span style={{ color: 'grey', fontSize: '16px', }}>판매자가 코드를 작성했을때 당시 환경(버전,에디터 등)정보입니다. </span>
							</MarginHorizontal>

							<MarginHorizontal size={8} style={{ marginTop: 16, }}>
								<span style={{ color: '#000000', fontSize: '16px', }}>{postData.buyerGuide} </span>
							</MarginHorizontal>

							<Box height={32} />

							<ColorButton type={'submit'} sx={{ fontSize: '15', width: '26%' }} onClick={() => onClickPurchase()} disabled = {isBlur}>구매하기</ColorButton>

							{!userLogin && <CenterBox>
								<MarginHorizontal size={8}>
									<RequiredLoginModal isOpen={openRequireLoginModal} onClose={onCloseLoginModal} />
								</MarginHorizontal>
							</CenterBox>}

						</CardContent>

					</BlurContainer>
				</Card>

				<Box width={24} />
				<BlurContainer isBlur={isBlur}>
					<Card sx={{
						width: { sm: 150, md: 250 }, height: { sm: 150, md: 250, }
					}}
						style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} elevation={0}
					>
						<ColorButton type={'submit'} sx={{ fontSize: '15', width: '80%' }} onClick={() => onClickPurchase()} disabled = {isBlur}>구매하기</ColorButton>

					</Card>
				</BlurContainer>
			</div>
		</MainLayout>
	);
};

export default CodeInfo;