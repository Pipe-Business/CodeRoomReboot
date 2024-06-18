import React, {FC} from 'react';
import {useParams} from 'react-router-dom';

import {useQuery} from '@tanstack/react-query';
import {Card, CardContent, CardHeader, Divider} from '@mui/material';
import {apiClient} from "../../../../api/ApiClient";
import styled from '@emotion/styled';
import AdminLayout from '../../../../layout/AdminLayout';
import UserProfileImage from '../../../../components/profile/UserProfileImage';
import {reformatTime} from "../../../../utils/DayJsHelper";

interface Props {
    children?: React.ReactNode;
}

const InfoWrapper = styled.div`
    margin-top: 20px;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    font-size: 25px;
`;

const AdminUserInfo: FC<Props> = () => {
    const {userId} = useParams();
    const {isLoading: isUserManageDataLoading, data: userManageData} = useQuery({
        queryKey: ['/admin', userId],
        queryFn: () => apiClient.getTargetUserManageData(userId!),
    });
    if (!userId) {
        return <>page params error</>;
    }
    if (isUserManageDataLoading) {
        return <></>;
    }
    if (!userManageData) {
        return <>error</>
    }

    return (
        <AdminLayout>
            {userManageData!.nickname} 님 페이지
            <Card>
                <CardHeader
                    avatar={<UserProfileImage userId={userId!}/>}
                    title={userManageData.nickname}
                    subheader={userManageData.email}
                />
                <CardContent>

                    <article>
                        <InfoWrapper>
                            <div>id</div>
                            <div>{userManageData.user_token}</div>
                        </InfoWrapper>
                        <Divider/>
                        <InfoWrapper>
                            <div>캐시</div>
                            <div>{userManageData.cash.toLocaleString()}캐시</div>
                        </InfoWrapper>
                        <Divider/>
                        <InfoWrapper>
                            <div>포인트</div>
                            <div>{userManageData.point.toLocaleString()}p</div>
                        </InfoWrapper>
                        <Divider/>
                        <InfoWrapper>
                            <div>계정 생성일</div>
                            <div>{reformatTime(userManageData.created_at!)}</div>
                        </InfoWrapper>
                        <Divider/>

                    </article>
                </CardContent>
            </Card>
        </AdminLayout>
    );
};

export default AdminUserInfo;