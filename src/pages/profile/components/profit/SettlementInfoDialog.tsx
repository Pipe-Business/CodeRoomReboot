import React, {useEffect, useState} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    TextField,
    Button,
    IconButton,
    Box,
    Divider,
    Grid
} from '@mui/material';
import { Close as CloseIcon, Edit as EditIcon } from '@mui/icons-material';

export interface UserBankAccountEntity {
    id?: number;
    user_token: string;
    name: string;
    bank: string;
    account_number: string;
    copy_of_bank_statement_img_url: string|null;
    created_at?: number;
}

interface SettlementInfoDialogProps {
    open: boolean;
    onClose: () => void;
    userBankAccount: UserBankAccountEntity | null;
    onSave: (updatedInfo: UserBankAccountEntity & { file?: File }) => void;
}

// 정산 정보 화면
const SettlementInfoDialog: React.FC<SettlementInfoDialogProps> = ({ open, onClose, userBankAccount, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(userBankAccount?.name || '');
    const [bank, setBank] = useState(userBankAccount?.bank || '');
    const [accountNumber, setAccountNumber] = useState(userBankAccount?.account_number || '');
    const [image, setImage] = useState<string | null>(userBankAccount?.copy_of_bank_statement_img_url || null);
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (userBankAccount) {
            setName(userBankAccount.name);
            setBank(userBankAccount.bank);
            setAccountNumber(userBankAccount.account_number);
            setImage(userBankAccount.copy_of_bank_statement_img_url);
        }
    }, [userBankAccount]);

    const handleSave = () => {
        onSave({
            ...userBankAccount!,
            name,
            bank,
            account_number: accountNumber,
            copy_of_bank_statement_img_url: image,
            file: file || undefined
        });
        setIsEditing(false);
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFile(file);
            const reader = new FileReader();
            reader.onload = (e) => setImage(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">나의 정산 정보</Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" style={{fontWeight:"bold"}} gutterBottom>
                            예금주명
                        </Typography>
                        {isEditing ? (
                            <TextField
                                fullWidth
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                variant="outlined"
                                size="small"
                            />
                        ) : (
                            <Typography>{name}</Typography>
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom style={{fontWeight:"bold"}}>
                            은행
                        </Typography>
                        {isEditing ? (
                            <TextField
                                fullWidth
                                value={bank}
                                onChange={(e) => setBank(e.target.value)}
                                variant="outlined"
                                size="small"
                            />
                        ) : (
                            <Typography>{bank}</Typography>
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" style={{fontWeight:"bold"}} gutterBottom>
                            계좌번호
                        </Typography>
                        {isEditing ? (
                            <TextField
                                fullWidth
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                variant="outlined"
                                size="small"
                            />
                        ) : (
                            <Typography>{accountNumber}</Typography>
                        )}
                    </Grid>
                    {isEditing && (
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                                통장 사본 이미지
                            </Typography>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                                id="image-upload"
                            />
                            <label htmlFor="image-upload">
                                <Button variant="outlined" component="span">
                                    이미지 업로드
                                </Button>
                            </label>
                            {image && (
                                <Box mt={2}>
                                    <img src={image} alt="통장 사본" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                                </Box>
                            )}
                        </Grid>
                    )}
                </Grid>
                <Box mt={3}>
                    <Divider />
                    <Box mt={2}>
                        <Typography variant="body2" color="textSecondary">
                            수익금은 매달 17일에 입금됩니다. 17일이 영업일이 아닌 경우 다음 영업일에 입금됩니다.
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                {isEditing ? (
                    <>
                        <Button onClick={() => setIsEditing(false)} color="primary">
                            취소
                        </Button>
                        <Button onClick={handleSave} color="primary" variant="contained">
                            저장
                        </Button>
                    </>
                ) : (
                    <Box width={'100%'} height={'70px'}>
                        <Button
                            fullWidth={true}
                            sx={{height:'70px', fontSize: '20px'}}
                            onClick={() => setIsEditing(true)}
                            color="primary"
                            variant="contained"
                            startIcon={<EditIcon />}
                        >
                            정산정보 수정
                        </Button>
                    </Box>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default SettlementInfoDialog;