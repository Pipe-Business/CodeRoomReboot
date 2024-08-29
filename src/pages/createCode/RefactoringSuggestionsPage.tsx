import React, { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Typography,
    Paper,
    Container,
    Divider,
    Chip,
    ThemeProvider,
    createTheme,
} from '@mui/material';
import { ArrowBack, Code } from '@mui/icons-material';
import MainLayout from "../../layout/MainLayout";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

const CodeReviewFeedback: FC<{ feedback: string }> = ({ feedback }) => (
    <Paper elevation={3} sx={{ mt: 4, p: 3, backgroundColor: '#f5f5f5' }}>
        <Typography variant="h6" gutterBottom>
            <Code sx={{ mr: 1, verticalAlign: 'middle' }} />
            AI 루미의 코드리뷰 피드백
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ mt: 2, maxHeight: '500px', overflowY: 'auto' }}>
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {feedback}
            </ReactMarkdown>
        </Box>
    </Paper>
);

const RefactoringSuggestionPage: FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { refactoredResult } = location.state;

    const goToCreateCode = () => {
        navigate('/create/code/codesubmission');
    };

    return (
        <ThemeProvider theme={theme}>
            <MainLayout>
                <Container maxWidth="lg">
                    <Box sx={{ py: 4 }}>
                        <Button
                            startIcon={<ArrowBack />}
                            onClick={() => navigate(-1)}
                            variant="outlined"
                            sx={{ mb: 3 }}
                        >
                            뒤로가기
                        </Button>
                        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
                            코드 최적화 제안
                        </Typography>
                        <Paper elevation={1} sx={{ p: 3, mb: 4, backgroundColor: '#e3f2fd' }}>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                다음과 같은 방식으로 코드 최적화를 제안드립니다.
                            </Typography>
                            <Typography variant="body1" sx={{ }}>
                                <Chip label="선택사항" color="primary" size="small" /> 코드를 수정하여 다시 커밋해주세요.
                            </Typography>
                        </Paper>

                        {refactoredResult && (
                            <CodeReviewFeedback feedback={refactoredResult} />
                        )}

                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={goToCreateCode}
                                startIcon={<Code />}
                            >
                                추가 정보 작성하고 코드 올리기
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </MainLayout>
        </ThemeProvider>
    );
};

export default RefactoringSuggestionPage;