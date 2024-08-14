import React, {FC} from 'react';
import {ColorButton} from '../styles';
import {CodeModel} from '../../../data/model/CodeModel';
import DeleteModal from './DeleteModal';
import useDialogState from '../../../hooks/UseDialogState';

interface Props {
    children?: React.ReactNode,
    codePost: CodeModel,
}


const DeleteCodeButton: FC<Props> = ({ codePost }) => {

	const [openDeleteModal, onOpenAcceptModal, onCloseDeleteModal] = useDialogState();

    return (
        <div>
            <ColorButton onClick={onOpenAcceptModal} variant='contained' sx={{ fontSize: '20px', width: '210px', fontWeight: 'bold', backgroundColor: '#ee3b3b' }}>
                코드 템플릿 삭제
            </ColorButton>
            <DeleteModal open={openDeleteModal} onClose={onCloseDeleteModal} codePost={codePost} />
        </div>
    );
};
export default DeleteCodeButton;