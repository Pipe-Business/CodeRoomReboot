import MainLayout from "../../layout/MainLayout";
import {Box, Button, CircularProgress, TextField, Typography} from "@mui/material";
import React, {useState} from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

const CreateCodePage = () => {
    const [repoUrl, setRepoUrlUrl] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleRefactorSuggestionPage = (githubRepoName: string, sellerGithubName: string) => {
        navigate(`/create/code/refactoring`, {
            state: {
                githubRepoName: githubRepoName,
                sellerGithubName: sellerGithubName,
            }
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setRepoUrlUrl(inputValue);
        setIsValid(false);
        setErrorMessage('');
    };

    const validateRepo = async () => { //todo 서버측으로 옮겨야함
        // GitHub 레포지토리 URL 형식 검사를 위한 정규 표현식
        const githubRepoRegex = /^https?:\/\/github\.com\/[\w.-]+\/[\w.-]+$/;

        if (!githubRepoRegex.test(repoUrl)) {
            setErrorMessage('유효하지 않은 GitHub 레포지토리 URL 형식입니다.');
            setIsValid(false);
            return;
        }

        setIsLoading(true);

        try {
            const token: string = process.env.REACT_APP_GITHUB_TOKEN!;
            // GitHub API를 사용하여 레포지토리 존재 여부 확인
            const [, , , owner, repoName] = repoUrl.split('/');
            const headers = token ? {Authorization: `token ${token}`} : {};

            const response = await axios.get(`https://api.github.com/repos/${owner}/${repoName}`, {headers});
            if (response.status === 200) {
                setIsValid(true);
                setErrorMessage('');
                handleRefactorSuggestionPage(repoName, owner);
            } else {
                setIsValid(false);
                setErrorMessage('존재하지 않는 레포지토리입니다.');
            }
        } catch (error) {
            setIsValid(false);
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                setErrorMessage('존재하지 않는 레포지토리입니다.');
            } else {
                setErrorMessage('레포지토리 확인 중 오류가 발생했습니다.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return <MainLayout>
        <Box sx={{marginTop: 4, marginBottom: 4}}>
            <Typography variant="h4" fontWeight="bold" sx={{color: '#333'}}>코드 올리기</Typography>
        </Box>
        <Box sx={{marginTop: 4, marginBottom: 4}}>
            <Typography variant="h5" fontWeight="bold" sx={{color: '#333'}}>필수! </Typography>
            <Typography variant="h6" sx={{color: '#333'}}>1. 레포지토리 private 설정</Typography>
            <Typography variant="h6" sx={{color: '#333'}}>2. 관리자 collaborator 초대 필수 (관리자 id:
                team-code-room)</Typography>
        </Box>
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <TextField
                value={repoUrl}
                onChange={handleInputChange}
                label="레포지토리 주소를 입력해주세요"
                variant="outlined"
                error={!isValid && repoUrl !== ''}
                helperText={!isValid && repoUrl !== '' ? errorMessage : ""}
                sx={{minWidth: '326px', width: '50%'}}
            />
            <Box width={'24px'}/>
            <Button
                variant="outlined"
                color={isValid ? "success" : "primary"}
                onClick={validateRepo}
                disabled={isLoading}
                startIcon={
                    isLoading ? <CircularProgress size={20}/> :
                        isValid ? <CheckCircleOutlineIcon/> :
                            <ErrorOutlineIcon style={{color: 'red'}}/>
                }
            >
                {isLoading ? '확인 중' : isValid ? '유효함' : '유효하지 않음'}
            </Button>
        </div>
    </MainLayout>
}

export default CreateCodePage;