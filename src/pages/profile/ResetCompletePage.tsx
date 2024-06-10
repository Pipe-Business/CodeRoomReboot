import React, {FC} from 'react';
import MainLayout from '../../layout/MainLayout';
import {TextButton} from '../main/styles';
import {Link} from 'react-router-dom';
import {Box, Card} from '@mui/material';
import {MarginHorizontal} from '../../components/styles';


interface Props {
    children?: React.ReactNode;
}



const ResetCompletePage: FC<Props> = () => {
    return (
        <MainLayout>
                <Card style={{ margin: '8px',borderColor: 'grey', borderWidth:'1px'}} elevation={0}>
            <Box height={64}/>
            <MarginHorizontal size={8} style={{ marginTop: 24, marginBottom: 24, }}>
                <span style={{ color: '#000000', fontSize: '24px', fontWeight: 'bold' }}>비밀번호 초기화</span>
            </MarginHorizontal>


            <MarginHorizontal size={8} style={{ marginTop: 16, marginBottom: 16, }}>
                <span style={{ color: '#000000', fontSize: '16px', fontWeight: 'bold' }}>초기화 하시려면 이메일로 전송된 링크를 클릭해주세요.</span>
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
export default ResetCompletePage;