import React, {FC} from 'react';
import {ColorButton} from '../styles';
import {CodeModel} from '../../../data/model/CodeModel';
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