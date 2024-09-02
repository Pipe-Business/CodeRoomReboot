import {useQuery} from "@tanstack/react-query";
import {apiClient} from "../../../../api/ApiClient";
import {useQueryUserLogin} from "../../../../hooks/fetcher/UserFetcher";
import {Table, TableContainer} from "@mui/material";
import TableHeader from "../TableHeader";
import React from "react";
import QnAList from "./QnAList";
import ListLoadingSkeleton from "../ListLoadingSkeleton";
import ListEmptyText from "../ListEmptyText";

const QnATabPage = () => {
    const {userLogin} = useQueryUserLogin();
    const {data: commentsData, isLoading: isCommentsLoading} = useQuery({
        queryKey: ['/comments', userLogin?.user_token!],
        queryFn: () => apiClient.fetchMyComments(userLogin!.user_token!),
    });

    if(isCommentsLoading){
        return <ListLoadingSkeleton/>;
    }

    if(commentsData?.length === 0) {
        return <ListEmptyText/>;
    }

    return (
        <TableContainer>
            <Table>
                <TableHeader  headerList={["일시", "작성자","답변자","코드 제목","문의 내용","상태"]}/>
                <QnAList  commentsData={commentsData!}/>
            </Table>
        </TableContainer>
    );
}
export default QnATabPage;