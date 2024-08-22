import React, {FC} from "react";
import LinkIcon from "@mui/icons-material/Link";
import {MyPageTabPageBtn} from "../../styles";

interface ReceiptButtonProps {
    receiptUrl: string;
}

const ReceiptButton: FC<ReceiptButtonProps> = ({receiptUrl}) => {
    const handleReceiptBtnClick = (e:any) => {
        e.stopPropagation();
        window.open(receiptUrl);
    }
    return (
        <MyPageTabPageBtn
            onClick={(e) => {handleReceiptBtnClick(e)}}
            startIcon={<LinkIcon />}
            variant='contained'>
            결제 영수증
        </MyPageTabPageBtn>
    );
}

export default ReceiptButton