import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { Box, Card, Typography, Button, Container, useTheme, useMediaQuery } from '@mui/material';
import { Email as EmailIcon, Home as HomeIcon } from '@mui/icons-material';
import MainLayout from '../../layout/MainLayout';

const ResetCompletePage: FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
                            textAlign: 'center',
                        }}
                    >
                        <EmailIcon sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />

                        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                            비밀번호 초기화
                        </Typography>

                        <Typography variant="inherit" paragraph>
                            초기화를 완료하려면 이메일로 전송된 링크를 클릭해주세요.
                        </Typography>

                        <Typography variant="body2" color="textSecondary" paragraph>
                            이메일을 받지 못하셨나요? 스팸 폴더를 확인해보세요.
                        </Typography>

                        <Box mt={4}>
                            <Button
                                component={Link}
                                to="/"
                                variant="contained"
                                color="primary"
                                startIcon={<HomeIcon />}
                                fullWidth={isMobile}
                                size="large"
                            >
                                홈으로 이동
                            </Button>
                        </Box>
                    </Card>
                </Box>
            </Container>
        </MainLayout>
    );
}

export default ResetCompletePage;