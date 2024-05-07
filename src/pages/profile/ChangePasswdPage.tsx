import React, { FC, useCallback, useRef, useState, useEffect } from 'react';
import useInput from '../../hooks/useInput';
import styled from '@emotion/styled';
import MainLayout from '../../layout/MainLayout';
import { CenterBox } from '../main/styles';
import { Link, useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogTitle, IconButton, Card, TextField, Box, Button, Divider } from '@mui/material';
import { EMAIL_EXP } from '../../constants/define';
import { toast } from 'react-toastify';
import { ColorButton } from './styles';
import { MarginHorizontal } from '../../components/styles';
import { apiClient } from '../../api/ApiClient';
import { supabase } from '../../api/ApiClient';


interface Props {
    children?: React.ReactNode;
}
const CardSection = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;
const CenterWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// 비밀번호 변경
const ResetPasswdPage: FC<Props> = () => {

    const [showResetForm, setShowResetForm] = useState<boolean>(false);
    useEffect(() => {
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (event == "PASSWORD_RECOVERY") {
                setShowResetForm(true);
            }
        })
    }, [])


    const inputPwdRef = useRef<HTMLInputElement | null>(null);
    const [inputPwd, onChangePwd, setInputPwd] = useInput('');
    const navigate = useNavigate();
    const onSubmitLoginForm = useCallback(async (e: any) => {
        e.preventDefault();

        if (inputPwd === '' || inputPwd.trim() === '') {
            toast.error('비밀번호를 입력해주세요');
            inputPwdRef.current?.focus();
            return;
        }

        setInputPwd('');
        apiClient.updateUserPassword(inputPwd);
        await apiClient.signOut();
        navigate('/');

    }, [inputPwd]);

    return (
        <MainLayout>

            <MarginHorizontal size={8} style={{ marginTop: 24, marginBottom: 24, }}>
                <span style={{ color: '#000000', fontSize: '24px', fontWeight: 'bold' }}>비밀번호 재설정</span>
            </MarginHorizontal>

            <MarginHorizontal size={8} style={{ marginTop: 16, marginBottom: 16, }}>
                <span style={{ color: '#000000', fontSize: '16px', fontWeight: 'bold' }}>변경하실 비밀번호를 입력해주세요</span>
            </MarginHorizontal>

            {showResetForm &&
                <Card style={{ margin: '8px', borderColor: 'grey', borderWidth: '1px' }} elevation={0} variant='outlined'>
                    <form onSubmit={onSubmitLoginForm} style={{ paddingTop: '64px', paddingBottom: '64px', paddingRight: '16px', paddingLeft: '16px' }}>

                        <div>
                            <TextField
                                sx={{
                                    width: { sm: 300, md: 400 },
                                }}
                                inputRef={inputPwdRef}
                                value={inputPwd}
                                onChange={onChangePwd}
                                fullWidth
                                type={'password'}
                                placeholder='비밀번호 입력' />
                        </div>
                        <Box height={64} />
                        <ColorButton type={'submit'} sx={{ fontSize: '15', width: '100%' }}>비밀번호 재설정</ColorButton>
                    </form>

                    <Box height={16} />


                    <Box height={64} />
                </Card>}
        </MainLayout>
    );
}
export default ResetPasswdPage;