import React, { FC, useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, Button, CircularProgress, List, ListItem, LinearProgress } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import AdminLayout from '../../layout/AdminLayout';
import useRepoFiles from "./hooks/useRepoFiles";

interface LocationState {
    githubRepoUrl?: string;
    sellerGithubName?: string;
}

interface FileData {
    name: string;
    path: string;
    content?: string;
    analysis?: string;
    [key: string]: any;
}

const SmartAnalysis: FC = () => {
    const location = useLocation();
    const { userId, codeId } = useParams();
    const navigate = useNavigate();
    const { githubRepoUrl, sellerGithubName } = location.state as LocationState;

    const { files, fileNames, loading, error, totalCodeFiles } = useRepoFiles(
        sellerGithubName || '',
        githubRepoUrl || ''
    );

    const [analyzedFiles, setAnalyzedFiles] = useState<FileData[]>([]);
    const [currentFile, setCurrentFile] = useState<string>('');

    useEffect(() => {
        const newAnalyzedFiles = files.filter(file =>
            file.analysis !== undefined &&
            !analyzedFiles.some(af => af.path === file.path)
        );

        if (newAnalyzedFiles.length > 0) {
            setAnalyzedFiles(prev => [...prev, ...newAnalyzedFiles]);
        }

        const remainingFiles = files.filter(file => file.analysis === undefined);
        if (remainingFiles.length > 0) {
            setCurrentFile(remainingFiles[0].name);
        } else {
            setCurrentFile('');
        }
    }, [files, analyzedFiles]);

    const progress = totalCodeFiles > 0 ? (analyzedFiles.length / totalCodeFiles) * 100 : 0;

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

                {(loading || analyzedFiles.length < totalCodeFiles) && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
                        <CircularProgress />
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            {loading ? `Analyzing code... ${analyzedFiles.length}/${totalCodeFiles} files` : '코드 분석이 모두 완료되었습니다'}
                        </Typography>
                        {currentFile && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Currently analyzing: {currentFile}
                            </Typography>
                        )}
                        <Box sx={{ width: '100%', mt: 2 }}>
                            <LinearProgress variant="determinate" value={progress} />
                        </Box>
                    </Box>
                )}

                {error && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        Error: {error}
                    </Typography>
                )}

                {analyzedFiles.length > 0 && (
                    <List sx={{ mt: 4 }}>
                        {analyzedFiles.map((file) => (
                            <ListItem key={file.path} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                <Typography variant="h6">{file.name}</Typography>
                                {file.content && (
                                    <Box component="pre" sx={{ mt: 1, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1, overflowX: 'auto', width: '100%' }}>
                                        <code>{file.content}</code>
                                    </Box>
                                )}
                                {file.analysis && (
                                    <Box sx={{ mt: 2, width: '100%' }}>
                                        <Typography variant="h6">Analysis</Typography>
                                        <Box component="pre" sx={{ mt: 1, p: 2, backgroundColor: '#e3f2fd', borderRadius: 1, overflowX: 'auto', width: '100%' }}>
                                            <code>{file.analysis}</code>
                                        </Box>
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