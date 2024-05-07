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
import { TextButton } from '../main/styles';


interface Props {
    children?: React.ReactNode;
}



const SignUpCompletePage: FC<Props> = () => {
    return (
        <MainLayout>
                <Card style={{ margin: '8px',borderColor: 'grey', borderWidth:'1px'}} elevation={0}>
            <Box height={64}/>
            <MarginHorizontal size={8} style={{ marginTop: 24, marginBottom: 24, }}>
                <span style={{ color: '#000000', fontSize: '24px', fontWeight: 'bold' }}>회원가입 완료</span>
            </MarginHorizontal>


            <MarginHorizontal size={8} style={{ marginTop: 16, marginBottom: 16, }}>
                <span style={{ color: '#000000', fontSize: '16px', fontWeight: 'bold' }}>회원가입이 완료되었습니다. 즐거운 거래 되세요🩵</span>
            </MarginHorizontal>
            
            <Box height={64}/>

            <Link to={'/'}>
                <TextButton type={'submit'} sx={{ fontSize: '15', }}>홈으로 이동</TextButton>
            </Link>

            </Card>
            <Box height={128}/>

        </MainLayout>
    );
}
export default SignUpCompletePage;