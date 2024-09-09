import React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../../api/ApiClient";
import { useQueryUserLogin } from "../../../../hooks/fetcher/UserFetcher";
import { Box, Paper, Table, TableContainer, Typography } from "@mui/material";
import TableHeader from "../TableHeader";
import QnAList from "./QnAList";
import ListLoadingSkeleton from "../ListLoadingSkeleton";
import ListEmptyText from "../ListEmptyText";

const QnATabPage = () => {
    const { userLogin } = useQueryUserLogin();
    const { data: commentsData, isLoading: isCommentsLoading } = useQuery({
        queryKey: ['/comments', userLogin?.user_token!],
        queryFn: () => apiClient.fetchMyComments(userLogin!.user_token!),
    });

    if (isCommentsLoading) {
        return <ListLoadingSkeleton />;
    }

    if (commentsData?.length === 0) {
        return <ListEmptyText />;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Q&A 목록
            </Typography>
            <Paper elevation={3} sx={{ mb: 4 }}>
                <TableContainer>
                    <Table>
                        <TableHeader headerList={["일시", "작성자", "답변자", "코드 제목", "문의 내용", "상태"]} />
                        <QnAList commentsData={commentsData!} />
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}

export default QnATabPage;