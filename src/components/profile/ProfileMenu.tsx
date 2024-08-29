// ProfileMenu.tsx
import React, { FC, useState } from 'react';
import { Avatar, Menu, MenuItem, ListItemIcon, Divider, Typography, Box } from '@mui/material';
import { useQueryUserLogin } from "../../hooks/fetcher/UserFetcher";
import UserProfileImage from "./UserProfileImage";
import localApi from '../../api/local/LocalApi';
import { useQueryClient } from '@tanstack/react-query';
import { REACT_QUERY_KEY } from "../../constants/define";
import { apiClient } from "../../api/ApiClient";
import {useLocation, useNavigate} from 'react-router-dom';
import { Logout, AccountCircle } from '@mui/icons-material';
import {MenuItemStyle} from "../styles";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

interface Props {
    children?: React.ReactNode,
    profileUrl: string,
}

const ProfileMenu: FC<Props> = ({ profileUrl }) => {
    const queryClient = useQueryClient();
    const location = useLocation();
    const currentPath = location.pathname;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const { userLogin } = useQueryUserLogin();

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
        if (currentPath === '/') {
            navigate(0);
        }
        navigate('/');
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
                src={profileUrl}
                sx={{
                    width: 36,
                    height: 36,
                    cursor: 'pointer',
                    border: '2px solid',
                    borderColor: '#D1D8DD',
                }}
                onClick={handleMenuOpen}
            />
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: {
                        mt: 1,
                        minWidth: 200,
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        borderRadius: 2,
                    },
                }}
            >
                <MenuItemStyle
                    onClick={() => { navigate('/profile/my'); handleMenuClose(); }}>
                    <ListItemIcon>
                        <UserProfileImage size={32} userId={userLogin?.user_token!} />
                    </ListItemIcon>
                    <Box width={8} />
                    <Box>
                        <Typography variant="body1" fontWeight="bold">
                            {userLogin?.nickname}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {userLogin?.email}
                        </Typography>
                    </Box>
                </MenuItemStyle>
                <Divider />
                <MenuItemStyle onClick={() => {navigate('/profile/my?tab=1')}}>
                    <ListItemIcon>
                        <FavoriteIcon sx={{color: 'red'}}/>
                    </ListItemIcon>
                    {`관심목록`}
                </MenuItemStyle>
                <Divider />
                <MenuItemStyle onClick={() => {navigate('/profile/my?tab=2')}}>
                    <ListItemIcon>
                        <ShoppingCartIcon/>
                    </ListItemIcon>
                    {`구매목록`}
                </MenuItemStyle>
                <Divider />
                <MenuItemStyle onClick={() => {navigate('/profile/my?tab=3')}}>
                    <ListItemIcon>
                        <ShoppingBasketIcon/>
                    </ListItemIcon>
                    {`판매목록`}
                </MenuItemStyle>
                <Divider />
                <MenuItemStyle onClick={() => {navigate('/profile/my?tab=5')}}>
                    <ListItemIcon>
                        <AttachMoneyIcon/>
                    </ListItemIcon>
                    {`수익목록`}
                </MenuItemStyle>
                <Divider />
                <MenuItemStyle
                    onClick={signOut}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="body1">로그아웃</Typography>
                </MenuItemStyle>
            </Menu>
        </Box>
    );
};

export default ProfileMenu;
