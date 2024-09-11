import React, { FC, useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import {
    Typography, Box, Button, CircularProgress, List, ListItem, IconButton, Snackbar,
    Card, CardContent, Divider, Chip, useTheme, Grid
} from '@mui/material';
import {
    ArrowBack, ContentCopy, GitHub, Person, Code, Assessment
} from '@mui/icons-material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AdminLayout from '../../layout/AdminLayout';
import useRepoFiles from "./hooks/useRepoFiles";
import { apiClient } from "../../api/ApiClient";

interface LocationState {
    githubRepoUrl?: string;
    sellerGithubName?: string;
}

const getLanguageFromFilename = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase();
    const languageMap: { [key: string]: string } = {
        'js': 'javascript',
        'ts': 'typescript',
        'py': 'python',
        'java': 'java',
        'c': 'c',
        'cpp': 'cpp',
        'cs': 'csharp',
        'html': 'html',
        'css': 'css',
        'json': 'json',
        'md': 'markdown',
        'tsx': 'typescript',
        'jsx': 'javascript',
        'php': 'php',
        'rb': 'ruby',
        'go': 'go',
        'rs': 'rust',
        'swift': 'swift',
        'kt': 'kotlin',
        'scala': 'scala',
        'sql': 'sql',
        'sh': 'bash',
        'yml': 'yaml',
        'yaml': 'yaml',
        'xml': 'xml',
        'dart': 'dart',
        'dockerfile': 'dockerfile',
        // 필요에 따라 더 많은 매핑을 추가할 수 있습니다.
    };
    return languageMap[extension || ''] || 'text';
};

const SmartAnalysis: FC = () => {
    const theme = useTheme();
    const location = useLocation();
    const { userId, codeId } = useParams();
    const navigate = useNavigate();
    const { githubRepoUrl, sellerGithubName } = location.state as LocationState;

    const { files, loading, error, totalCodeFiles } = useRepoFiles(
        sellerGithubName || '',
        githubRepoUrl || ''
    );

    const [gptResultData, setGptResultData] = useState<any>(null);
    const [gptLoading, setGptLoading] = useState<boolean>(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setSnackbarOpen(true);
        });
    };

    useEffect(() => {
        const fetchGptAnalysis = async () => {
            if (files && files.length > 0) {
                const contents = files.map((file) => file.content);
                const parsedFileContents = JSON.stringify(contents);
                setGptLoading(true);
                try {
                    const response = await apiClient.makeCodeAnalysisAdminByGPT(parsedFileContents);
                    setGptResultData(response);
                } catch (error) {
                    console.error('GPT 분석 답변 생성 오류:', error);
                } finally {
                    setGptLoading(false);
                }
            }
        };

        fetchGptAnalysis();
    }, [files]);

    if (!githubRepoUrl || !sellerGithubName) {
        return (
            <AdminLayout>
                <Box sx={{ padding: 3 }}>
                    <Typography variant="h6">Error: Missing required data</Typography>
                    <Button onClick={() => navigate(-1)}>Go Back</Button>
                </Box>
            </AdminLayout>
        );
    }

    const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const renderGptAnalysis = () => {
        if (gptLoading) {
            return (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: 4
                }}>
                    <CircularProgress sx={{ mb: 2 }} />
                    <Typography variant="h6">
                        코드 파일 가져오기 완료, 분석 결과 생성 중...
                    </Typography>
                </Box>
            );
        }

        if (!gptResultData) return null;

        return (
            <Box sx={{ mt: 4, width: '100%' }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: theme.palette.primary.main }}>
                    프로젝트 코드 분석 결과
                </Typography>
                {Object.entries(gptResultData).map(([key, value]) => (
                    <Card elevation={3} sx={{ mb: 3 }} key={key}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{key}</Typography>
                                <IconButton onClick={() => copyToClipboard(`## ${key}\n\n${value}`)}>
                                    <ContentCopy />
                                </IconButton>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            <Box sx={{ backgroundColor: theme.palette.grey[100], p: 2, borderRadius: 1 }}>
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        code({node, inline, className, children, ...props}) {
                                            const match = /language-(\w+)/.exec(className || '');
                                            const language = match ? match[1] : getLanguageFromFilename(key);
                                            return !inline ? (
                                                <SyntaxHighlighter
                                                    style={vscDarkPlus}
                                                    language={language}
                                                    PreTag="div"
                                                    {...props}
                                                >
                                                    {String(children).replace(/\n$/, '')}
                                                </SyntaxHighlighter>
                                            ) : (
                                                <code className={className} {...props}>
                                                    {children}
                                                </code>
                                            )
                                        }
                                    }}
                                >
                                    {value as string}
                                </ReactMarkdown>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        );
    };

    return (
        <AdminLayout>
            <Box sx={{ padding: 3 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate(-1)}
                    variant="outlined"
                    sx={{ mb: 3 }}
                >
                    코드 요청으로 돌아가기
                </Button>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: theme.palette.primary.main }}>
                    스마트 코드 분석
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                        <Card elevation={3}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <GitHub sx={{ mr: 1, color: theme.palette.secondary.main }} />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>리포지토리 정보</Typography>
                                </Box>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    <strong>URL:</strong> {githubRepoUrl}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>판매자 GitHub:</strong> {sellerGithubName}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card elevation={3}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Person sx={{ mr: 1, color: theme.palette.secondary.main }} />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>사용자 정보</Typography>
                                </Box>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    <strong>User ID:</strong> {userId}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Code ID:</strong> {codeId}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {loading && (
                    <Card elevation={3} sx={{ mt: 4, p: 3 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <CircularProgress size={60} thickness={5} sx={{ mb: 2 }} />
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                {`${totalCodeFiles} 개의 코드 파일 분석 중`}
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 1, color: theme.palette.text.secondary }}>
                                잠시만 기다려주세요...
                            </Typography>
                        </Box>
                    </Card>
                )}

                {error && (
                    <Card elevation={3} sx={{ mt: 4, p: 3, backgroundColor: theme.palette.error.light }}>
                        <Typography color="error" variant="h6" sx={{ fontWeight: 'bold' }}>
                            오류 발생
                        </Typography>
                        <Typography color="error" sx={{ mt: 1 }}>
                            {error}
                        </Typography>
                    </Card>
                )}

                {renderGptAnalysis()}

                {files.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: theme.palette.primary.main }}>
                            코드 파일 목록
                        </Typography>
                        <List>
                            {files.map((file) => (
                                <ListItem key={file.path} sx={{ mb: 3, p: 0 }}>
                                    <Card elevation={3} sx={{ width: '100%' }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{file.name}</Typography>
                                                <Chip
                                                    icon={<Code />}
                                                    label={getLanguageFromFilename(file.name)}
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            </Box>
                                            {file.content && (
                                                <Box sx={{ mt: 1, width: '100%' }}>
                                                    <SyntaxHighlighter
                                                        style={vscDarkPlus}
                                                        language={getLanguageFromFilename(file.name)}
                                                        customStyle={{
                                                            padding: '16px',
                                                            borderRadius: '4px',
                                                            maxHeight: '300px',
                                                            overflowY: 'auto'
                                                        }}
                                                    >
                                                        {file.content}
                                                    </SyntaxHighlighter>
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}

                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={handleSnackbarClose}
                    message="텍스트가 클립보드에 복사되었습니다."
                />
            </Box>
        </AdminLayout>
    );
};

export default SmartAnalysis;