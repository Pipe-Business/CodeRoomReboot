import React, {FC, useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {Box, Button, CircularProgress, LinearProgress, List, ListItem, Typography} from '@mui/material';
import {ArrowBack} from '@mui/icons-material';
import AdminLayout from '../../layout/AdminLayout';
import useRepoFiles from "../admin/hooks/useRepoFiles";
import MainLayout from "../../layout/MainLayout";

interface LocationState {
    githubRepoName?: string;
    sellerGithubName?: string;
}

interface FileData {
    name: string;
    path: string;
    content?: string;
    analysis?: string;

    [key: string]: any;
}

const RefactoringSuggestionPage: FC = () => {
    const location = useLocation();
    const {userId, codeId} = useParams();
    const navigate = useNavigate();
    const {githubRepoName, sellerGithubName} = location.state as LocationState;

    const {files, fileNames, loading, error, totalCodeFiles} = useRepoFiles(
        sellerGithubName || '',
        githubRepoName || ''
    );

    const [analyzedFiles, setAnalyzedFiles] = useState<FileData[]>([]);
    const [currentFile, setCurrentFile] = useState<string>('');

    const goToCreateCode = () => {

    }
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

    if (!githubRepoName || !sellerGithubName) {
        return (
            <AdminLayout>
                <Box sx={{padding: 3}}>
                    <Typography variant="h6">Error: Missing required data</Typography>
                    <Button onClick={() => navigate(-1)}>Go Back</Button>
                </Box>
            </AdminLayout>
        );
    }

    return (
        <MainLayout>
            <Box sx={{padding: 3}}>
                <Button
                    startIcon={<ArrowBack/>}
                    onClick={() => navigate(-1)}
                    sx={{mb: 3}}
                >
                    Back to Code Request
                </Button>
                <Typography variant="h4" sx={{mb: 3}}>코드 최적화 제안</Typography>
                <Typography variant="body1" sx={{mb: 2, whiteSpace: 'pre-wrap'}}>
                    {'다음과 같은 방식으로 코드 최적화를 제안드립니다.' +
                        '\n코드를 수정하여 다시 커밋해주세요. (선택사항입니다)'}
                </Typography>

                {(loading || analyzedFiles.length < totalCodeFiles) && (
                    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4}}>
                        <CircularProgress/>
                        <Typography variant="body1" sx={{mt: 2}}>
                            {loading ? `Analyzing code... ${analyzedFiles.length}/${totalCodeFiles} files` : '코드 분석이 모두 완료되었습니다'}
                        </Typography>
                        {currentFile && (
                            <Typography variant="body2" sx={{mt: 1}}>
                                Currently analyzing: {currentFile}
                            </Typography>
                        )}
                        <Box sx={{width: '100%', mt: 2}}>
                            <LinearProgress variant="determinate" value={progress}/>
                        </Box>
                    </Box>
                )}

                {error && (
                    <Typography color="error" sx={{mt: 2}}>
                        Error: {error}
                    </Typography>
                )}

                {analyzedFiles.length > 0 && (
                    <List sx={{mt: 4}}>
                        {analyzedFiles.map((file) => (
                            <ListItem key={file.path} sx={{flexDirection: 'column', alignItems: 'flex-start'}}>
                                <Typography variant="h6">{file.name}</Typography>
                                {file.content && (
                                    <Box component="pre" sx={{
                                        mt: 1,
                                        p: 2,
                                        backgroundColor: '#f5f5f5',
                                        borderRadius: 1,
                                        overflowX: 'auto',
                                        width: '100%'
                                    }}>
                                        <code>{file.content}</code>
                                    </Box>
                                )}
                                {file.analysis && (
                                    <Box sx={{mt: 2, width: '100%'}}>
                                        <Typography variant="h6">Analysis</Typography>
                                        <Box component="pre" sx={{
                                            mt: 1,
                                            p: 2,
                                            backgroundColor: '#e3f2fd',
                                            borderRadius: 1,
                                            overflowX: 'auto',
                                            width: '100%'
                                        }}>
                                            <code>{file.analysis}</code>
                                        </Box>
                                    </Box>
                                )}
                            </ListItem>
                        ))}
                    </List>
                )}
            </Box>

            {
                !loading &&
                <button style={{display: 'flex', justifyContent: 'end'}} onClick={goToCreateCode}>추가 정보 작성하고 코드
                    올리기</button>
            }
        </MainLayout>
    );
};

export default RefactoringSuggestionPage;