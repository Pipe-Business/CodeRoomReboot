import {FC} from "react";
import {PurchaseSaleRes} from "../../../../data/entity/PurchaseSaleRes";
import {TableCell, TableRow} from "@mui/material";
import {reformatTime} from "../../../../utils/DayJsHelper";
import {useQuery} from "@tanstack/react-query";
import {apiClient} from "../../../../api/ApiClient";
import {useQueryUserLogin} from "../../../../hooks/fetcher/UserFetcher";
import {REACT_QUERY_KEY} from "../../../../constants/define";
import {CommentEntity} from "../../../../data/entity/CommentEntity";

interface Props {
    commentsData: CommentEntity;
}

const QnAItem: FC<Props> = ({commentsData}) => {
    const {userLogin} = useQueryUserLogin();
    const { data: codeData } = useQuery({ queryKey: ['codeStore', commentsData.post_id], queryFn: () => apiClient.getTargetCode(commentsData.post_id) });
    const { data: questionUser } = useQuery({
        queryKey: [REACT_QUERY_KEY.user, commentsData?.user_token, 'question'],
        queryFn: () => apiClient.getTargetUser(commentsData.user_token),
    });
    const { data: answerUser } = useQuery({
        queryKey: [REACT_QUERY_KEY.user, codeData?.userToken, 'nickname'],
        queryFn: () => apiClient.getTargetUser(codeData?.userToken!),
    });

    const { data: answerNumber } = useQuery({
        queryKey: ['answer',commentsData.id],
        queryFn: () => apiClient.checkHasAnswer(commentsData.id!),
    });

    return (
        <TableRow>
            <TableCell>{reformatTime(commentsData.created_at!)}</TableCell>
            <TableCell>{questionUser?.nickname}</TableCell>
            <TableCell>{answerUser?.nickname}</TableCell>
            <TableCell>{codeData?.title}</TableCell>
            <TableCell>{commentsData.content}</TableCell>
            <TableCell>{answerNumber >0 ? "완료": answerUser?.user_token === userLogin?.user_token ? "답변 하러가기" : "답변 대기"}</TableCell>
        </TableRow>
    );
}

export default QnAItem;