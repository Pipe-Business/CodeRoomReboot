import React, { FC, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, TextField, Typography, Button, Container, useTheme } from '@mui/material';
import { LockReset as LockResetIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import MainLayout from '../../layout/MainLayout';
import useInput from '../../hooks/UseInput';
import { EMAIL_EXP } from '../../constants/define';
import { apiClient } from '../../api/ApiClient';

const ResetPasswdPage: FC = () => {
    const [inputEmail, onChangeEmail, setInputEmail] = useInput('');
    const inputEmailRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const theme = useTheme();

    const onSubmitEmailForm = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (inputEmail.trim() === '') {
            toast.error('이메일을 입력해주세요');
            inputEmailRef.current?.focus();
            return;
        }
        if (!EMAIL_EXP.test(inputEmail)) {
            toast.error('올바른 이메일 형식이 아닙니다');
            inputEmailRef.current?.focus();
            return;
        }

        try {
            await apiClient.resetPasswordByEmail(inputEmail);
            setInputEmail('');
            navigate('/reset-complete');
        } catch (error) {
            toast.error('비밀번호 초기화 요청 중 오류가 발생했습니다');
        }
    }, [inputEmail, navigate, setInputEmail]);

    return (
        <MainLayout>
            <Container maxWidth="sm">
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    minHeight="80vh"
                >
                    <Card
                        elevation={3}
                        sx={{
                            width: '100%',
                            p: 4,
                            borderRadius: 2,
                        }}
                    >
                        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
                            <LockResetIcon sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
                            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                                비밀번호 초기화
                            </Typography>
                            <Typography variant="body1" color="textSecondary" align="center">
                                비밀번호 초기화가 필요한 이메일을 입력해주세요
                            </Typography>
                        </Box>

                        <form onSubmit={onSubmitEmailForm}>
                            <TextField
                                inputRef={inputEmailRef}
                                value={inputEmail}
                                onChange={onChangeEmail}
                                fullWidth
                                label="이메일"
                                type="email"
                                placeholder="example@email.com"
                                variant="outlined"
                                margin="normal"
                                autoFocus
                                required
                            />
                            <Box mt={3}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    size="large"
                                >
                                    비밀번호 초기화 요청
                                </Button>
                            </Box>
                        </form>
                    </Card>
                </Box>
            </Container>
        </MainLayout>
    );
}

export default ResetPasswdPage;