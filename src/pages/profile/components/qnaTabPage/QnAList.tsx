import {FC} from "react";
import {TableBody} from "@mui/material";
import QnAItem from "./QnAItem";
import {CommentEntity} from "../../../../data/entity/CommentEntity";

interface QnAListProps {
    commentsData: CommentEntity[],
}

const QnAList: FC<QnAListProps> = ({commentsData}) => {
    return (
        <TableBody>
            {commentsData && commentsData.map((v, i) => (
                <QnAItem key={i} commentsData={v}/>
            ))}
        </TableBody>

    );
}

export default QnAList;