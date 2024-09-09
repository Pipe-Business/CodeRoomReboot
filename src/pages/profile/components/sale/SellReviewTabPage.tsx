import React, { FC } from 'react';
import { Box, Paper, Table, TableContainer, Typography } from '@mui/material';
import { apiClient } from "../../../../api/ApiClient";
import { useQueryUserLogin } from "../../../../hooks/fetcher/UserFetcher";
import { useQuery } from "@tanstack/react-query";
import TableHeader from "../TableHeader";
import SaleList from "./SaleList";
import ListLoadingSkeleton from "../ListLoadingSkeleton";
import ListEmptyText from "../ListEmptyText";
import { REACT_QUERY_KEY } from "../../../../constants/define";

// 마이페이지 -> 판매 목록 탭
const MySellReviewTabPage: FC = () => {
	const { userLogin } = useQueryUserLogin();
	const { data: codeData, isLoading: isCodeDataLoading } = useQuery({
		queryKey: [REACT_QUERY_KEY.code, userLogin?.user_token!],
		queryFn: () => apiClient.getAllMyCode(userLogin?.user_token!),
	});

	if (isCodeDataLoading) {
		return <ListLoadingSkeleton />;
	}

	if (codeData?.length === 0) {
		return <ListEmptyText />;
	}

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h6" gutterBottom>
				판매 목록
			</Typography>
			<Paper elevation={3}>
				<TableContainer>
					<Table>
						<TableHeader headerList={["요청시간", "코드제목", "심사상태", ""]} />
						<SaleList codeData={codeData} />
					</Table>
				</TableContainer>
			</Paper>
		</Box>
	);
};

export default MySellReviewTabPage;