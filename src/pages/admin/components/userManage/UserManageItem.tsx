import React, {FC, useCallback, useState} from 'react';
import {
	ListItem,
	ListItemButton,
	ListItemText,
	Button,
	Typography,
	Box,
	useTheme,
	useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useDialogState from '../../../../hooks/UseDialogState';
import { reformatTime } from '../../../../utils/DayJsHelper';
import { AdminUserManageEntity } from '../../../../data/entity/AdminUserManageEntity';
import PointSendDialog from '../modal/PointSendDialog';
import AdminMessageDialog from './AdminMessageDialog';

interface Props {
	children?: React.ReactNode;
	item: AdminUserManageEntity;
}

const UserManageItem: FC<Props> = ({ item }) => {
	const navigate = useNavigate();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const [isPointDialog, handleOpenPointDialog, handleClosePointDialog] = useDialogState();
	const [isMsgDialog, setIsMsgDialog] = useState(false);

	const onClickItem = useCallback(() => {
		navigate(`/admin/user/${item.user_token}`);
	}, [item, navigate]);

	const handlePointClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		handleOpenPointDialog();
	};

	const handleMessageClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsMsgDialog(true);
	};

	return (
		<>
			<ListItem disablePadding>
				<ListItemButton onClick={onClickItem}>
					<ListItemText>
						<Box display="flex" justifyContent="space-between" alignItems="center">
							{!isMobile && (
								<Typography variant="body2" width="15%" textAlign="center">
									{reformatTime(item.created_at!)}
								</Typography>
							)}
							<Typography variant="body2" width={isMobile ? "40%" : "25%"} textAlign="center">
								{item.nickname}
							</Typography>
							{!isMobile && (
								<Typography variant="body2" width="35%" textAlign="center">
									{item.email}
								</Typography>
							)}
							<Typography variant="body2" width={isMobile ? "30%" : "10%"} textAlign="center">
								{item.point?.toLocaleString()}
							</Typography>
							<Box width={isMobile ? "30%" : "15%"} textAlign="center">
								<Button
									variant="contained"
									size="small"
									onClick={handlePointClick}
									sx={{ fontSize: '0.75rem' }}
								>
									코인 지급
								</Button>
							</Box>
						</Box>
					</ListItemText>
				</ListItemButton>
			</ListItem>
			<PointSendDialog
				isOpen={isPointDialog}
				onClose={handleClosePointDialog}
				userToken={item.user_token!}
				userNickname={item.nickname}
				prevPoint={item.point}
			/>
			<AdminMessageDialog
				open={isMsgDialog}
				title={`${item.nickname}님에게 보내는 쪽지`}
				content=""
				targetUserToken={item.user_token!}
				onClose={() => setIsMsgDialog(false)}
				showReply={true}
			/>
		</>
	);
};

export default UserManageItem;