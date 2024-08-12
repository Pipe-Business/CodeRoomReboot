import MainLayout from "../../layout/MainLayout";
import {Box, Button, CircularProgress, TextField, Typography} from "@mui/material";
import React, {useState} from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import useFileExtensionFilter from "./hooks/useFileExtensionFilter";
import {apiClient} from "../../api/ApiClient";
import {GptCodeInfoResponseEntity} from "../../data/entity/GptCodeInfoResponseEntity";
import {GptCodeInfoEntity} from "../../data/entity/GptCodeInfoEntity";
import {useRecoilState} from "recoil";
import {gptGeneratedCodeInfo} from "./createCodeAtom";
import {ColorButton, NavigateButtonContainer} from "./styles";

const CreateCodePage = () => {
    const [repoUrl, setRepoUrlUrl] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [buttonTitle, setButtonTitle] = useState('입력하기');
    const [repoOwner, setRepoOwner] = useState('');
    const [repoName, setRepoName] = useState('');
    const [fileContentLength, setFileContentLength] = useState(0);
    const {getFiles, totalCodeFileLength, fileNames, error} = useFileExtensionFilter();
    const [gptCodeInfo, setGptCodeInfo] = useRecoilState(gptGeneratedCodeInfo);

    const navigate = useNavigate();

    const handleRefactorSuggestionPage = (githubRepoName: string, sellerGithubName: string) => {
        navigate(`/create/code/refactoring`, {
            state: {
                githubRepoName: githubRepoName,
                sellerGithubName: sellerGithubName,
            }
        });
    };

    const handleCodeSubmissoinPage = () => {
        navigate('/create/code/codesubmission');
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setRepoUrlUrl(inputValue);
        //setIsValid(false);
        //setErrorMessage('');
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
        setIsButtonDisabled(true);
        setButtonTitle('유효성 확인 중');

        try {
            const token: string = process.env.REACT_APP_GITHUB_TOKEN!;
            // GitHub API를 사용하여 레포지토리 존재 여부 확인
            const [, , , owner, repoName] = repoUrl.split('/');
            setRepoName(repoName);
            setRepoOwner(owner);

            const headers = token ? {Authorization: `token ${token}`} : {};

            const response = await axios.get(`https://api.github.com/repos/${owner}/${repoName}`, {headers});
            if (response.status === 200) {
                setIsValid(true);
                setErrorMessage('');

                setButtonTitle('레포지토리 확인 중');

                const fileContents = await getFiles(owner, repoName); // 파일 get 및 필터링
                const contents = fileContents!.map((file) => {
                    return file.content;
                })
                //todo 포맷에 맞지 않을 시 재시도 요청 필요
                // todo 이미 게시된 레포지토리인지 검증 필요
                console.log("fileContents: "+JSON.stringify(contents));

                setFileContentLength(contents?.length ?? 0);

                const parsedFileContens:string = JSON.stringify(contents);
                setButtonTitle('코드 분석 중');

                const result: GptCodeInfoResponseEntity = await  apiClient.makeCodeInfoBygpt(parsedFileContens);
                const splitedResult:string[] = result.defaultInfo.split('|');
                const parsedResult: GptCodeInfoEntity = {
                    githubRepoUrl: repoUrl,
                    title: splitedResult[0].trim(),
                    category:splitedResult[1].trim(),
                    language: splitedResult[2].trim(),
                    readMe: result.readMe,
                    aiSummary: result.aiSummary,
                }
                console.log("data: "+JSON.stringify(parsedResult));
                setGptCodeInfo(parsedResult);
                //console.log("makeCodeinfoby gpt result: "+JSON.stringify(result.readMe));
                console.log("gpt: "+gptCodeInfo);
                //console.log("길이: "+fileContents!.length);
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
            setIsButtonDisabled(true);
            setButtonTitle('유효함');
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
                disabled={isButtonDisabled}
                startIcon={
                    isLoading ? <CircularProgress size={20}/> :
                        isValid ? <CheckCircleOutlineIcon/> :
                            <ErrorOutlineIcon style={{color: 'red'}}/>
                }
            >
                {buttonTitle}
            </Button>
        </div>

        <Box width={'24px'}/>

        {
            isValid && !isLoading &&
            <div>
                <Box sx={{marginTop: 4, marginBottom: 4}}>
                    <Typography variant="h5" fontWeight="bold" sx={{color: '#333'}}>프로젝트 정보</Typography>
                    <Typography variant="h6" sx={{color: '#333'}}>레포지토리 이름: {repoName}</Typography>
                    <Typography variant="h6" sx={{color: '#333'}}>레포지토리 작성자: {repoOwner}</Typography>
                    <Typography variant="h6" sx={{color: '#333'}}>핵심 컨텐츠 파일 갯수: {fileContentLength}개</Typography>
                </Box>

                <NavigateButtonContainer>
                    <ColorButton variant='contained' onClick={() => {
                        handleRefactorSuggestionPage(repoName, repoOwner)
                    }}>최적화 코드 제안 받아보기</ColorButton>
                    <Box height={'16px'}/>
                    <ColorButton variant='contained' onClick={handleCodeSubmissoinPage}>업로드 계속하기</ColorButton>
                </NavigateButtonContainer>
            </div>
        }

    </MainLayout>
}

export default CreateCodePage;