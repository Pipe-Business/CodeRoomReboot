import React, {FC, useCallback, useRef, useState,} from 'react';
import InfoLayout from '../../layout/InfoLayout';
import {Box, Card, TextField} from '@mui/material';
import {useInputValidate} from '../../hooks/common/useInputValidate';
import {API_ERROR, EMAIL_EXP} from '../../constants/define';
import {toast} from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import MainLayout from '../../layout/MainLayout';
import {ColorButton, FormWrapper, TextFieldWrapper} from './styles';
import {apiClient} from '../../api/ApiClient';
import {createTodayDate} from '../../utils/DayJsHelper';
import {UserEntity} from '../../data/entity/UserEntity';
import {useMutation} from '@tanstack/react-query';
import {User} from '@supabase/supabase-js';
import {PointHistoryRequestEntity} from '../../data/entity/PointHistoryRequestEntity';
import {NotificationEntity} from '../../data/entity/NotificationEntity';
import {NotificationType} from "../../enums/NotificationType";

interface Props {
	children?: React.ReactNode;
}


const RegisterPage: FC<Props> = () => {

	const navigate = useNavigate();

	const inputEmailRef = useRef<HTMLInputElement | null>(null);
	const inputPwdRef = useRef<HTMLInputElement | null>(null);
	const inputPwdCheckRef = useRef<HTMLInputElement | null>(null);
	const inputNicknameRef = useRef<HTMLInputElement | null>(null);

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
				
				// 초기 포인트 기록 내역 생성
				const pointHistory : PointHistoryRequestEntity = {
					user_token : user.id,
					point : 1000,
					amount : 1000,
					description : "가입 축하 포인트",
				}
	
				await apiClient.insertUserPointHistory(pointHistory);
				return user.id;
		},
		onSuccess: async (userToken:string) => {
			const notificationEntity: NotificationEntity ={
				title : '포인트 지급 알림',
				content: '가입 축하 포인트로 1000 포인트가 지급 되었습니다',
				from_user_token: userToken, // todo 관리자 토큰으로 수정 필요. 현재 관리자 토큰으로 보내면 안됨
				to_user_token: userToken,
				notification_type: NotificationType.get_point,
			}
			await apiClient.insertNotification(notificationEntity);

			toast.success('회원가입에 성공하였습니다. 로그인 해주세요.');
			toast.success('가입 축하 포인트 1000p가 지급되었습니다.');
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
			if (!inputPwd) {
				inputPwdRef.current?.focus();
				setErrPwdMsg('빈칸을 입력해주세요');
				setErrPwd(true);
				toast.error('빈칸을 입력해주세요');
				return;
			}
			if (errorPwd) {
				inputPwdRef.current?.focus();
				toast.error(errPwdMessage);
				return;
			}
			if (!inputPwdCheck) {
				inputPwdCheckRef.current?.focus();
				setErrPwdCheckMsg('빈칸을 입력해주세요');
				setErrPwdCheck(true);
				toast.error('빈칸을 입력해주세요');
				return;
			}
			if (errorPwdCheck) {
				inputPwdCheckRef.current?.focus();
				return;
			}
			if (!inputNickName) {
				inputNicknameRef.current?.focus();
				setErrNicknameMsg('빈칸을 입력해주세요');
				setErrNickname(true);
				toast.error('빈칸을 입력해주세요');
				return;
			}
			if (errorNickName) {
				inputNicknameRef.current?.focus();
				toast.error(errNickNameMsg);
				return;
			}
			const date = createTodayDate();
			// await mutate({
			// 	id: '',
			// 	birth: '',
			// 	nickname: inputNickName,
			// 	email: inputEmail!,
			// 	point: 200,
			// 	createdAt: date,
			// 	gender: 'male',
			// 	registerType: 'codeRoom',
			// });
			// const entity: BootPayPaymentEntity = {
			// 	userId: userUid,
			// 	point: 200,
			// 	price: 0,
			// 	purchaseAt: date,
			// 	orderName: '가입축하 캐시',
			// 	methodOrigin: 'admin',
			// 	companyName: '파이프빌더',
			// 	type: 'supply',
			// };
			// const pushKey = await mutateBootpayRequest(entity);
			// const userBootPayEntity: BootpayPaymentForUser = {
			// 	id: pushKey,
			// 	userId: userUid,
			// 	createdAt: date,
			// };
			// await firebaseSetFetcher(['bootpayPaymentForUser', userUid, pushKey], userBootPayEntity);
			// const notiEntity: UserNotificationEntity = {
			// 	createdAt: date,
			// 	content: `🎉가입축하 캐시 200p 를 받았습니다.`,
			// 	sender: 'admin',
			// };
			// await apiClient.sendNotificationByUser(userUid, notiEntity);
		  const user : UserEntity = {
				authType : 'CODEROOM',
				email : inputEmail,
				nickname : inputNickName,
				name:null,
				profileUrl:null,
				contacts : null,
				aboutMe:null,
				userToken : null,
				is_profile_image_rewarded: false,
				is_introduce_rewarded: false,
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
				<InfoLayout header={'일반회원 회원가입'}>
					<FormWrapper onSubmit={onSubmitRegisterForm}>
						<TextFieldWrapper>
							<div>이메일</div>
							<TextField
								sx={{
									width: { sm: 300, md: 400 },
								}}
								fullWidth
								type='email'
								inputRef={inputEmailRef}
								value={inputEmail}
								onChange={onChangeInputEmail}
								error={errorEmail}
								autoFocus
								color={errorEmail ? 'error' : successEmail ? 'success' : 'info'}
								placeholder={'ex) coderoom@coding.com'}
								helperText={errorEmail ? errorEmailMessage : successEmail ? successEmailMsg : ''}
							/>
						</TextFieldWrapper>
						<TextFieldWrapper>
							<div>비밀번호</div>
							<TextField
								sx={{
									width: { sm: 300, md: 400 },
								}}
								fullWidth
								value={inputPwd}
								inputRef={inputPwdRef}
								onChange={onChangeInputPwd}
								error={errorPwd}
								color={errorPwd ? 'error' : successPwd ? 'success' : 'info'}
								helperText={errorPwd ? errPwdMessage : successPwd ? successPwdMsg : ''}
								placeholder={'비밀번호 6자리 이상'}
								type='password'
							/>
						</TextFieldWrapper>
						<TextFieldWrapper>
							<div>비밀번호 재확인</div>
							<TextField
								sx={{
									width: { sm: 300, md: 400 },
								}}
								fullWidth
								value={inputPwdCheck}
								inputRef={inputPwdCheckRef}
								onChange={onChangeInputPwdCheck}
								error={errorPwdCheck}
								helperText={errorPwdCheck ? errorPwdCheckMsg : successPwdCheck ? successPwdMsg : ''}
								placeholder={'비밀번호를 다시 입력해주세요'}
								type='password'
							/>
						</TextFieldWrapper>
						<TextFieldWrapper>
							<div>닉네임</div>
							<TextField
								sx={{
									width: { sm: 300, md: 400 },
								}}
								fullWidth
								value={inputNickName}
								ref={inputNicknameRef}
								onChange={onChangeInputNickName}
								error={errorNickName}

								color={errorNickName ? 'error' : successNickName ? 'success' : 'info'}
								helperText={errorNickName ? errNickNameMsg : successNickName ? successNickNameMsg : ''}
								placeholder={'닉네임을 입력해주세요 2글자 이상'}
								type='text'
							/>
						</TextFieldWrapper>
						<div>
							<ColorButton type={'submit'} sx={{ fontSize: '18px', width: '100%', fontWeight: 'bold' }}>회원가입</ColorButton>
						</div>
					</FormWrapper>

				</InfoLayout>
			</Card>
			<Box height={64} />
		</MainLayout>

	);
};

export default RegisterPage;
