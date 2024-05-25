import { ArrowBack } from '@mui/icons-material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Box, Card, CardContent, CardHeader, CircularProgress, IconButton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import React, { CSSProperties, FC, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../../api/ApiClient.ts';
import RequiredLoginModal from '../../components/login/modal/RequiredLoginModal.tsx';
import { REACT_QUERY_KEY } from '../../constants/define.ts';
import { useQueryUserLogin } from '../../hooks/fetcher/UserFetcher.ts';
import useDialogState from '../../hooks/useDialogState.ts';
import MainLayout from '../../layout/MainLayout.tsx';
import { calcTimeDiff } from '../../utils/DayJsHelper.ts';
import { CenterBox, MarginHorizontal } from '../main/styles.ts';
import CodeInfoBuyItByCashButton from './components/CodeInfoBuyItByCashButton.tsx';
import CodeInfoBuyItByPointButton from './components/CodeInfoBuyItByPointButton.tsx';
import CashPaymentDialog from './components/CoinPaymentDialog.tsx';
import PointPaymentDialog from './components/PointPaymentDialog.tsx';
import { BlurContainer } from './styles.ts';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';


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
	const { isLoadingUserLogin, userLogin } = useQueryUserLogin();
	const [isOpenLoginDialog, onOpenLoginDialog, onCloseDialogDialog] = useDialogState();
	const [isOpenPointDialog, onOpenPointDailog, onClosePointDialog] = useDialogState();
	const [isLike, setLike] = useState<boolean>(false);
	const [onCashClickConfirm] = CashPaymentDialog();
	const [onPointClickConfirm] = PointPaymentDialog();
	const [isBlur, setBlur] = useState<boolean>(false);
	const [openRequireLoginModal, onOpenRequireLoginModal, onCloseLoginModal] = useDialogState();


	/*
   	* 	조회수 증가
   	*/

	useEffect(() => {
		if (id) {
			apiClient.updateViewCount(Number(id));
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

	/*
   * useQuery에서 넘어온 data를 cashData로 선언
   */
	const { isLoading: isCashDataLoading, data: cashData } = useQuery({
		queryKey: [REACT_QUERY_KEY.cash],
		queryFn: () => apiClient.getUserTotalCash(userLogin?.userToken!),
	});

	/*
   * useQuery에서 넘어온 data를 pointData로 선언
   */
	const { isLoading: isPointDataLoading, data: pointData } = useQuery({
		queryKey: [REACT_QUERY_KEY.point],
		queryFn: () => apiClient.getUserTotalPoint(userLogin?.userToken!),
	});

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

	const { id } = useParams();


	/*
	* useQuery에서 넘어온 data를 postData로 선언
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

	/*
	* 위에서 넘어온 postData의 usertoken을 통해 구매기록을 조회 (purchase_sale_history 기록을 조회)
	*/

	const { isLoading: purchaseSaleLoading, data: purchaseSaleData } = useQuery({
		queryKey: [REACT_QUERY_KEY.purchaseSaleHistory],
		queryFn: () => apiClient.getMyPurchaseSaleHistoryByPostID(userLogin?.userToken!, postData!.id),
	});

	/*
	*   postId와 userToken으로 좋아요 상태 조회
	*/

	const { isLoading: isLikeLoading, data: likeData } = useQuery({
		queryKey: [REACT_QUERY_KEY.like],
		queryFn: () => apiClient.getLikeData(userLogin?.userToken!, postData!.id),
	});

	useEffect(() => {
		if (likeData != null) {
			console.log("likedata" + { likeData });
			setLike(true);
		}
	}, [likeData]);


	if (isLoading || !postData || isUserDataLoading || purchaseSaleLoading || isLikeLoading || isPointDataLoading || isLoadingUserLogin) {
		return <MainLayout><CenterBox><CircularProgress /></CenterBox></MainLayout>;
	}

	if (!postUserData) {
		return <>no User Data</>;
	}


	return (

		<MainLayout>
			<div style={{ flexDirection: 'row', display: 'flex', marginTop: '16px' }}>
				<Card
					elevation={0}
					sx={{
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
									<span style={{ color: '#000000', fontSize: '16px', fontWeight: 'lighter' }}>{postData.popularity} 코드룸 포인트 🔥</span>
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

							{/* <MarginHorizontal size={8} style={{ marginTop: 8, marginBottom: 8, }}>
								<span style={{ color: 'blue', fontSize: '24px', fontWeight: 'lighter' }}>{postData.hashTag.map((e) => `#${e} `)} </span>
							</MarginHorizontal> */}

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
										<span style={{ color: '#000000', fontSize: '16px', fontWeight: 'bold' }}>판매가격 : </span>
									</MarginHorizontal>

									<div style={{ marginTop: 8, marginBottom: 8, }}>
										<span style={{ color: '#000000', fontSize: '16px', }}>{`${postData.price} 캐시 / ${postData.price*5} 커밋 포인트`} </span>
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
								<span style={{ color: '#000000', fontSize: '16px', }}>조회수 : {postData.viewCount} </span>
							</MarginHorizontal>



							<MarginHorizontal size={8} style={{ marginTop: 32, }}>
								{postData.images &&

									<div>
										<Box height={64} />

										<MarginHorizontal size={8} style={{ marginTop: 8, marginBottom: 8, }}>
											<span style={{ color: '#000000', fontSize: '24px', fontWeight: 'bold' }}>결과물 이미지</span>
										</MarginHorizontal>

										<Slider
											nextArrow={<SampleNextArrow />}
											prevArrow={<SamplePrevArrow />}
											dots={true}
											arrows={false}
											slidesToShow={1}
											slidesToScroll={1}
											speed={500}
											infinite={false}
										>

											{postData.images.map((url, key) => {
												return <img alt={'image'} key={key} style={{
													objectFit: 'contain',
												}} src={url} />;
											})
											}

										</Slider>

										<Box height={128} />
									</div>

								}
							</MarginHorizontal>



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

							<div style={{ display: 'flex', flexDirection: 'row', }}>
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

								<Box width={32} />

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
								<Box width={32} />
								<IconButton onClick={onClickLike}>
									{isLike ? <ThumbUpIcon sx={{ color: 'red' }} /> : <ThumbUpIcon />}
								</IconButton>
							</div>

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
						style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }} elevation={0}
					>
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

						<Box height={24} />


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
						{/* CodeInfoBuyItByPointButton */}

					</Card>
				</BlurContainer>
			</div>
		</MainLayout>
	);
};

export default CodeInfo;