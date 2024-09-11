import React, { FC, useEffect, useState } from 'react';
import styled from '@emotion/styled';
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

const CoinContainer = styled.div`
    display: flex;
    align-items: center;
    background-color: #f0f0f0;
    border-radius: 20px;
    padding: 6px 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &:hover {
        background-color: #e0e0e0;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }
`;

const CoinAmount = styled.span`
    color: #333;
    font-size: 16px;
    font-weight: 600;
    margin-right: 6px;
    font-family: 'Arial', sans-serif;
`;

const CoinIcon = styled.img`
    width: 18px;
    height: 18px;
`;

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
                <HeaderTitle to='/'>
                    <h2>
                        <span>&lt;</span>
                        <span>CODE ROOM</span>
                        <span>/&gt;</span>
                    </h2>
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
                                <MarginHorizontal size={8}>
                                    <CoinContainer onClick={() => {navigate('/profile/my?tab=4')}}>
                                        <CoinAmount>
                                            {totalCashPointData?.coin_amount.toLocaleString()}
                                        </CoinAmount>
                                        <CoinIcon src={coinImage} alt="Coin" />
                                    </CoinContainer>
                                </MarginHorizontal>

                                <MarginHorizontal size={8}>
                                    <Link to={'/create/code'} style={{textDecoration: "none"}}>
                                        <span style={{color: '#000000', fontSize: '16px'}}>코드 올리기</span>
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
                                    <ProfileMenu profileUrl={userLogin.profile_url}/>
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