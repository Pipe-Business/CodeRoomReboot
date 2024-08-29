import React, { FC, useEffect, useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Badge, Box, Skeleton} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/ApiClient';
import LoginModal from "../components/login/modal/LoginModal";
import { CenterBox, MarginHorizontal } from '../components/styles';
import { REACT_QUERY_KEY } from '../constants/define';
import { useQueryUserLogin } from '../hooks/fetcher/UserFetcher';
import useDialogState from '../hooks/UseDialogState';
import { ColorButton, HeaderIconButton, HeaderTitle, HeaderWrapper } from './styles';
import ProfileMenu from '../components/profile/ProfileMenu';
import coinImage from '../assets/coin.png';

interface Props {
    isScrolled: boolean;
}

const HeaderLayout: FC<Props> = ({ isScrolled }) => {
    const { userLogin, isLoadingUserLogin } = useQueryUserLogin();

    const { isLoading: isTotalCashPointLoading, data: totalCashPointData } = useQuery({
        queryKey: [REACT_QUERY_KEY.totalCashPoint, userLogin?.user_token],
        queryFn: () => apiClient.getUserTotalAmount(userLogin?.user_token!),
        enabled: !!userLogin?.user_token,
    });

    const { isLoading: isNotiLoading, data: notiData } = useQuery({
        queryKey: [REACT_QUERY_KEY.notification],
        queryFn: () => apiClient.getMyNotReadNotification(userLogin?.user_token!),
        enabled: !!userLogin?.user_token,
    });

    const navigate = useNavigate();

    const [notiCount, setNotiCount] = useState<number>(0);
    const [openLoginModal, onOpenLoginModal, onCloseLoginModal] = useDialogState();

    useEffect(() => {
        setNotiCount(notiData?.length ?? 0);
    }, [notiData]);

    if (isLoadingUserLogin || isTotalCashPointLoading || isNotiLoading) {
        return <CenterBox><Skeleton width={'80%'} height={'64px'}/></CenterBox>;
    }

    return (
        <HeaderWrapper $isScrolled={isScrolled}>
            <Box sx={{
                width: '100%',
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 16px' // 좌우 패딩 추가
            }}>
                <HeaderTitle>
                    <Link to='/' style={{textDecoration: "none"}}>
                        <h2 style={{fontSize: '36px', marginTop: '20px', marginBottom: '20px', fontWeight: 'bold'}}>
                            <span style={{color: '#000000', fontFamily: 'sans-serif'}}>&lt;</span>
                            <span style={{color: '#000000', fontFamily: 'sans-serif'}}>CODE ROOM</span>
                            <span style={{color: '#000000', fontFamily: 'sans-serif'}}>/&gt;</span>
                        </h2>
                    </Link>
                </HeaderTitle>

                <Box> {/* 오른쪽 요소들을 위한 컨테이너 */}
                    <CenterBox>
                        {!userLogin && (
                            <CenterBox>
                                <MarginHorizontal size={8}>
                                    <ColorButton variant="text" disableRipple onClick={onOpenLoginModal}>로그인</ColorButton>
                                    <LoginModal isOpen={openLoginModal} onClose={onCloseLoginModal}/>
                                </MarginHorizontal>
                            </CenterBox>
                        )}

                        {userLogin && (
                            <CenterBox>
                                <div onClick={() => {navigate('/profile/my?tab=4')}} style={{cursor:'pointer'}}>
                                <MarginHorizontal size={8}>
                                    <span style={{
                                        color: '#000000',
                                        fontSize: '17px',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        {totalCashPointData?.coin_amount.toLocaleString()}
                                        <img
                                            src={coinImage}
                                            alt="Coin"
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                marginLeft: '4px'
                                            }}
                                        />
                                    </span>
                                </MarginHorizontal>
                                </div>

                                <MarginHorizontal size={8}>
                                    <Link to={'/create/code'} style={{textDecoration: "none"}}>
                                        <span style={{color: '#000000', fontSize: '17px'}}>코드 올리기</span>
                                    </Link>
                                </MarginHorizontal>

                                <MarginHorizontal size={8}>
                                    <Link to={'/notification'}>
                                        <HeaderIconButton>
                                            <Badge color={'error'} badgeContent={notiCount} max={9}>
                                                <NotificationsIcon sx={{fontSize: '26px', color: '#000000'}}/>
                                            </Badge>
                                        </HeaderIconButton>
                                    </Link>
                                </MarginHorizontal>

                                <MarginHorizontal size={8}>
                                    <ProfileMenu profileUrl={userLogin.profile_url!}/>
                                </MarginHorizontal>
                            </CenterBox>
                        )}
                    </CenterBox>
                </Box>
            </Box>
        </HeaderWrapper>
    );
};

export default HeaderLayout;