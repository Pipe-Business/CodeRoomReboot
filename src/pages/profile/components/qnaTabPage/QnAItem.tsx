import React, {FC, useEffect, useMemo, useState} from "react";
import {PurchaseSaleRes} from "../../../../data/entity/PurchaseSaleRes";
import {TableCell, TableRow, Tooltip} from "@mui/material";
import {reformatTime} from "../../../../utils/DayJsHelper";
import {useQuery} from "@tanstack/react-query";
import {apiClient} from "../../../../api/ApiClient";
import {useQueryUserLogin} from "../../../../hooks/fetcher/UserFetcher";
import {REACT_QUERY_KEY} from "../../../../constants/define";
import {CommentEntity} from "../../../../data/entity/CommentEntity";
import {useNavigate} from "react-router-dom";

interface Props {
    commentsData: CommentEntity;
}

const QnAItem: FC<Props> = ({commentsData}) => {
    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    };

    const cellStyle = {
        maxWidth: '200px',
        whiteSpace: 'nowrap' as const,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    };

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

    const { data: hasAnswer } = useQuery({
        queryKey: ['answer',commentsData.id],
        queryFn: () => apiClient.checkHasAnswer(commentsData.id!),
    });

    const [answerStatus, setAnswerStatus] = useState<string>();
    const navigator = useNavigate();

    const makeAnswerStatusComponent = useMemo(() => {
        if(hasAnswer){
            return <TableCell style={{color: 'green'}}>{"답변 완료"}</TableCell>;
        }else{
            if(answerUser?.user_token! === userLogin?.user_token!) {
                return(
                    <TableCell
                    sx={{cursor: 'pointer', color:'blue'}}
                        onClick={() => {
                    navigator(`/code/${codeData?.id}`);
                }}>
                    {"답변 작성"}</TableCell>
                );
            }else{
                return <TableCell style={{color: 'darkslategray'}}>{"답변 대기"}</TableCell>;
            }
        }
    }, [hasAnswer,answerUser]);

    return (
        <TableRow>
            <TableCell>{reformatTime(commentsData.created_at!)}</TableCell>
            <TableCell>{questionUser?.nickname}</TableCell>
            <TableCell>{answerUser?.nickname}</TableCell>
            <Tooltip title={codeData?.title || ''}>
                <TableCell style={cellStyle}>
                    {truncateText(codeData?.title || '', 10)}
                </TableCell>
            </Tooltip>
            <Tooltip title={commentsData.content}>
                <TableCell style={cellStyle}>
                    {truncateText(commentsData.content, 10)}
                </TableCell>
            </Tooltip>
            {makeAnswerStatusComponent}
        </TableRow>
    );
}

export default QnAItem;