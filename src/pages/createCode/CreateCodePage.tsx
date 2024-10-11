import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRecoilState } from "recoil";
import axios from 'axios';
import {
    Box,
    Button,
    CircularProgress,
    TextField,
    Typography,
    Paper,
    Container,
    Stepper,
    Step,
    StepLabel,
    Alert,
    Tooltip,
    IconButton,
} from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LinkIcon from "@mui/icons-material/Link";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import MainLayout from "../../layout/MainLayout";
import useFileExtensionFilter from "./hooks/useFileExtensionFilter";
import { apiClient } from "../../api/ApiClient";
import { GptCodeInfoEntity } from "../../data/entity/GptCodeInfoEntity";
import { gptGeneratedCodeInfo } from "./createCodeAtom";

const CreateCodePage: React.FC = () => {
    const [repoUrl, setRepoUrl] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [activeStep, setActiveStep] = useState(0);
    const [repoOwner, setRepoOwner] = useState('');
    const [repoName, setRepoName] = useState('');
    const { getFiles } = useFileExtensionFilter();
    const [gptCodeInfo, setGptCodeInfo] = useRecoilState(gptGeneratedCodeInfo);
    const [refactoredResult, setRefactoredResult] = useState<string>('');

    const navigate = useNavigate();

    const steps = ['repository 주소 입력', '코드 분석', '최적화 제안'];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRepoUrl(e.target.value);
        setIsValid(false);
        setErrorMessage('');
    };

    const validateRepo = async () => {
        const githubRepoRegex = /^https?:\/\/github\.com\/[\w.-]+\/[\w.-]+$/;

        if (!githubRepoRegex.test(repoUrl)) {
            setErrorMessage('유효하지 않은 GitHub 레포지토리 URL 형식입니다.');
            setIsValid(false);
            return;
        }

        setIsLoading(true);
        setActiveStep(1);

        try {
            const token: string = process.env.REACT_APP_GITHUB_TOKEN!;
            const [, , , owner, repoName] = repoUrl.split('/');
            setRepoName(repoName);
            setRepoOwner(owner);

            const headers = token ? { Authorization: `token ${token}` } : {};

            const response = await axios.get(`https://api.github.com/repos/${owner}/${repoName}`, { headers });
            if (response.status === 200) {
                setIsValid(true);
                setErrorMessage('');

                const fileContents = await getFiles(owner, repoName);
                const contents = fileContents!.map((file) => file.content);

                const parsedFileContents = JSON.stringify(contents);

                setActiveStep(2);

                const [result, refactoringResult] = await Promise.all([
                    apiClient.makeCodeInfoByGPT(parsedFileContents),
                    apiClient.refactoringByGpt(parsedFileContents),
                ]);

                const splitedResult = result.defaultInfo.split('|');
                const splitedHashTag = result.hashTag.split('|').map(e => e.trim());
                const parsedResult: GptCodeInfoEntity = {
                    githubRepoUrl: repoUrl,
                    title: splitedResult[0].trim(),
                    category: splitedResult[1].trim(),
                    language: splitedResult[2].trim(),
                    readMe: result.readMe,
                    aiSummary: result.aiSummary,
                    hashTag: splitedHashTag,
                };

                console.log(`hash tags : ${parsedResult.hashTag?.toString()}`);

                setGptCodeInfo(parsedResult);
                setRefactoredResult(refactoringResult);

                setActiveStep(3);
            } else {
                setIsValid(false);
                setErrorMessage('존재하지 않거나 관리자 초대가 되지않은 레포지토리입니다.');
            }
        } catch (error) {
            setIsValid(false);
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                setErrorMessage('존재하지 않거나 관리자 초대가 되지않은 레포지토리입니다.');
            } else {
                setErrorMessage('레포지토리 확인 중 오류가 발생했습니다.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isValid && !isLoading) {
            navigate('/create/code/refactoring', { state: { refactoredResult } });
        }
    }, [isValid, isLoading, navigate, refactoredResult]);

    return (
        <MainLayout>
            <Container maxWidth="md">
                <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#333', mb: 3 }}>
                        코드 올리기
                    </Typography>

                    <Link to={'/help'} target="_blank" style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: '#555',
                        textDecoration: 'none',
                        marginBottom: 3
                    }}>
                        <LinkIcon sx={{ marginRight: 1, color: '#555' }} />
                        <Typography variant="body1">필독❗️코드룸 판매가 처음이신 분 🖐️</Typography>
                    </Link>

                    <Box height={'16px'}/>

                    <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <TextField
                            value={repoUrl}
                            onChange={handleInputChange}
                            label="레포지토리 URL 입력 https://github.com/{owner}/{repository}"
                            variant="outlined"
                            error={!!errorMessage}
                            helperText={errorMessage}
                            fullWidth
                            sx={{ mr: 1 }}
                        />
                        <Tooltip title="코드를 분석하는데에 최대 1분 정도 걸릴 수 있어요.">
                            <IconButton color="primary" sx={{ mt: errorMessage ? '-24px' : '0' }}>
                                <HelpOutlineIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    <Button
                        variant="contained"
                        color={isValid ? "success" : "primary"}
                        onClick={validateRepo}
                        disabled={isLoading}
                        startIcon={
                            isLoading ? <CircularProgress size={20} /> :
                                isValid ? <CheckCircleOutlineIcon /> :
                                    <ErrorOutlineIcon style={{ color: 'white' }} />
                        }
                        fullWidth
                        sx={{height: '80px', fontSize: '24px'}}
                    >
                        {isLoading ? '분석 중...' : '코드 제출'}
                    </Button>

                    {isValid && !isLoading && (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            레포지토리 분석이 완료되었습니다. 곧 최적화 제안 페이지로 이동합니다.
                        </Alert>
                    )}
                </Paper>
            </Container>
        </MainLayout>
    );
};

export default CreateCodePage;