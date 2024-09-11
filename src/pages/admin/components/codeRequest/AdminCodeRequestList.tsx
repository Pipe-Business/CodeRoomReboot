import React, {FC} from 'react';
import {Box, CircularProgress, Divider, List, ListItem, ListItemText, Paper, Typography, useTheme} from '@mui/material';
import {useQuery} from '@tanstack/react-query';
import {apiClient} from "../../../../api/ApiClient";
import {PostStateType} from "../../../../enums/PostStateType";
import AdminCodeRequestItem from "./AdminCodeRequestItem";

// AdminCodeRequestList Component
interface AdminCodeRequestListProps {
	type: PostStateType.pending | PostStateType.rejected | PostStateType.approve;
}

const AdminCodeRequestList: FC<AdminCodeRequestListProps> = ({ type }) => {
	const theme = useTheme();
	const { isLoading, data } = useQuery({
		queryKey: ['codeRequest', 'admin', type],
		queryFn: () => apiClient.getAllPendingCode(type)
	});

	if (isLoading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" height="200px">
				<CircularProgress />
			</Box>
		);
	}

	if (!data || data.length === 0) {
		return (
			<Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
				<Typography variant="h6">No requests found</Typography>
			</Paper>
		);
	}

	return (
		<Paper elevation={3}>
			<List>
				<ListItem sx={{ backgroundColor: theme.palette.grey[100] }}>
					<ListItemText>
						<Box display="flex" justifyContent="space-between" fontWeight="bold">
							<Typography variant="subtitle1" sx={{ width: '15%' }}>
								{type === PostStateType.pending ? '요청' : type === PostStateType.rejected ? '반려' : '승인'}일시
							</Typography>
							<Typography variant="subtitle1" sx={{ width: '30%' }}>게시자</Typography>
							<Typography variant="subtitle1" sx={{ width: '35%' }}>코드제목</Typography>
							<Typography variant="subtitle1" sx={{ width: '15%' }}>캐시</Typography>
							<Typography variant="subtitle1" sx={{ width: '5%' }}>상태</Typography>
						</Box>
					</ListItemText>
				</ListItem>
				<Divider />
				{data.map((item) => (
					item.state === type && (
						<React.Fragment key={item.id}>
							<AdminCodeRequestItem item={item} />
							<Divider />
						</React.Fragment>
					)
				))}
			</List>
		</Paper>
	);
};

export default AdminCodeRequestList;