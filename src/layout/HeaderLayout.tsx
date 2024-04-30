import React, { FC, useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge, IconButton, InputBase, Paper } from '@mui/material';
import { HeaderIconButton, HeaderSearch, HeaderTitle, HeaderWrapper } from './styles.ts';
import { CenterBox, MarginHorizontal } from '../components/styles.ts';
import NotificationsIcon from '@mui/icons-material/Notifications';
//import { useQueryUserLogin } from '../hooks/fetcher/UserFetcher.ts';
import useInput from '../hooks/useInput.ts';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import SearchIcon from '@mui/icons-material/Search';


interface Props {
	children?: React.ReactNode;
}

const HeaderLayout: FC<Props> = () => {
//	const { userLogin } = useQueryUserLogin();
const [inputSearch, onChangeInput] = useInput('');
const onSubmitSearch = useCallback((e: any) => {
    e.preventDefault();
    if (!inputSearch ) {
        alert('검색어를 입력해주세요');
        return;
    }
    navigate(`/code/search?query=${inputSearch}`);

}, [inputSearch]);
	const navigate = useNavigate();

	const [notiCount, setNotiCount] = useState<number>(0);

	
	return (

			
		<HeaderWrapper>

            <header style={{ display: 'flex', alignItems: 'center' }}>
           
				<HeaderTitle>
					<Link to='/' style={{textDecoration : "none"}}>
						<CenterBox>
							<h2 style={{ fontSize: '30px', marginTop: '20px', marginBottom: '20px' }}>
								<span style={{ color: '#000000', fontFamily: 'sans-serif' }}>&lt;</span>
								<span style={{ color: '#000000', fontFamily: 'sans-serif' }}>CODE ROOM</span>
								<span style={{ color: '#000000', fontFamily: 'sans-serif' }}>/&gt;</span>
							</h2>
						</CenterBox>
					</Link>
				</HeaderTitle>
            </header>

             {/* space between을 위해 header태그 밖에 위치시킴*/}
            
            <CenterBox>
                <MarginHorizontal size={8}>
                <Link to={'/profile/my'} style={{textDecoration : "none"}}>
							<span style={{ color: '#000000',fontSize: '15px' }}>프로필</span>
					</Link>
                    </MarginHorizontal>

                    <MarginHorizontal size={8}>
                <Link to={'/contact'} style={{textDecoration : "none"}}>
							<span style={{ color: '#000000',fontSize: '15px' }}>문의</span>
					</Link>
                    </MarginHorizontal>
               
                
        
                   
				{/*<HeaderSearch>
					<Paper
						className='search-textfield'
						component='form'
						onSubmit={onSubmitSearch}
						sx={{ p: '2px 12px', display: 'flex', alignItems: 'center' }}
					>
						<InputBase
							placeholder='찾으시는 상품의 이름을 검색해주세요'
							style={{ width: '350px' }}
							//value={inputSearch}
							//onChange={onChangeInput}
						/>
						<IconButton type='submit' sx={{ p: '10px' }} aria-label='search'>
							<SearchIcon />
						</IconButton>
					</Paper>
    </HeaderSearch>*/}
			
			{
				//userLogin && <CenterBox> //tood 수정예정
			        false && <CenterBox>
					<MarginHorizontal size={8}>
						<Link to={'/profile/my/notification'}>
							<HeaderIconButton>
								<Badge color={'error'} badgeContent={notiCount} max={9}>
									<NotificationsIcon sx={{ fontSize: '45px' }} />
								</Badge>
								<span style={{ fontSize: '15px' }}>알림</span>
							</HeaderIconButton>
						</Link>
					</MarginHorizontal>
				</CenterBox>
			}

                </CenterBox>
          
		</HeaderWrapper>
       
	);
};

export default HeaderLayout;