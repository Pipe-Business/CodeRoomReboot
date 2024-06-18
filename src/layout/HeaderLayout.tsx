import NotificationsIcon from '@mui/icons-material/Notifications';
import {Badge, Skeleton} from '@mui/material';
import {useQuery} from '@tanstack/react-query';
import React, {FC, useState} from 'react';
import {Link} from 'react-router-dom';
import {apiClient} from '../api/ApiClient';
import LoginModal from "../components/login/modal/LoginModal";
import {CenterBox, MarginHorizontal} from '../components/styles';
import {REACT_QUERY_KEY} from '../constants/define';
import {useQueryUserLogin} from '../hooks/fetcher/UserFetcher';
import useDialogState from '../hooks/UseDialogState';
import {ColorButton, HeaderIconButton, HeaderTitle, HeaderWrapper} from './styles';
import ProfileMenu from '../components/profile/ProfileMenu';

interface Props {
    children?: React.ReactNode;
}


const HeaderLayout: FC<Props> = () => {

    const {userLogin, isLoadingUserLogin} = useQueryUserLogin();

    const {isLoading: isTotalCashPointLading, data: totalCashPointData} = useQuery({
        queryKey: [REACT_QUERY_KEY.totalCashPoint],
        queryFn: () => apiClient.getUserTotalPointCash(userLogin?.user_token!),
    });

    const [notiCount, setNotiCount] = useState<number>(0);
    const [openLoginModal, onOpenLoginModal, onCloseLoginModal] = useDialogState();

    if (isLoadingUserLogin || isTotalCashPointLading) {
        return <CenterBox><Skeleton width={'80%'} height={'64px'}/></CenterBox>;
    }

    return (
        <HeaderWrapper>
            <header style={{display: 'flex', alignItems: 'center'}}>

                <HeaderTitle>
                    <Link to='/' style={{textDecoration: "none"}}>
                        <CenterBox>
                            <h2 style={{fontSize: '30px', marginTop: '20px', marginBottom: '20px', fontWeight: 'bold'}}>
                                <span style={{color: '#000000', fontFamily: 'sans-serif'}}>&lt;</span>
                                <span style={{color: '#000000', fontFamily: 'sans-serif'}}>CODE ROOM</span>
                                <span style={{color: '#000000', fontFamily: 'sans-serif'}}>/&gt;</span>
                            </h2>
                        </CenterBox>
                    </Link>
                </HeaderTitle>
            </header>

            <CenterBox>

                {
                    !userLogin && <CenterBox>
                        <MarginHorizontal size={8}>
                            {<ColorButton variant="text" disableRipple onClick={onOpenLoginModal}>로그인</ColorButton>}
                            <LoginModal isOpen={openLoginModal} onClose={onCloseLoginModal}/>
                        </MarginHorizontal>
                    </CenterBox>
                }

                {

                    userLogin && <CenterBox>
                        <MarginHorizontal size={8}>
                            <span style={{
                                color: '#000000',
                                fontSize: '14px',
                                fontWeight: 'bold'
                            }}>{totalCashPointData?.cash_amount + ' 💵'}</span>
                        </MarginHorizontal>
                        <MarginHorizontal size={8}>
                            <span style={{
                                color: '#000000',
                                fontSize: '14px',
                                fontWeight: 'bold'
                            }}>{totalCashPointData?.point_amount + ' 🌱'}</span>
                        </MarginHorizontal>

                        <MarginHorizontal size={8}>
                            <Link to={'/charge'} style={{textDecoration: "none"}}>
                                <span style={{color: '#000000', fontSize: '14px'}}>충전하기</span>
                            </Link>
                        </MarginHorizontal>

                        <MarginHorizontal size={8}>
                            <Link to={'/create/code'} style={{textDecoration: "none"}}>
                                <span style={{color: '#000000', fontSize: '14px'}}>코드 올리기</span>
                            </Link>
                        </MarginHorizontal>

                        <MarginHorizontal size={8}>
                            <Link to={'/notification'}>
                                <HeaderIconButton>
                                    <Badge color={'error'} badgeContent={notiCount} max={9}>
                                        <NotificationsIcon sx={{fontSize: '24px', color: '#000000'}}/>
                                    </Badge>
                                </HeaderIconButton>
                            </Link>
                        </MarginHorizontal>

                        <MarginHorizontal size={8}>
                            <ProfileMenu profileUrl={userLogin.profile_url!}/>
                        </MarginHorizontal>

                    </CenterBox>
                }
            </CenterBox>

        </HeaderWrapper>

    );
};

export default HeaderLayout;