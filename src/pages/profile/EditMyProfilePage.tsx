import React, { FC, useCallback, useRef, useState, useEffect } from 'react';
import FullLayout from '../../layout/FullLayout.tsx';
import InfoLayout from '../../layout/InfoLayout.tsx';
import { FormWrapper, TextFieldWrapper, ColorButton } from './styles.ts';
import { Box, Button, Card, CardHeader, TextField } from '@mui/material';
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

interface Props {
	children?: React.ReactNode;
}


const EditMyProfilePage: FC<Props> = () => {

	const [userLogin, setUser] = useState<User | null>(null);

	const navigate = useNavigate();

	const inputEmailRef = useRef<HTMLInputElement | null>(null);

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
			const user:User = await apiClient.signUpByEmail(inputEmail, inputPwd);
				userEntity.userToken = user.id;
				await apiClient.insertUserData(userEntity);

				// 초기 캐시기록 내역 생성
				const cashHistory : CashHistoryRequestEntity = {
					user_token : user.id,
					cash : 0,
					amount : 0,
					description : "초기 캐시기록 내역 생성",
				}
	
				await apiClient.insertUserCashHistory(cashHistory);
		},
		onSuccess: () => {
			toast.success('회원가입에 성공하였습니다. 로그인 되었습니다.');
		},
		onError: (error) => {
			if (error.message == API_ERROR.USER_ALREADY_REGISTERED) {
				toast.error('이미 사용중인 이메일입니다');
				setErrEmail(true);
				setErrEmailMsg('이미 사용중인 이메일입니다.');
			}
		},
	});

	const [inputPwd, onChangeInputPwd, errorPwd, errPwdMessage,
		, successPwd, successPwdMsg,
		setErrPwd, setErrPwdMsg,
	] = useInputValidate({ minLen: 6 });

	const [inputNickName, onChangeInputNickName, errorNickName, errNickNameMsg,
		___, successNickName, successNickNameMsg,
		setErrNickname, setErrNicknameMsg, , ,
	] = useInputValidate({ minLen: 2 });


	const [inputPwdCheck, setInputPwdCheck] = useState('');
	const [errorPwdCheck, setErrPwdCheck] = useState(false);
	const [errorPwdCheckMsg, setErrPwdCheckMsg] = useState('');
	const [successPwdCheck, setSuccessPwdCheck] = useState(false);
	const [, setSuccessPwdCheckMsg] = useState('');
	const onChangeInputPwdCheck = useCallback((e: any) => {
		let value = e.target.value;
		let isError = false;
		let isSuccess = false;
		let message = '';
		let successMsg = '';
		if (value === inputPwd) {
			console.log('match true');
			successMsg = '알맞게 입하셨어요';
			isSuccess = true;
		}
		if (value === '') {
			isError = true;
			message = '빈칸을 입력해주세요';
		} else if (value !== inputPwd) {
			isError = true;
			message = '비밀번호를 다시확인해주세요';
		} else {
			isError = false;
		}
		setSuccessPwdCheckMsg(successMsg);
		setSuccessPwdCheck(isSuccess);
		setErrPwdCheck(isError);
		setErrPwdCheckMsg(message);
		setInputPwdCheck(value);
	}, [inputPwd, inputPwdCheck]);

	const [inputEmail, onChangeInputEmail, errorEmail, errorEmailMessage,
		, successEmail, successEmailMsg,
		setErrEmail, setErrEmailMsg,
		, ,
	] = useInputValidate({
		regex: EMAIL_EXP,
		validRegexMessage: '이메일 형식이 올바르지 않아요',
	});

	const onSubmitRegisterForm = useCallback(async (e: any) => {
		try {
			e.preventDefault();
			if (!inputEmail) {
				setErrEmailMsg('빈칸을 입력해주세요');
				setErrEmail(true);
				inputEmailRef.current?.focus();
				toast.error('빈칸을 입력해주세요');
				return;
			}
			if (errorEmail) {
				inputEmailRef.current?.focus();
				toast.error(errorEmailMessage);
				return;
			}
		
			const date = createTodayDate();

		  const user : UserEntity = {
				authType : 'CODEROOM',
				email : inputEmail,
				nickname : inputNickName,
				name:null,
				profileUrl:null,
				contacts : null,
				aboutMe:null,
				userToken : null,
			}	
			await mutate(user);
			navigate('/signup-complete');
		} catch (e) {
			console.log('supabase error', e);
			console.log(e);
		}


	}, [inputPwdCheck, inputPwd, inputEmail, inputNickName]);

	return (
		<MainLayout>
			<Card>
				<InfoLayout header={'프로필 수정하기'}>
					<FormWrapper onSubmit={onSubmitRegisterForm}>
						<TextFieldWrapper>
						<SectionTitle title='프로필 이미지'
						helpText={`프로필 이미지를 설정하면 100 커밋 포인트 증정`}/>
							{userLogin && <CardHeader avatar={<UserProfileImage size={60} userId={userLogin!.id} />} onClick={() => {alert('프로필 이미지 변경 구현예정')}}/>}
						<SectionTitle title='이메일'/>
							<div style={{fontWeight:'bold',color:'grey', fontSize:'24px'}}>{userData?.email}</div>
							
							<Box height={24}/>

						<SectionTitle title='닉네임'/>
							<div style={{fontWeight:'bold',color:'grey', fontSize:'24px'}}>{userData?.nickname}</div>
							<Box height={24}/>
                            <div>
            <SectionTitle title='자기소개'
            helpText={`구매자들에게 자신을 소개해보세요. 소개 작성 시 500 커밋 포인트 증정
			(최소 100자 이상 작성)`}/>
            <Box height={8} />
						
					</div>
					<TextField value={inputEmail}
                                sx={{
                                    width: { sm: 600, md: 700, lg: 800 },
                                }}
							   onChange={onChangeInputEmail}
							   type={'text'}
                               color={errorEmail ? 'error' : successEmail ? 'success' : 'info'}
                               placeholder={'eg. 안녕하세요 10년차 안드로이드 개발자 입니다.'}
                               inputRef={inputEmailRef}
                               error={errorEmail}
							   autoComplete={'off'}
                               helperText={errorEmail ? errorEmailMessage : successEmail ? successEmailMsg : ''}
							   fullWidth
							   multiline
							   rows={10}
					/>
					{/* <div style={{ display: 'flex', justifyContent: 'end' }}>
						({inputGuideCount}/3,000)
					
				</div>
				 */}
					
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
