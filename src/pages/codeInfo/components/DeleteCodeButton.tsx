import React, { FC, useCallback } from 'react';
import { Button } from '@mui/material';
import { ColorButton } from '../styles';
import { useNavigate } from 'react-router-dom';
import { CodeModel } from '../../../data/model/CodeModel';
import { apiClient } from '../../../api/ApiClient';
import DeleteModal from './DeleteModal';
import useDialogState from '../../../hooks/useDialogState';

interface Props {
    children?: React.ReactNode,
    codePost: CodeModel,
}


const DeleteCodeButton: FC<Props> = ({ codePost }) => {

	const [openDeleteModal, onOpenAcceptModal, onCloseDeleteModal] = useDialogState();

    return (
        <div>
            <ColorButton onClick={onOpenAcceptModal} variant='contained' sx={{ fontSize: '15', width: '210px' }}>
                글 삭제하기
            </ColorButton>
            <DeleteModal open={openDeleteModal} onClose={onCloseDeleteModal}codePost={codePost} />
        </div>
    );
};
export default DeleteCodeButton;