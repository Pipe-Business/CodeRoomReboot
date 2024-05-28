import React, { FC, useCallback } from 'react';
import { Button } from '@mui/material';
import { ColorButton } from '../styles';
import { useNavigate } from 'react-router-dom';
import { CodeModel } from '../../../data/model/CodeModel';

interface Props {
    children?: React.ReactNode,
    codePost: CodeModel,
}


const EditCodeButton: FC<Props> = ({ codePost }) => {
    const navigate = useNavigate();


    const onClickEdit = useCallback(() => {
        navigate(`/code/edit/${codePost.id}`);
    }, [codePost.id]);


    return (
        <div>
            <ColorButton onClick={onClickEdit} variant='contained' sx={{ fontSize: '15', width: '210px' }}>
                글 수정하기
            </ColorButton>
        </div>
    );
};
export default EditCodeButton;