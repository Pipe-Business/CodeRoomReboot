import React, {FC, useCallback} from 'react';
import {Button, TableCell, TableRow} from '@mui/material';
import {useQuery} from '@tanstack/react-query';
import {useNavigate} from 'react-router-dom';
import {apiClient} from '../../../../api/ApiClient';
import {reformatTime} from '../../../../utils/DayJsHelper';
import {PurchaseSaleRes} from "../../../../data/entity/PurchaseSaleRes";
import {PostStateType} from "../../../../enums/PostStateType";

interface Props {
    saleItem: PurchaseSaleRes;
}

const SaleItem: FC<Props> = ({saleItem}) => {
    const navigate = useNavigate();

    const {data: codeData, isLoading} = useQuery({
        queryKey: ['codeStore', saleItem.post_id],
        queryFn: () => apiClient.getTargetCode(saleItem.post_id)
    });
    const onClickListItem = useCallback((e: any) => {
        e.stopPropagation();
        if (codeData?.isDeleted) {
            window.alert('삭제된 게시글입니다.');
        } else {
            if (saleItem) {
                navigate(`/code/${saleItem?.post_id}`);
            }
        }
    }, [saleItem?.post_id]);

    const onClickNavigateRejectForm = () => {
        navigate('/create/code/codesubmission');
    }

    if (!saleItem?.post_id || isLoading) {
        return <></>;
    }
    return (
        <TableRow
            hover
            onClick={onClickListItem}
        >
            <TableCell> {reformatTime(saleItem?.created_at!)}</TableCell>
            <TableCell>{codeData?.title!}</TableCell>
            <TableCell>{codeData?.state === PostStateType.pending ? '심사중' : codeData?.state === PostStateType.approve ? '승인' : '반려'}</TableCell>
            <TableCell>{(codeData?.state === PostStateType.rejected || codeData?.state === PostStateType.approve) &&
                <Button onClick={() => onClickNavigateRejectForm()}>
                    수정 및 재심사
                </Button>}</TableCell>
        </TableRow>
    );
};
export default SaleItem;