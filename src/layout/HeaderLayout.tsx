import React, { FC, useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge, IconButton, InputBase, Paper, Button } from '@mui/material';
import { HeaderIconButton, HeaderSearch, HeaderTitle, HeaderWrapper, ColorButton } from './styles.ts';
import { CenterBox, MarginHorizontal } from '../components/styles.ts';
import NotificationsIcon from '@mui/icons-material/Notifications';
import useDialogState from '../hooks/useDialogState.ts';
//import { useQueryUserLogin } from '../hooks/fetcher/UserFetcher.ts';
import useInput from '../hooks/useInput.ts';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import SearchIcon from '@mui/icons-material/Search';
import LoginModal from '../components/login/modal/LoginModal.tsx';
import { User } from '@supabase/supabase-js';
import { apiClient, supabase } from '../api/ApiClient.ts';

interface Props {
    children?: React.ReactNode;
}


const HeaderLayout: FC<Props> = () => {

    const [userLogin, setUser] = useState<User | null>(null)

    useEffect(() => {
        const getSession = async () => {
            const { data, error } = await supabase.auth.getSession()
            if (error) {
                console.error(error)
            } else {
                const { data: { user } } = await supabase.auth.getUser()
                setUser(user);
            }
        }
        getSession()
    }, [])

    const signOut = async () => {
        console.log("signout");
        await apiClient.signOut();
        // eslint-disable-next-line no-restricted-globals
        location.reload();
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

                <MarginHorizontal size={32}>
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
                </MarginHorizontal>

                <MarginHorizontal size={32}>
                    <Link to={'/contact'} style={{ textDecoration: "none" }}>
                        <h3>
                            <span style={{ color: '#000000', }}>문의</span>
                        </h3>
                    </Link>
                </MarginHorizontal>




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
                            <Link to={'/cash'} style={{ textDecoration: "none" }}>
                                <span style={{ color: '#000000', fontSize: '14px', fontWeight: 'bold' }}>0 커밋</span>
                            </Link>
                        </MarginHorizontal>


                        <MarginHorizontal size={8}>
                            <Link to={'/write'} style={{ textDecoration: "none" }}>
                                <span style={{ color: '#000000', fontSize: '14px', fontWeight: 'bold' }}>코드 올리기</span>
                            </Link>
                        </MarginHorizontal>

                        <MarginHorizontal size={8}>
                            <Link to={'/profile/my'} style={{ textDecoration: "none" }}>
                                <span style={{ color: '#000000', fontSize: '14px', fontWeight: 'bold' }}>프로필</span>
                            </Link>
                        </MarginHorizontal>

                      
                        <MarginHorizontal size={8}>
                            <Link to={'/profile/my/notification'}>
                                <HeaderIconButton>
                                    <Badge color={'error'} badgeContent={notiCount} max={9}>
                                        <NotificationsIcon sx={{ fontSize: '24px' }} />
                                    </Badge>
                                </HeaderIconButton>
                            </Link>
                        </MarginHorizontal>
                    </CenterBox>
                }
                {
                    userLogin && <CenterBox>
                        <MarginHorizontal size={8}>
                            <ColorButton variant="text" disableRipple onClick={signOut}>로그아웃</ColorButton>

                        </MarginHorizontal>
                    </CenterBox>
                }

            </CenterBox>

        </HeaderWrapper>

    );
};

export default HeaderLayout;