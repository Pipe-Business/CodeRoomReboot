import React, {ChangeEvent, FC, useCallback, useRef, useState} from 'react';
import InfoLayout from '../../layout/InfoLayout';
import {ColorButton, FormWrapper, TextFieldWrapper} from './styles';
import {Avatar, Box, Card, CardHeader, TextField} from '@mui/material';
import {useInputValidate} from '../../hooks/common/useInputValidate';
import {REACT_QUERY_KEY} from '../../constants/define';
import {toast} from 'react-toastify';
import {useLocation, useNavigate} from 'react-router-dom';
import MainLayout from '../../layout/MainLayout';
import {apiClient} from '../../api/ApiClient';
import {UserEntity} from '../../data/entity/UserEntity';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useQueryUserLogin} from '../../hooks/fetcher/UserFetcher';
import SectionTitle from './components/SectionTitle';
import UserProfileImage from '../../components/profile/UserProfileImage';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {PointHistoryType} from '../../enums/PointHistoryType';
import {PointHistoryRequestEntity} from '../../data/entity/PointHistoryRequestEntity';

interface Props {
	children?: React.ReactNode;
}


interface RouteState{
    state : {
		userData : UserEntity;
    }
}

const EditMyProfilePage: FC<Props> = () => {

	const queryClient = useQueryClient();
	const { state } = useLocation() as RouteState;
	const { userLogin , isLoadingUserLogin } = useQueryUserLogin();
	const navigate = useNavigate();
	const inputEmailRef = useRef<HTMLInputElement | null>(null);
	
	const { isLoading: isPointDataLoading, data: pointData } = useQuery({
		queryKey: [REACT_QUERY_KEY.point],
		queryFn: () => apiClient.getUserTotalPoint(userLogin!.userToken!),
	});

	const [inputIntroduce, onChangeInputIntroduce, , ,
		, successIntroduce, successIntroduceMsg,
		setErrIntroduce, setErrIntroduceMsg,
		, ,inputIntroduceCount
	] = useInputValidate({
		defaultValue : state.userData.aboutMe == null ? "" : state.userData.aboutMe,
	});

	const {mutateAsync: mutateSetProfilePoint} = useMutation({
		mutationFn: async() => {
			// 프로필 보상 포인트 지급
			if(pointData){
				const pointHistory: PointHistoryRequestEntity = {
					user_token: userLogin!.userToken!,
					point: 100,
					amount: pointData + 100,
					description: "프로필 사진 설정 보상",
					point_history_type: PointHistoryType.earn_point,
				}
				await apiClient.insertUserPointHistory(pointHistory);
			}else{
				return false;
			}

			
		},
		onSuccess: async () => {
			await apiClient.setTrueUserProfileImageRewardStatus(userLogin?.userToken!);
			toast.success('프로필 사진 설정 보상 포인트 100p가 지급되었습니다.');

		},
		onError: () => {
			toast.error('프로필 사진 설정 보상 포인트 지급에 실패했습니다.');
		}
	});

	const {mutateAsync: mutateSetIntroducePoint} = useMutation({
		mutationFn: async () => {
			// 자기소개 보상 포인트 지급

			if(pointData){
				const pointHistory: PointHistoryRequestEntity = {
					user_token: userLogin!.userToken!,
					point: 500,
					amount: pointData + 500,
					description: "프로필 자기소개 작성 보상",
					point_history_type: PointHistoryType.earn_point,
				}
				await apiClient.insertUserPointHistory(pointHistory);
			}else{
				return false;
			}

		},
		onSuccess: async () => {
			await apiClient.setTrueUserIntroduceRewardStatus(userLogin?.userToken!);
			toast.success('프로필 자기소개 작성 보상 포인트 500p가 지급되었습니다.');

		},
		onError: () => {
			toast.error ('프로필 자기소개 작성 보상 포인트 500p가 지급되었습니다.');
		}
	});

	const { mutateAsync: mutate } = useMutation({
		mutationFn: async () => {
			 if(file!=null){ // 프로필 이미지 처리

				
				const profileUrl = await apiClient.uploadProfileImage(userLogin?.userToken!, file); // 이미지 스토리지 업로드
                await apiClient.updateProfileImgUrl(userLogin?.userToken!,profileUrl);    // db update
				
				if(!userLogin?.is_profile_image_rewarded){
					mutateSetProfilePoint();
				}
				

			 }
			 
				// db업데이트
				await apiClient.updateAboutMeData(userLogin?.userToken! , inputIntroduce);
				
				// 포인트 지급
				if(inputIntroduce.length > 100 && !userLogin?.is_introduce_rewarded){
					mutateSetIntroducePoint();
				}
			 

			 //todo 자기소개 처리

				
			
		},
		onSuccess: () => {
			queryClient.invalidateQueries(
				{queryKey: [REACT_QUERY_KEY.login],}
			);
			queryClient.invalidateQueries(
				{queryKey: [REACT_QUERY_KEY.user,userLogin?.userToken],}
			);
			toast.success('편집이 완료되었습니다.');
		},
		onError: (error) => {
			// if (error.message == API_ERROR.USER_ALREADY_REGISTERED) {
			// 	toast.error('이미 사용중인 이메일입니다');
			// 	setErrIntroduce(true);
			// 	setErrIntroduceMsg('이미 사용중인 이메일입니다.');
			// }
		},
	});

	

	const [src, setSrc] = useState<string | null>(null);
	const [file, setFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string>("");



	const handleChangeImage = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		let url: string = '';
		const file = Array.from(e.target.files ?? []);
		url = URL.createObjectURL(file[0]);
		setFile(file[0]);
		setSrc(url);
	}, []);

	const onSubmitRegisterForm = useCallback(async (e: any) => {
		try {
			e.preventDefault();
			// if (errorIntroduce) {
			// 	inputEmailRef.current?.focus();
			// 	toast.error(errorIntroduceMessage);
			// 	return;
			// }

	
			await mutate();
			navigate('/profile/my');
		} catch (e) {
			console.log('supabase error', e);
			console.log(e);
		}


	}, [inputIntroduce]);


	return (
		<MainLayout>
			<Card>
				<InfoLayout header={'프로필 수정하기'}>
					<FormWrapper onSubmit={onSubmitRegisterForm}>
						<TextFieldWrapper>
							<SectionTitle title='프로필 이미지'
								helpText={`프로필 이미지를 설정하면 100 커밋 포인트 증정`} />
							<div style={{ display: 'flex', justifyContent: 'row', }}>
								<div>
									{userLogin && <CardHeader avatar={<UserProfileImage size={60} userId={userLogin.userToken!} />} />}
									<input type="file" onChange={handleChangeImage} accept="image/*" />
								</div>
								{src && <div style ={{display: 'flex', justifyContent:'row',alignItems:'center'}}>
									<ArrowForwardIosIcon style={{ color: 'black' }} />
									<Box width={128} />
									<Avatar src={src} sx={{ width: 100, height: 100 }} />
									</div>}

							</div>

							<SectionTitle title='이메일' />
							<div style={{ fontWeight: 'bold', color: 'grey', fontSize: '24px' }}>{state.userData?.email}</div>

							<Box height={24} />

							<SectionTitle title='닉네임' />
							<div style={{ fontWeight: 'bold', color: 'grey', fontSize: '24px' }}>{state.userData?.nickname}</div>
							<Box height={24} />
							<div>
								<SectionTitle title='자기소개'
									helpText={`구매자들에게 자신을 소개해보세요. 소개 작성 시 500 커밋 포인트 증정`} 
									/>
								<Box height={8} />

							</div>
							<TextField value={inputIntroduce}
								sx={{
									width: { sm: 600, md: 800, lg: 1200 },
								}}
								onChange={onChangeInputIntroduce}
								type={'text'}
								// color={errorIntroduce ? 'error' : successIntroduce ? 'success' : 'info'}
								placeholder={'eg. 안녕하세요 10년차 안드로이드 개발자 입니다.'}
								inputRef={inputEmailRef}
								// error={errorIntroduce}
								autoComplete={'off'}
								// helperText={errorIntroduce ? errorIntroduceMessage : successIntroduce ? successIntroduceMsg : ''}
								fullWidth
								multiline
								rows={10}
							/>
							<div style={{ display: 'flex', justifyContent: 'end' }}>
						({inputIntroduceCount}/1,000)
					
				</div>
						</TextFieldWrapper>


						<div>
							<ColorButton type={'submit'} sx={{ fontSize: '18px', width: '100%', fontWeight: 'bold' }}>편집 완료</ColorButton>
						</div>
					</FormWrapper>

				</InfoLayout>
			</Card>
			<Box height={64} />
		</MainLayout>

	);
};

export default EditMyProfilePage;
