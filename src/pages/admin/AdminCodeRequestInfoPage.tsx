import React, { FC } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../layout/AdminLayout.tsx';
import { useQuery } from '@tanstack/react-query';
import { Button, Divider, IconButton } from '@mui/material';
import useDialogState from '../../hooks/useDialogState.ts';
import AcceptModal from '../../components/review/modal/AcceptModal.tsx';
import RejectModal from '../../components/review/modal/RejectModal.tsx';
import styled from '@emotion/styled';
import { reformatTime } from '../../utils/DayJsHelper.ts';
import { useQueryUserById } from '../../hooks/fetcher/UserFetcher.ts';
import { ArrowBack } from '@mui/icons-material';
//import 'prismjs/themes/prism.css';
//import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
// import '@toast-ui/editor/dist/toastui-editor.css';
// import { Viewer } from '@toast-ui/react-editor';
import { CATEGORY_TO_KOR } from '../../constants/define.ts';
import { apiClient } from '../../api/ApiClient.ts';
import ImageCard from './components/codeRequest/ImageCard.tsx';
import MainLayout from '../../layout/MainLayout.tsx';
import { Skeleton } from '@mui/material';
import { toast } from 'react-toastify';

interface Props {
	children?: React.ReactNode;
}

const ContentWrapper = styled.div`
  & div {
    font-size: 25px;
    margin-bottom: 16px;
  }

  & span {
    font-size: 20px;
  }

  margin-top: 16px;
  margin-bottom: 16px;
`;
const AdminCodeRequestInfo: FC<Props> = () => {
	const { userId, codeId } = useParams();
	const navigate = useNavigate();

	const { isLoading, data } = useQuery({
		queryKey: ['codeRequest', codeId],
		queryFn: () => apiClient.getTargetCode(Number(codeId)),
	});

	// if (!userId || !codeId) {
	// 	return <div>ID가 없습니다.</div>;
	// }

	const { userById } = useQueryUserById(userId!);
	 //const { codeData } = useQueryCodeById(['codeStore', codeId]);
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


			<div style={{ height: '100dvh' }}>

				<div style={{ display: 'flex', alignItems: 'center' }}>
					<IconButton onClick={() => {
						navigate(-1);
					}}>
						<ArrowBack />
					</IconButton>
					<h1>{userById.nickname} 님의 {data.title}</h1>
				</div>
				<h2 style={{ marginBottom: 64 }}>{data.state === 'pending' ? '요청 대기' : data.state === 'rejected' ? '요청 반려' : '승인'}</h2>
				{data.state === 'rejected' &&
				
					<ContentWrapper>
						<div>반려사유</div>
						<span>{data.rejectMessage}</span>
					</ContentWrapper>
	

				}
				<ContentWrapper>
					<div>제목</div>
					<span>{data.title}</span>
				</ContentWrapper>
				<div style={{ marginBottom: '30px' }}>
					<div style={{
						whiteSpace: 'pre-wrap',
						fontSize: '30px',
						marginBottom: '10px',
						marginTop: '10px',
					}}>내용
					</div>

					<div style={{ marginTop: 16, }}>
								<span style={{ color: '#000000', fontSize: '16px', }}>{data.description} </span>
					</div>

					{/* <div style={{
						fontSize: '24px',
						whiteSpace: 'pre-line',
						wordWrap: 'break-word',
					}}>
						<Viewer
							initialValue={data.description}
						/>
					</div> */}
				</div>
				<Divider />
				<ContentWrapper>
					<div>
						<div style={{ whiteSpace: 'pre-wrap' }}>카테고리</div>
						<div>{CATEGORY_TO_KOR[data.category as keyof typeof CATEGORY_TO_KOR ]}</div>
					</div>
				</ContentWrapper>
				<ContentWrapper>
					<div style={{ whiteSpace: 'pre-wrap' }}>개발언어</div>
					<span style={{ display: 'flex', alignItems: 'center' }}>
					<span style={{ marginLeft: 16 }}>{data.language}</span>
					</span>
				</ContentWrapper>
				<Divider />
			
					<>
						<h3>이미지</h3>
						<div>
							{data.images ? <ImageCard src={data.images} /> : <>no image</>}
						</div>
						<Divider />
					</>
				
				<ContentWrapper>
					<div>{data.state === 'pending' ? '요청' : data.state === 'rejected' ? '반려' : '승인'}시간</div>
					<span>
					{reformatTime(data.createdAt)}
				</span>
				</ContentWrapper>
				<Divider />
			
					
						<ContentWrapper>
							<div>판매가격</div>
							<span>{data.price}p</span>
						</ContentWrapper>
						<Divider />
						<ContentWrapper>
							<div>판매자 레포지토리 주소</div>
							<span><a href={data.githubRepoUrl} target={'_blank'}>{data.githubRepoUrl}</a></span>
						</ContentWrapper>
						<Divider />
						<ContentWrapper>
							<div>판매자 깃허브 닉네임</div>
							<Link to={`https://github.com/${data.sellerGithubName}`} target='_blank'>
								<span>{data.sellerGithubName}</span>
							</Link>
						</ContentWrapper>
				
				{data.state === 'pending' &&
					<div>
						<div style={{
							position: 'sticky',
							bottom: 0,
							zIndex: 2,
							fontSize: '30px',
							display: 'flex',
						}}>
							<Button style={{ flex: 1, fontSize: 30 }} onClick={onOpenAcceptModal}
									variant={'contained'}>
								승인
							</Button>
							<Button style={{ flex: 1, fontSize: 30 }} onClick={onOpenRejectModal}
									variant={'contained'}
									color={'error'}>
								반려
							</Button>
						</div>
						<AcceptModal open={openAcceptModal} onClose={onCloseAcceptModal} />
						<RejectModal postId={data.id!.toString()} title={data.title} userToken={data.userToken}
									 open={openRejectModal}
									 onClose={onCloseRejectModal} refetch={() => {
										navigate('/admin');
									 }} /> {/*refetch */}
					</div>
				}

			</div>

		</AdminLayout>
	);
};

export default AdminCodeRequestInfo;