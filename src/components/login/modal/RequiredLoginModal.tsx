import CloseIcon from '@mui/icons-material/Close';
import { Card, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColorButton } from '../../styles';

interface Props {
    children?: React.ReactNode;
    isOpen: boolean,
    onClose: () => void
}

const RequiredLoginModal: FC<Props> = ({ isOpen, onClose }) => {

    const navigate = useNavigate();

    const onClickLogin = () => {
        navigate('/');
    }

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth={'xs'}>
            <DialogTitle  >
                <div style={{ display: 'flex', justifyContent: "space-between", alignItems: 'center' }}>
                    <h4>로그인이 필요한 서비스입니다.</h4>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent>

                <Card style={{ margin: '8px', }} elevation={0}>
                
                    <div style={{height:'100px'}}>
                    코드를 구매하시려면 로그인이 필요합니다.
                    </div>
                <ColorButton sx={{fontSize:'15', width: '194px',}} onClick={onClickLogin}>로그인 하러가기</ColorButton>
                
                </Card>
            </DialogContent>
        </Dialog>
    );
};

export default RequiredLoginModal;