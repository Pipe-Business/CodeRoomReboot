import NotificationsIcon from '@mui/icons-material/Notifications';
import { Avatar, Badge, CircularProgress } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { FC, useCallback, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/ApiClient';
import localApi from '../api/local/LocalApi';
import LoginModal from "../components/login/modal/LoginModal";
import { CenterBox, Margin, MarginHorizontal } from '../components/styles';
import { REACT_QUERY_KEY } from '../constants/define';
import { useQueryUserLogin } from '../hooks/fetcher/UserFetcher';
import useDialogState from '../hooks/useDialogState';
import useInput from '../hooks/useInput';
import { ColorButton, HeaderIconButton, HeaderTitle, HeaderWrapper } from './styles';
import ProfileMenu from '../components/profile/ProfileMenu';
interface Props {
    children?: React.ReactNode;
}


const HeaderLayout: FC<Props> = () => {

    const { userLogin, isLoadingUserLogin } = useQueryUserLogin();
    const queryClient = useQueryClient();


    /*
     * useQuery에서 넘어온 data를 cashData로 선언
     */
    const { isLoading: isCashDataLoading, data: cashData } = useQuery({
        queryKey: [REACT_QUERY_KEY.cash],
        queryFn: () => apiClient.getUserTotalCash(userLogin?.userToken!),
    });

    /*
   * useQuery에서 넘어온 data를 pointData 선언
   */
    const { isLoading: isPointDataLoading, data: pointData } = useQuery({
        queryKey: [REACT_QUERY_KEY.point],
        queryFn: () => apiClient.getUserTotalPoint(userLogin?.userToken!),
    });


    const location = useLocation();
    const currentPath = location.pathname;
    const signOut = async () => {
        console.log("signout");
        localApi.removeUserToken();
        queryClient.setQueryData([REACT_QUERY_KEY.login], null);
        await apiClient.signOut();
        if (currentPath == '/') {
            navigate(0);
        }
        navigate('/');
    }

    const [inputSearch, onChangeInput] = useInput('');
    const onSubmitSearch = useCallback((e: any) => {
        e.preventDefault();
        if (!inputSearch) {
            alert('검색어를 입력해주세요');
            return;
        }
        navigate(`/code/search?query=${inputSearch}`);

    }, [inputSearch]);
    const navigate = useNavigate();

    const [notiCount, setNotiCount] = useState<number>(0);
    const [openLoginModal, onOpenLoginModal, onCloseLoginModal] = useDialogState();

    if (isLoadingUserLogin) {
        return <CenterBox><CircularProgress /></CenterBox>;
    }

    return (
        <HeaderWrapper>
            <header style={{ display: 'flex', alignItems: 'center' }}>

                <HeaderTitle>
                    <Link to='/' style={{ textDecoration: "none" }}>
                        <CenterBox>
                            <h2 style={{ fontSize: '30px', marginTop: '20px', marginBottom: '20px', fontWeight: 'bold' }}>
                                <span style={{ color: '#000000', fontFamily: 'sans-serif' }}>&lt;</span>
                                <span style={{ color: '#000000', fontFamily: 'sans-serif' }}>CODE ROOM</span>
                                <span style={{ color: '#000000', fontFamily: 'sans-serif' }}>/&gt;</span>
                            </h2>
                        </CenterBox>
                    </Link>
                </HeaderTitle>

                {/* <MarginHorizontal size={32}>
                    <Link to={'/mentoring'} style={{ textDecoration: "none" }}>
                        <h3>
                            <span style={{ color: '#000000', }}>멘토링</span>
                        </h3>
                    </Link>
                </MarginHorizontal>

                <MarginHorizontal size={32}>
                    <Link to={'/code-review'} style={{ textDecoration: "none" }}>
                        <h3>
                            <span style={{ color: '#000000', }}>코드리뷰</span>
                        </h3>
                    </Link>
                </MarginHorizontal> */}

                {/* <MarginHorizontal size={32}>
                    <Link to={'/contact'} style={{ textDecoration: "none" }}>
                        <h3>
                            <span style={{ color: '#000000', }}>문의</span>
                        </h3>
                    </Link>
                </MarginHorizontal> */}




            </header>

            {/* space between을 위해 header태그 밖에 위치시킴*/}

            <CenterBox>

                {
                    !userLogin && <CenterBox>
                        <MarginHorizontal size={8}>
                            {<ColorButton variant="text" disableRipple onClick={onOpenLoginModal}>로그인</ColorButton>}
                            <LoginModal isOpen={openLoginModal} onClose={onCloseLoginModal} />
                        </MarginHorizontal>
                    </CenterBox>
                }

                {

                    userLogin && <CenterBox>
                        <MarginHorizontal size={8}>
                            <span style={{ color: '#000000', fontSize: '14px', fontWeight: 'bold' }}>{isCashDataLoading ? '' : cashData + ' 💵'}</span>
                        </MarginHorizontal>
                        <MarginHorizontal size={8}>
                            <span style={{ color: '#000000', fontSize: '14px', fontWeight: 'bold' }}>{isPointDataLoading ? '' : pointData + ' 🌱'}</span>
                        </MarginHorizontal>
                        
                        <MarginHorizontal size={8}>
                            <Link to={'/charge'} style={{ textDecoration: "none" }}>
                                <span style={{ color: '#000000', fontSize: '14px' }}>충전하기</span>
                            </Link>
                        </MarginHorizontal>

                        <MarginHorizontal size={8}>
                            <Link to={'/create/code'} style={{ textDecoration: "none" }}>
                                <span style={{ color: '#000000', fontSize: '14px' }}>코드 올리기</span>
                            </Link>
                        </MarginHorizontal>

                        <MarginHorizontal size={8}>
                            <Link to={'/notification'}>
                                <HeaderIconButton>
                                    <Badge color={'error'} badgeContent={notiCount} max={9}>
                                        <NotificationsIcon sx={{ fontSize: '24px', color: '#000000' }} />
                                    </Badge>
                                </HeaderIconButton>
                            </Link>
                        </MarginHorizontal>

                        {/* <MarginHorizontal size={8}>
                           <UserProfileImage userId={userLogin.userToken!} size={26} onClick={()=>{navigate('/profile/my')}}/>
                            </MarginHorizontal> */}

                        <MarginHorizontal size={8}>
                            <ProfileMenu profileUrl={userLogin.profileUrl!} />
                        </MarginHorizontal>

                        {/* <MarginHorizontal size={8}>
                            <Link to={'/profile/my'} style={{ textDecoration: "none" }}>
                                <span style={{ color: '#000000', fontSize: '14px', fontWeight: 'bold' }}>프로필</span>
                            </Link>
                        </MarginHorizontal> */}

                    </CenterBox>
                }
                {/* {
                    userLogin && <CenterBox>
                        <MarginHorizontal size={8}>
                            <ColorButton variant="text" disableRipple onClick={signOut}>로그아웃</ColorButton>

                        </MarginHorizontal>
                    </CenterBox>
                } */}

            </CenterBox>

        </HeaderWrapper>

    );
};

export default HeaderLayout;