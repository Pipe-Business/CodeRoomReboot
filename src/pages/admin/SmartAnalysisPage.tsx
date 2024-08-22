import React, { FC, useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, Button, CircularProgress, List, ListItem } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
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
            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>프로젝트 코드 분석 결과</Typography>
                {Object.entries(gptResultData).map(([key, value]) => (
                    <Box key={key} sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>{key}</Typography>
                        <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1 }}>
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
                    </Box>
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
                    sx={{ mb: 3 }}
                >
                    Back to Code Request
                </Button>
                <Typography variant="h4" sx={{ mb: 3 }}>Smart Code Analysis</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>GitHub Repository URL:</strong> {githubRepoUrl}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Seller GitHub Name:</strong> {sellerGithubName}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>User ID:</strong> {userId}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Code ID:</strong> {codeId}
                </Typography>

                {loading && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
                        <CircularProgress />
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            {`${totalCodeFiles} 개의 코드 파일들을 분석 중입니다`}
                        </Typography>
                    </Box>
                )}

                {error && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        Error: {error}
                    </Typography>
                )}

                {renderGptAnalysis()}

                {files.length > 0 && (
                    <List sx={{ mt: 4 }}>
                        {files.map((file) => (
                            <ListItem key={file.path} sx={{ flexDirection: 'column', alignItems: 'flex-start', mb: 4 }}>
                                <Typography variant="h6">{file.name}</Typography>
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
                            </ListItem>
                        ))}
                    </List>
                )}
            </Box>
        </AdminLayout>
    );
};

export default SmartAnalysis;