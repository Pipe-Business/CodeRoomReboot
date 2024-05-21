import React, { FC } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import FullLayout from '../../layout/FullLayout';
import MainLayout from '../../layout/MainLayout';
import { Button, Card, CardContent, CardHeader, Divider, Typography, Box } from '@mui/material';
import { User } from '@supabase/supabase-js';
import dayjs from 'dayjs';


interface Props {
	children?: React.ReactNode,
}
interface RouteState{
    state : {
        mentoringItemData : MentoringResponseEntity;
        mentorInfo : User;
    }
}

const MyMentoringDataPage: FC<Props> = () => {

	const {state} = useLocation() as RouteState;
    // let obj =  JSON.stringify(state.mentoringItemData);
    // console.log("state"+ obj);

	return (
		<MainLayout>
            <Box height={64} />
            <Card sx={{width: { sm: 600, md: 700 }, alignItems:'start', justifyContent:'center', display: 'flex', flexDirection:'column'}}>
			<Box height={32} />
            <div style={{margin : '16px'}}>
			<h2>멘토링 상세</h2>
            <h3>제목</h3>
            <div style = {{fontSize : '24px'}}>
            {state.mentoringItemData.title}
            </div>

            <h3>내용</h3>
            <div style = {{fontSize : '24px'}}>
            {state.mentoringItemData.content}
            </div>

            {/* <h3>멘토</h3>
            <div style = {{fontSize : '24px'}}>
            {state.mentoringItemData.to_user_token}
            </div> */}

            <h3>신청날짜</h3>
            <div style = {{fontSize : '24px'}}>
            {dayjs(state.mentoringItemData.request_date).format('YYYY-MM-DD')}
            </div>


            </div>
            <Box height={32} />
            </Card>
            <Box height={128} />
		</MainLayout>
	);
};

export default MyMentoringDataPage;