import React, {FC, useCallback} from 'react';
import {useQuery} from '@tanstack/react-query';
import {TableCell, TableRow, Typography, Tooltip} from '@mui/material';
import {useNavigate, useParams} from 'react-router-dom';
import {apiClient} from '../../../../api/ApiClient';
import {REACT_QUERY_KEY} from '../../../../constants/define';
import {PurchaseSaleRes} from "../../../../data/entity/PurchaseSaleRes";
import ReceiptButton from "./ReceiptButton";
import {reformatTime} from "../../../../utils/DayJsHelper";
import CodeDownloadButton from './CodeDownloadButton';

interface Props {
    children?: React.ReactNode;
    purchaseData: PurchaseSaleRes;
}

const PurchaseItem: FC<Props> = ({ purchaseData }) => {
    const { userId } = useParams();
    const { data: codeData } = useQuery({ queryKey: ['codeStore', purchaseData.post_id], queryFn: () => apiClient.getTargetCode(purchaseData.post_id) });
    const navigate = useNavigate();
    const { data: postedUser } = useQuery({
        queryKey: [REACT_QUERY_KEY.user, purchaseData?.sales_user_token, 'nickname'],
        queryFn: () => apiClient.getTargetUser(purchaseData.sales_user_token),
    });

    const {data : bootPayPaymentData, isLoading: isBootpayLoading} = useQuery(
        {
            queryKey: ['/bootpay', purchaseData.bootpay_payment_id],
            queryFn: () => apiClient.getTargetBootpayPayment(purchaseData.bootpay_payment_id),
        }
    );

    const onClickListItem = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if(codeData?.isDeleted){
            window.alert('삭제된 게시글입니다.');
        }else{
            if (purchaseData) {
                navigate(`/code/${codeData?.id}`);
            }
        }
    }, [codeData, navigate, purchaseData]);

    if (!codeData) {
        return null;
    }

    return (
        <TableRow
            hover
            onClick={onClickListItem}
        >
            <TableCell>{reformatTime(bootPayPaymentData?.created_at!)}</TableCell>
            <TableCell>
                <Tooltip title={codeData?.title} placement="top-start">
                    <Typography
                        variant="body2"
                        sx={{
                            maxWidth: 100,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                    >
                        {codeData?.title}
                    </Typography>
                </Tooltip>
            </TableCell>
            <TableCell>{postedUser?.nickname}</TableCell>
            <TableCell>{codeData.price.toLocaleString()}</TableCell>
            <TableCell>{!userId && codeData.postType === 'code' && <CodeDownloadButton repoURL={codeData.adminGitRepoURL} />}</TableCell>
            <TableCell><ReceiptButton receiptUrl={bootPayPaymentData?.receipt_url!}/></TableCell>
        </TableRow>
    );
};

export default PurchaseItem;