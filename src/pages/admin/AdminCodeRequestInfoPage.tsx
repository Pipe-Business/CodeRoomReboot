import React, {FC} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import AdminLayout from '../../layout/AdminLayout';
import {useQuery} from '@tanstack/react-query';
import {Button, IconButton, Skeleton} from '@mui/material';
import useDialogState from '../../hooks/UseDialogState';
import AcceptModal from '../../components/review/modal/AcceptModal';
import RejectModal from '../../components/review/modal/RejectModal';
import {reformatTime} from "../../utils/DayJsHelper";
import {useQueryUserById} from "../../hooks/fetcher/UserFetcher";
import {ArrowBack} from '@mui/icons-material';
import {CATEGORY_TO_KOR} from "../../constants/define";
import {apiClient} from "../../api/ApiClient";
import MainLayout from '../../layout/MainLayout';
import {PostStateType} from "../../enums/PostStateType";
import ReadMeHtml from "../codeInfo/components/ReadMeHtml";
import {ContentContainer, TitleContainer} from "./styles";

interface Props {
	children?: React.ReactNode;
}

const AdminCodeRequestInfo: FC<Props> = () => {
	const { userId, codeId } = useParams();
	const navigate = useNavigate();

	const { isLoading, data } = useQuery({
		queryKey: ['codeRequest', codeId],
		queryFn: () => apiClient.getTargetCode(Number(codeId)),
	});

	const { userById } = useQueryUserById(userId!);
	const [openAcceptModal, onOpenAcceptModal, onCloseAcceptModal] = useDialogState();
	const [openRejectModal, onOpenRejectModal, onCloseRejectModal] = useDialogState();


	if (isLoading) {
		return (
			<MainLayout>
				<Skeleton />
				<Skeleton />
				<Skeleton />
				<Skeleton />
				<Skeleton />
			</MainLayout>
		);
	}
	if (!userById) {
		return <>noUser</>;
	}
	if (!data) {
		return <>404 error</>;
	}
	return (
		<AdminLayout>


			<div style={{height: '100dvh'}}>

				<div style={{display: 'flex', alignItems: 'center'}}>
					<IconButton onClick={() => {
						navigate(-1);
					}}>
						<ArrowBack/>
					</IconButton>
					<h1>{userById.nickname} 님의 {data.title}</h1>
				</div>
				<h2 style={{
					marginBottom: 64,
					color: 'red',
					fontSize: '48px'
				}}>{data.state === PostStateType.pending ? '요청 대기' : data.state === PostStateType.rejected ? '요청 반려' : '승인'}</h2>
				{data.state === PostStateType.rejected &&

					<div>
						<TitleContainer>반려사유</TitleContainer>
						<ContentContainer>{data.rejectMessage}</ContentContainer>
					</div>

				}
				<div>
					<TitleContainer>제목</TitleContainer>
					<ContentContainer>{data.title}</ContentContainer>
				</div>

				<div>
					<TitleContainer>
						<img src='/robot.png' alt='robot.png' width="32" style={{paddingRight:'10px'}}/>
						AI ROOMY의 KeyPoint ✨
					</TitleContainer>


					<ContentContainer>{data.buyerGuide}</ContentContainer>
				</div>

				{data.description && <div style={{marginBottom: '30px'}}>
					<TitleContainer>
						코드 설명
					</TitleContainer>

					<ContentContainer>
						<ReadMeHtml htmlText={data.description!}/>
					</ContentContainer>

				</div>}
				<div>
					<div>
						<TitleContainer>카테고리</TitleContainer>
						<ContentContainer>{CATEGORY_TO_KOR[data.category as keyof typeof CATEGORY_TO_KOR]}</ContentContainer>
					</div>
				</div>

				<div>
					<TitleContainer>개발언어</TitleContainer>
					<ContentContainer>{data.language}</ContentContainer>
				</div>

				<div>
					<TitleContainer>{data.state === PostStateType.pending ? '요청' : data.state === PostStateType.rejected ? '반려' : '승인'}시간</TitleContainer>
					<ContentContainer>
						{reformatTime(data.createdAt)}
					</ContentContainer>
				</div>


				<div>
					<TitleContainer>판매가격</TitleContainer>
					<ContentContainer>{data.price} 💵</ContentContainer>
				</div>
				<div>
					<TitleContainer>판매자 레포지토리 주소</TitleContainer>
					<ContentContainer><a href={data.githubRepoUrl}
										 target={'_blank'}>{data.githubRepoUrl}</a></ContentContainer>
				</div>
				<div>
					<TitleContainer>판매자 깃허브 닉네임</TitleContainer>
					<ContentContainer>
						<Link to={`https://github.com/${data.sellerGithubName}`} target='_blank'>
							<span>{data.sellerGithubName}</span>
						</Link>
					</ContentContainer>
				</div>

				{data.state === PostStateType.pending &&
					<div style={{marginBottom: '128px', marginTop: '128px'}}>
						<div style={{
							position: 'sticky',
							bottom: 0,
							zIndex: 2,
							fontSize: '30px',
							display: 'flex',
						}}>
							<Button style={{flex: 1, fontSize: 30}} onClick={onOpenAcceptModal}
									variant={'contained'}>
								승인
							</Button>
							<Button style={{flex: 1, fontSize: 30}} onClick={onOpenRejectModal}
									variant={'contained'}
									color={'error'}>
								반려
							</Button>
						</div>
						<AcceptModal open={openAcceptModal} onClose={onCloseAcceptModal}/>
						<RejectModal postId={data.id!.toString()} title={data.title} userToken={data.userToken}
									 open={openRejectModal}
									 onClose={onCloseRejectModal} refetch={() => {
							navigate('/admin');
						}}/>
					</div>
				}

			</div>

		</AdminLayout>
	);
};

export default AdminCodeRequestInfo;