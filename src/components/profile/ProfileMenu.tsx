import { Avatar, Card, CardHeader, Menu, MenuItem } from '@mui/material';
import React, { FC, useState } from "react";
import { useQueryUserLogin } from "../../hooks/fetcher/UserFetcher";
import UserProfileImage from "./UserProfileImage";
import localApi from '../../api/local/LocalApi';
import { useQueryClient } from '@tanstack/react-query';
import { REACT_QUERY_KEY } from '../../constants/define';
import { apiClient } from '../../api/ApiClient';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface Props{
    children?: React.ReactNode,
    profileUrl:string, 
}

const ProfileMenu: FC<Props> = ({profileUrl}) => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const currentPath = location.pathname;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const navigate = useNavigate();


	const { userLogin, isLoadingUserLogin } = useQueryUserLogin();
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
};

const handleMenuClose = () => {
    setAnchorEl(null);
};

const signOut = async () => {
  console.log("signout");
  localApi.removeUserToken();
queryClient.setQueryData([REACT_QUERY_KEY.login], null);
  await apiClient.signOut();
  if(currentPath == '/'){
      navigate(0);
  }
  navigate('/');
}

    return (
        <div>
        <Avatar src={profileUrl} sx={{width:26,height:26, border:'1.5px solid', borderColor:'#D1D8DD'}}
         onMouseEnter={handleMenuOpen}
         onMouseLeave={handleMenuClose}
        />
      <Menu
        anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onMouseEnter={handleMenuOpen}
                onMouseLeave={handleMenuClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{ 
                  right: {
                    sx:'65px',
                    sm:'75px',
                    md:'80px',
                    lg:'200px',
                    xl:'400px',
                  },
                  top:'24px' 
                }}
      >

         
          <MenuItem key={1} 
          onClick={() => {navigate('/profile/my')}}
          disableRipple
          sx={{borderBottom:'0.5px solid',borderColor:'#D1D8DD', backgroundColor:'white',
          '&:hover': { backgroundColor: 'transparent', boxShadow: 'none' }
           }}
          >
          <Card raised elevation={0} style={{ width: 'fit-content', maxWidth: '100%' }}>
								<CardHeader
									avatar={<UserProfileImage size={60} userId={userLogin?.userToken!} />}
									title={userLogin?.nickname}
									titleTypographyProps={{
										fontSize: 25,
									}}
									subheader={userLogin?.email}
									subheaderTypographyProps={{
										fontSize: 20,
									}}
								/>
							</Card>
          </MenuItem>
          <MenuItem key={0} onClick={signOut} sx={{borderBottom:'0.5px solid',borderColor:'#D1D8DD', height:'86px'}}>
            로그아웃
          </MenuItem>

      </Menu>
      </div>
    );
}

export default ProfileMenu;