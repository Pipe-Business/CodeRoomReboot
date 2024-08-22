import {useQuery} from "@tanstack/react-query";
import {apiClient} from "../../../../api/ApiClient";
import {useQueryUserLogin} from "../../../../hooks/fetcher/UserFetcher";
import {Table, TableContainer} from "@mui/material";
import TableHeader from "../TableHeader";
import React from "react";
import QnAList from "./QnAList";
import ListLoadingSkeleton from "../ListLoadingSkeleton";

const QnATabPage = () => {
    const {userLogin} = useQueryUserLogin();
    const {data: commentsData, isLoading: isCommentsLoading} = useQuery({
        queryKey: ['/comments', userLogin?.user_token!],
        queryFn: () => apiClient.fetchMyComments(userLogin!.user_token!),
    });

    if(isCommentsLoading){
        return <ListLoadingSkeleton/>;
    }

    return (
        <TableContainer>
            <Table>
                <TableHeader  headerList={["문의 일시", "문의 작성자","문의 답변자","코드 제목","문의 내용","답변 (답변 대기, 답변 완료)"]}/>
                <QnAList  commentsData={commentsData!}/>
            </Table>
        </TableContainer>
    );
}
export default QnATabPage;