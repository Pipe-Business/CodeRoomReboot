import React, {ChangeEventHandler, FC, useCallback, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from '@mui/material';
import styled from "@emotion/styled"

import {toast} from 'react-toastify';
import {createTodayDate} from '../../../../utils/DayJsHelper';

import {apiClient} from '../../../../api/ApiClient';
import {NotificationEntity} from '../../../../data/entity/NotificationEntity';
import {useMutateSendPoint} from '../../../../hooks/mutate/AdminMutate';
import {NotificationType} from '../../../../enums/NotificationType';

interface Props {
	children?: React.ReactNode;
	isOpen: boolean,
	onClose: () => void,
	userToken: string,
	userNickname: string,
    prevPoint:number,
}

export const TextFieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  & > div {
    margin-bottom: 32px;
    margin-left: 16px;
    margin-right: 16px;

    & > div {
      font-size: 20px;
      margin-bottom: 8px;
    }
  }
`;

const PointSendDialog: FC<Props> = ({ isOpen, onClose, userToken, userNickname, prevPoint }) => {
	const [inputPoint, setPoint] = useState('');
	const [reasonPayment, setReasonPayment] = useState('');
	const { adminSendToPointForUser } = useMutateSendPoint();

	const onChangeReasonPayment = useCallback((e: any) => {
		setReasonPayment(e.target.value);
	}, [reasonPayment]);

	const onChangePoint: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
		setPoint(e.target.value);
	}, [inputPoint]);

	const onClickConfirmButton = useCallback(async (e:any) => {
		e.preventDefault();
		if (inputPoint) {
			await adminSendToPointForUser({ userToken: userToken, point: parseInt(inputPoint), prevPoint : prevPoint, description : reasonPayment});
			const date = createTodayDate();

		
		// 포인트 지급 알림
        const notificationEntity: NotificationEntity ={
            title : '포인트 지급 알림',
            content:`관리자 지급 : ${reasonPayment}`,
            from_user_token: userToken, // todo 관리자 토큰으로 수정 필요. 현재 관리자 토큰으로 보내면 안됨
            to_user_token: userToken,
            notification_type: NotificationType.get_point,
        }
        await apiClient.insertNotification(notificationEntity);

			toast.success(`${inputPoint} 지급완료!`);
			setPoint('');
			onClose();

		} else {
			toast.error('캐시를 입력해주세요');
		}
	}, [inputPoint,reasonPayment]);
	return (
		<Dialog open={isOpen} onClose={onClose} fullWidth maxWidth={'lg'}>
			<DialogTitle>포인트 지급</DialogTitle>
			<form onSubmit={onClickConfirmButton}>
				<DialogContent>
					<TextFieldWrapper>
						<div>
							{userNickname}님 에게 지급할 캐시를 입력해주세요
						</div>
							<TextField placeholder={'ex) 3400'} type={'number'} value={inputPoint} onChange={onChangePoint} required />
					</TextFieldWrapper>
					<TextFieldWrapper>
						<div>
							지급 사유를 입력해주세요
						</div>
							<TextField value={reasonPayment} onChange={onChangeReasonPayment}
									   placeholder={'ex) 이벤트 캐시 지급'} required />
					</TextFieldWrapper>
				</DialogContent>
				<DialogActions>
					<Button type={'submit'}>지급</Button>
					<Button onClick={onClose}>취소</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default PointSendDialog;