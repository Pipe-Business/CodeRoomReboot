import React, { FC, useCallback } from 'react';
import {Avatar, Box, Chip, ListItem, ListItemButton, ListItemText, Typography, useTheme} from '@mui/material';
import {reformatTime} from "../../../../utils/DayJsHelper";
import { useNavigate } from 'react-router-dom';
import {CodeModel} from "../../../../data/model/CodeModel";
import {useQueryUserById} from "../../../../hooks/fetcher/UserFetcher";
import {PostStateType} from "../../../../enums/PostStateType";

interface AdminCodeRequestItemProps {
	item: CodeModel;
}

const AdminCodeRequestItem: FC<AdminCodeRequestItemProps> = ({ item }) => {
	const { userById } = useQueryUserById(item.userToken);
	const navigate = useNavigate();
	const theme = useTheme();

	const handleClick = () => {
		navigate(`/admin/codeRequest/${item.userToken}/${item.id}`);
	};

	const getStatusColor = (state: string) => {
		switch (state) {
			case 'pending':
				return theme.palette.warning.main;
			case 'rejected':
				return theme.palette.error.main;
			case 'approve':
				return theme.palette.success.main;
			default:
				return theme.palette.info.main;
		}
	};

	return (
		<ListItemButton onClick={handleClick}>
			<ListItem>
				<ListItemText>
					<Box display="flex" justifyContent="space-between" alignItems="center">
						<Typography variant="body2" sx={{ width: '15%' }}>{reformatTime(item.createdAt)}</Typography>
						<Box sx={{ width: '30%', display: 'flex', alignItems: 'center' }}>
							<Avatar src={userById?.profile_url} alt={userById?.nickname} sx={{ width: 40, height: 40, mr: 1 }} />
							<Box>
								<Typography variant="body2">{userById?.nickname}</Typography>
								<Typography variant="caption" color="textSecondary">{userById?.email}</Typography>
							</Box>
						</Box>
						<Box sx={{ width: '35%' }}>
							<Typography variant="body2">{item.title}</Typography>
							<Typography variant="caption" color="textSecondary">{userById?.nickname}</Typography>
						</Box>
						<Typography variant="body2" sx={{ width: '15%' }}>{item.price.toLocaleString()}p</Typography>
						<Chip
							label={item.state === PostStateType.pending ? '요청' : item.state === PostStateType.rejected ? '반려' : '승인'}
							size="small"
							sx={{
								width: '5%',
								backgroundColor: getStatusColor(item.state),
								color: theme.palette.getContrastText(getStatusColor(item.state))
							}}
						/>
					</Box>
				</ListItemText>
			</ListItem>
		</ListItemButton>
	);
};

export default AdminCodeRequestItem;