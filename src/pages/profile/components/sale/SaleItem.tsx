import React, {FC, useCallback, useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TableCell,
    TableRow
} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {reformatTime} from '../../../../utils/DayJsHelper';
import {PostStateType} from "../../../../enums/PostStateType";
import {CodeModel} from "../../../../data/model/CodeModel";
import {useRecoilState} from "recoil";
import {codeInfo} from "../../../createCode/createCodeAtom";
import {apiClient} from "../../../../api/ApiClient";
import {CodeEditRequestEntity} from "../../../../data/entity/CodeEditRequestEntity";

interface Props {
    codeData: CodeModel;
}

const SaleItem: FC<Props> = ({codeData}) => {

    const getStatusColor = (state: string) => {
        switch (state) {
            case 'approve':
                return 'green';
            case 'rejected':
                return 'red';
            case 'pending':
                return 'orange';
            default:
                return 'inherit';
        }
    };

    const getStatusText = (state: string) => {
        switch (state) {
            case 'approve':
                return '승인됨';
            case 'rejected':
                return '반려됨';
            case 'pending':
                return '심사중';
            default:
                return '';
        }
    };

    const [codeModel, setCodeInfo] = useRecoilState(codeInfo);
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = useState(false);

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

    const onClickNavigateModifyForm = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setCodeInfo(codeData);
        navigate('/create/code/codesubmission', {state: {isEdit: true}});
    }, [codeData, navigate, setCodeInfo]);

    const onClickRequestReexamination = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setCodeInfo(codeData);
        navigate('/create/code/codesubmission', {state: {isReexamination: true}});
    }, [codeData, navigate, setCodeInfo]);

    const handleOpenDialog = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenDialog(true);
    }, []);

    const handleCloseDialog = useCallback(() => {
        setOpenDialog(false);
    }, []);

    const handleConfirmCodeUpdate = useCallback(async () => {
        console.log("코드 갱신 요청 처리");

        try {
            const codeEditRequest: CodeEditRequestEntity = {
                post_id: codeData!.id,
                title: codeData?.title!,
                category: codeData?.category!,
                price: codeData?.price!,
                language: codeData?.language!,
                ai_summary: codeData?.aiSummary!,
                description: codeData?.description!,
                state: PostStateType.pending,
            };
            await apiClient.updatePostData(codeEditRequest);

            // API 호출이 성공적으로 완료된 후 페이지를 새로고침합니다.
            window.location.reload();
        } catch (error) {
            console.log(error);
            // 에러가 발생한 경우에도 다이얼로그를 닫습니다.
            handleCloseDialog();
        }
    }, [codeData, handleCloseDialog]);


    if (!codeData?.id) {
        return <></>;
    }
    return (
        <>
            <TableRow
                hover
                onClick={onClickListItem}
            >
                <TableCell>{reformatTime(codeData?.createdAt!)}</TableCell>
                <TableCell>{codeData?.title!}</TableCell>
                <TableCell style={{color: getStatusColor(codeData?.state)}}>
                    {getStatusText(codeData?.state)}
                </TableCell>
                <TableCell>{(codeData?.state === 'approve') &&
                    <Button onClick={onClickNavigateModifyForm}>
                        게시글 수정
                    </Button>}

                    {(codeData?.state === 'rejected') &&
                        <Button onClick={onClickRequestReexamination}>
                            재심사 요청
                        </Button>}
                </TableCell>
                <TableCell>{(codeData?.state === 'approve') &&
                    <Button onClick={handleOpenDialog}>
                        코드 갱신 요청
                    </Button>}
                </TableCell>
            </TableRow>
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"코드 갱신 요청"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        코드 갱신 요청을 진행하시겠습니까?
                    </DialogContentText>
                    <DialogContentText id="alert-dialog-description">
                        (요청 시 심사중 상태로 변경됩니다)
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>아니오</Button>
                    <Button onClick={handleConfirmCodeUpdate} autoFocus>
                        예
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
export default SaleItem;