import React, { FC, useCallback, useRef, useState, useEffect, ChangeEvent } from 'react';
import FullLayout from '../../layout/FullLayout.tsx';
import InfoLayout from '../../layout/InfoLayout.tsx';
import { FormWrapper, TextFieldWrapper, ColorButton } from './styles.ts';
import { Box, Button, Card, CardHeader, TextField, IconButton } from '@mui/material';
import { useInputValidate } from '../../hooks/common/useInputValidate.ts';
import { EMAIL_EXP } from '../../constants/define.ts';
import { toast } from 'react-toastify';
import { Navigate, useNavigate } from 'react-router-dom';
import MainLayout from '../../layout/MainLayout.tsx';
import { apiClient } from '../../api/ApiClient.ts';
import { createTodayDate } from '../../utils/DayJsHelper.ts';
import { UserEntity } from '../../data/entity/UserEntity.ts';
import { useMutation } from '@tanstack/react-query';
import { User } from '@supabase/supabase-js';
import { API_ERROR } from '../../constants/define.ts';
import { supabase } from '../../api/ApiClient.ts';
import { useQuery } from "@tanstack/react-query"
import SectionTitle from './components/SectionTitle.tsx';
import UserProfileImage from '../../components/profile/UserProfileImage.tsx';
import ImageCard from '../../components/ImageCard.tsx';
import { Avatar } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface Props {
	children?: React.ReactNode;
}


const EditMyProfilePage: FC<Props> = () => {

	const [userLogin, setUser] = useState<User | null>(null);
	const navigate = useNavigate();
	const inputEmailRef = useRef<HTMLInputElement | null>(null);
	const [inputIntroduce, onChangeInputIntroduce, errorIntroduce, errorIntroduceMessage,
		, successIntroduce, successIntroduceMsg,
		setErrIntroduce, setErrIntroduceMsg,
		, ,inputIntroduceCount
	] = useInputValidate({
		minLen: 100, 
		maxLen: 1000,
		validRegexMessage: '100자 이상 입력해주세요',
	});
	const { data: userData, isLoading: userDataLoading } = useQuery({ queryKey: ['users', userLogin?.id], queryFn: () => apiClient.getTargetUser(userLogin!.id) })


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


	const { mutateAsync: mutate } = useMutation({
		mutationFn: async (userEntity: UserEntity) => {
			
		},
		onSuccess: () => {
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
			if (!inputIntroduce) {
				setErrIntroduceMsg('빈칸을 입력해주세요');
				setErrIntroduce(true);
				inputEmailRef.current?.focus();
				toast.error('빈칸을 입력해주세요');
				return;
			}
			if (errorIntroduce) {
				inputEmailRef.current?.focus();
				toast.error(errorIntroduceMessage);
				return;
			}

			const date = createTodayDate();

			const user: UserEntity = {
				authType: 'CODEROOM',
				email: inputIntroduce,
				nickname: '',
				name: null,
				profileUrl: null,
				contacts: null,
				aboutMe: null,
				userToken: null,
			}
			await mutate(user);
			navigate('/signup-complete');
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
									{userLogin && <CardHeader avatar={<UserProfileImage size={60} userId={userLogin!.id} />} />}
									<input type="file" onChange={handleChangeImage} accept="image/*" />
								</div>
								{src && <div style ={{display: 'flex', justifyContent:'row',alignItems:'center'}}>
									<ArrowForwardIosIcon style={{ color: 'black' }} />
									<Box width={128} />
									<Avatar src={src} sx={{ width: 100, height: 100 }} />
									</div>}

							</div>

							<SectionTitle title='이메일' />
							<div style={{ fontWeight: 'bold', color: 'grey', fontSize: '24px' }}>{userData?.email}</div>

							<Box height={24} />

							<SectionTitle title='닉네임' />
							<div style={{ fontWeight: 'bold', color: 'grey', fontSize: '24px' }}>{userData?.nickname}</div>
							<Box height={24} />
							<div>
								<SectionTitle title='자기소개'
									helpText={`구매자들에게 자신을 소개해보세요. 소개 작성 시 500 커밋 포인트 증정
			(최소 100자 이상 작성)`} />
								<Box height={8} />

							</div>
							<TextField value={inputIntroduce}
								sx={{
									width: { sm: 600, md: 700, lg: 800 },
								}}
								onChange={onChangeInputIntroduce}
								type={'text'}
								color={errorIntroduce ? 'error' : successIntroduce ? 'success' : 'info'}
								placeholder={'eg. 안녕하세요 10년차 안드로이드 개발자 입니다.'}
								inputRef={inputEmailRef}
								error={errorIntroduce}
								autoComplete={'off'}
								helperText={errorIntroduce ? errorIntroduceMessage : successIntroduce ? successIntroduceMsg : ''}
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
