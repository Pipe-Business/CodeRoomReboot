import React, {FC, useCallback} from 'react';
import {Button, TableCell, TableRow} from '@mui/material';
import {useQuery} from '@tanstack/react-query';
import {useNavigate} from 'react-router-dom';
import {apiClient} from '../../../../api/ApiClient';
import {reformatTime} from '../../../../utils/DayJsHelper';
import {PostStateType} from "../../../../enums/PostStateType";
import {CodeModel} from "../../../../data/model/CodeModel";

interface Props {
    codeData: CodeModel;
}

const SaleItem: FC<Props> = ({codeData}) => {
    const navigate = useNavigate();

    const onClickListItem = useCallback((e: any) => {
        e.stopPropagation();
        if (codeData?.isDeleted) {
            window.alert('삭제된 게시글입니다.');
        } else {
            if (codeData) {
                navigate(`/code/${codeData?.id}`);
            }
        }
    }, [codeData?.id]);

    const onClickNavigateRejectForm = () => {
        navigate('/create/code/codesubmission');
    }

    if (!codeData?.id) {
        return <></>;
    }
    return (
        <TableRow
            hover
            onClick={onClickListItem}
        >
            <TableCell> {reformatTime(codeData?.createdAt!)}</TableCell>
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