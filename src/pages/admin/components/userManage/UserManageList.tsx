import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
	Box,
	List,
	ListItem,
	ListItemText,
	CircularProgress,
	Typography,
	Divider,
	useTheme,
	useMediaQuery,
	Paper
} from '@mui/material';
import UserManageItem from './UserManageItem';
import { apiClient } from '../../../../api/ApiClient';

interface Props {
	children?: React.ReactNode;
}

const UserManageHeader: React.FC = () => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	return (
		<Paper elevation={3} sx={{ mb: 2, backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>
			<ListItem>
				<ListItemText>
					<Box display="flex" justifyContent="space-between" alignItems="center" py={1}>
						{!isMobile && (
							<Typography variant="subtitle1" fontWeight="bold" width="15%" textAlign="center">
								가입일시
							</Typography>
						)}
						<Typography variant="subtitle1" fontWeight="bold" width={isMobile ? "40%" : "25%"} textAlign="center">
							닉네임
						</Typography>
						{!isMobile && (
							<Typography variant="subtitle1" fontWeight="bold" width="35%" textAlign="center">
								이메일
							</Typography>
						)}
						<Typography variant="subtitle1" fontWeight="bold" width={isMobile ? "30%" : "10%"} textAlign="center">
							코인
						</Typography>
						<Typography variant="subtitle1" fontWeight="bold" width={isMobile ? "30%" : "15%"} textAlign="center">
							코인지급
						</Typography>
					</Box>
				</ListItemText>
			</ListItem>
		</Paper>
	);
};

const UserManageList: React.FC<Props> = () => {
	const { isLoading, error, data } = useQuery({
		queryKey: ['admin', 'users'],
		queryFn: () => apiClient.getAllUserManage(),
	});

	if (isLoading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" height="50vh">
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Box textAlign="center" mt={4}>
				<Typography variant="h6" color="error">
					Error: {(error as Error).message}
				</Typography>
			</Box>
		);
	}

	if (!data || data.length === 0) {
		return (
			<Box textAlign="center" mt={4}>
				<Typography variant="h6">No data available</Typography>
			</Box>
		);
	}

	return (
		<Box>
			<UserManageHeader />
			<List component={Paper} elevation={2}>
				{data.map((item, index) => (
					<React.Fragment key={item.id}>
						<UserManageItem item={item} />
						{index < data.length - 1 && <Divider />}
					</React.Fragment>
				))}
			</List>
		</Box>
	);
};

export default UserManageList;