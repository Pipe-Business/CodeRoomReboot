import React, {FC, useCallback, useState} from 'react';
import {IconButton, Menu, MenuItem, TableCell, TableRow} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {useNavigate} from 'react-router-dom';
import {reformatTime} from '../../../../utils/DayJsHelper';
import {CodeModel} from "../../../../data/model/CodeModel";
import DeleteModal from "../../../codeInfo/components/DeleteModal";
import {useQueryUserLogin} from "../../../../hooks/fetcher/UserFetcher";
import {useRecoilState} from "recoil";
import {codeInfo} from "../../../createCode/createCodeAtom";

interface Props {
    codeData: CodeModel;
}

const SaleItem: FC<Props> = ({codeData}) => {

    const {isLoadingUserLogin, userLogin} = useQueryUserLogin();
    const [codeModel, setCodeInfo] = useRecoilState(codeInfo);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const navigate = useNavigate();
    const handleOpenDeleteModal = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setOpenDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
    };

    const onClickRequestReexamination = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setCodeInfo(codeData);
        navigate('/create/code/codesubmission', {state: {isReexamination: true}});
    }, [codeData, navigate, setCodeInfo]);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(null);
    };


    const getStatusColor = (state: string) => {
        switch (state) {
            case 'approve':
                return 'green';
            case 'rejected':
                return 'red';
            case 'pending':
                return 'darkslategray';
            case 'deleted':
                return 'grey';
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
            case 'deleted':
                return '삭제됨';
            default:
                return '';
        }
    };

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


    if (!codeData?.id) {
        return <></>;
    }
    return (
        <>
            <TableRow hover onClick={onClickListItem}>
                <TableCell>{reformatTime(codeData?.createdAt!)}</TableCell>
                <TableCell>{codeData?.title!}</TableCell>
                <TableCell style={{color: getStatusColor(codeData?.state)}}>
                    {getStatusText(codeData?.state)}
                </TableCell>
                <TableCell>
                    {(codeData?.state === 'approve' || codeData?.state === 'rejected') &&
                        <IconButton onClick={handleMenuOpen}>
                            <MoreVertIcon/>
                        </IconButton>}
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={(e) => {
                            handleMenuClose(e);
                            handleOpenDeleteModal(e);
                        }}>
                            코드 템플릿 삭제
                        </MenuItem>
                        {codeData?.state === 'rejected' && (
                            <MenuItem onClick={(e) => { handleMenuClose(e); onClickRequestReexamination(e); }}>
                                재심사 요청
                            </MenuItem>
                        )}
                    </Menu>
                </TableCell>
            </TableRow>
            <DeleteModal
                open={openDeleteModal}
                onClose={handleCloseDeleteModal}
                codePost={codeData}
            />
        </>
    );
};
export default SaleItem;