import React, {ChangeEvent, FC, useCallback, useEffect, useRef, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useQueryUserLogin} from "../../hooks/fetcher/UserFetcher";
import useInput from "../../hooks/UseInput";
import {useInputValidate} from "../../hooks/common/UseInputValidate";
import {toast} from "react-toastify";
import {PostRequestEntity} from "../../data/entity/PostRequestEntity";
import {PostStateType} from "../../enums/PostStateType";
import {useMutation} from "@tanstack/react-query";
import {apiClient} from "../../api/ApiClient";
import {CodeRequestEntity} from "../../data/entity/CodeRequestEntity";
import MainLayout from "../../layout/MainLayout";
import {Box, Button, Card, CircularProgress, Grid, TextField, Typography} from "@mui/material";
import SectionTitle from "./components/SectionTitle";
import SelectCodeCategory from "./components/SelectCodeCategory";
import SelectCodeLanguage from "./components/SelectCodeLanguage";
import LinkIcon from "@mui/icons-material/Link";
import {useContentRecommender} from "./hooks/useContentRecommender";

const InputCodeInfoPage:FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    //const { recommandedTitle, loading }= useContentRecommender(location.state.sellerGithubName,location.state.githubRepoName);
    //console.log("recommandedTitle: "+ recommandedTitle);
    const { userLogin } = useQueryUserLogin();
    const inputTitleRef = useRef<HTMLInputElement | null>(null);
    const inputPointRef = useRef<HTMLInputElement | null>(null);
    const inputContentRef = useRef<HTMLInputElement | null>(null);
    const inputUrlRef = useRef<HTMLInputElement | null>(null);
    //const inputGuideRef = useRef<HTMLInputElement | null>(null);

    const [inputCategory, setCategory] = useState('');
    const [inputLanguage, setLanguage] = useState('');
    const [inputPoint, , setPoint] = useInput<number | ''>('');
    const [inputGithubUrl, setGithubUrl] = useState('');
    // const [inputDescription, setInputDescription] = useState('');

    let postId: number;

    const [isLoading, setLoading] = useState<boolean>(false);

    const [pointError, setPointError] = useState(false);

    const [inputDescription, onChangeDescription, errorDesc, errDescMessage, setInputDesc] =
        useInputValidate({ minLen: 10, maxLen: 30 });

    const [inputTitle, onChangeTitle, errorTitle, errorMessage, setTitle] =
        useInputValidate({ minLen: 10, maxLen: 30 });
    const onChangePoint = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPoint(Number(value));
        setPointError(Number(value) < 0);
    }, [setPoint]);

    useEffect(() => {
        //setTitle(recommandedTitle);

//    }, [recommandedTitle]);
    }, []);


    const onChangeGithubUrl = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setGithubUrl(e.target.value);
    }, []);

    const onSubmitCodeRequest = useCallback(async () => {
        setLoading(true);
        if (!inputCategory || inputCategory.trim() === "") {
            toast.error("카테고리를 선택해주세요");
            return;
        }
        if (!inputLanguage || inputLanguage.trim() === '') {
            toast.error('개발 언어를 선택해주세요');
            return;
        }
        if (!inputPoint) {
            toast.error('캐시를 입력해주세요');
            inputPointRef.current?.focus();
            return;
        }
        if (inputPoint < 0) {
            toast.error('캐시는 음수가 될수 없습니다.');
            inputPointRef.current?.focus();
            return;
        }
        if (!inputGithubUrl) {
            toast.error('깃허브 레포지토리 url 을 입력해주세요');
            inputUrlRef.current?.focus();
            return;
        }
        const urlParser = inputGithubUrl.split('/');
        if (urlParser.length < 5 || !inputGithubUrl.startsWith('https://') || inputGithubUrl.endsWith('.git')) {
            toast.error('url 이 올바르지 않습니다.');
            inputUrlRef.current?.focus();
            return;
        }
        if (!inputTitle || errorTitle) {
            toast.error('제목 양식에 맞게 입력해주세요');
            inputTitleRef.current?.focus();
            return;
        }
        // if (!inputDescription || errorDesc || inputDescription.trim() === '') {
        //   toast.error('설명 양식에 맞게 입력해주세요');
        //   inputContentRef.current?.focus();
        //   return;
        // }
        // if (!inputGuide || errorGuide || inputGuide.trim() === '') {
        //   toast.error('구매자 가이드 양식에 맞게 입력해주세요.');
        //   inputGuideRef.current?.focus();
        //   return;
        // }

        const postReqEntity: PostRequestEntity = {
            title: inputTitle,
            //description: inputDescription,
            user_token: userLogin?.user_token!,
            category: inputCategory,
            state: PostStateType.pending,
            post_type: 'code',
            hash_tag: [""],
            view_count: 0,
        };

        if (!pointError) {
            mutate(postReqEntity);
        }
    }, [inputCategory, inputTitle, inputLanguage, inputPoint, inputGithubUrl, userLogin, errorTitle, pointError]);

    const { mutate } = useMutation({
        mutationFn: async (postRequest: PostRequestEntity) => {
            //setUpload(true);
            postId = await apiClient.insertPostData(postRequest);
            // if (files) {
            //   const urls = await apiClient.uploadImages(userLogin?.user_token!, postId, files);
            //   await apiClient.insertImgUrl(postId, urls);
            // }
            const urlParser = inputGithubUrl.split('/');
            const codeRequest: CodeRequestEntity = {
                post_id: postId,
                github_repo_url: inputGithubUrl,
                code_price: Number(inputPoint),
                language: inputLanguage,
                seller_github_name: urlParser[urlParser.length - 2],
                popularity: 0,
                //buyer_guide: inputGuide,
                buyer_count: 0,
            };
            await apiClient.insertCodeData(codeRequest);
        },
        onSuccess: () => {
            //setFiles(null);
            //setSrc(null);
            setGithubUrl('');
            setTitle('');
            //setDescription('');
            setLanguage('');
            setPoint('');
            setLoading(false);
            toast.success('회원님의 코드가 관리자에게 전달되었습니다!');
            navigate('/');
        },
        onError: (error) => {
            console.log(error);
        },
    });

    // if(isLoading && loading) {
    if(isLoading) {
        return <MainLayout>
            <CircularProgress style={{color: '#000000'}} size={100}/>
        </MainLayout>

    }


    return (
        <MainLayout>
            <Box sx={{marginTop: 4, marginBottom: 4}}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: '#333' }}>코드 올리기</Typography>
            </Box>


            {/*{ editTargetModel &&*/}
            {/*    <Card sx={{*/}
            {/*        padding: 4,*/}
            {/*        marginBottom: 4,*/}
            {/*        backgroundColor: '#f9f9f9',*/}
            {/*        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',*/}
            {/*        borderRadius: '8px',*/}
            {/*        width: {sm: 400, md: 800, lg: 1000,},*/}
            {/*    }}>*/}
            {/*        <Box>*/}
            {/*            <Typography variant="h4" fontWeight="bold" sx={{color: 'red'}}>반려사유</Typography>*/}
            {/*            <Box height={16}></Box>*/}
            {/*            <div style={{fontSize: 18, fontWeight: 'bold'}}>{editTargetModel.rejectMessage}</div>*/}
            {/*        </Box>*/}
            {/*    </Card>}*/}

            <Card sx={{ padding: 4, marginBottom: 4, backgroundColor: '#f9f9f9', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '8px'}}
            >
                <Typography variant="h6" color="textSecondary" fontWeight="bold" sx={{ marginBottom: 2 }}>코드에 대한 설명을 작성해주세요</Typography>

                <SectionTitle title='코드 제목' helpText='코드 제목은 기능과 사용한 기술에 대한 정보를 포함하여 직관적으로 설명해주시면 좋습니다' />
                <TextField
                    value={inputTitle}
                    sx={{ width: '100%', maxWidth: 1200, marginTop: 2, backgroundColor: '#fff', borderRadius: '4px' }}
                    onChange={onChangeTitle}
                    type="text"
                    inputRef={inputTitleRef}
                    color={inputTitle ? errorTitle ? 'error' : 'success' : 'info'}
                    fullWidth
                    placeholder='10자 이상 작성'
                    error={errorTitle}
                    autoComplete='off'
                    required
                    helperText={errorMessage}
                />
            </Card>

            <Card sx={{ padding: 4, marginBottom: 4, backgroundColor: '#f9f9f9', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <SectionTitle title='카테고리' />
                        <SelectCodeCategory value={inputCategory} setValue={setCategory} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <SectionTitle title='개발 언어' />
                        <SelectCodeLanguage inputCategory={inputLanguage} setCategory={setLanguage} />
                    </Grid>
                </Grid>
            </Card>

            <Card sx={{ padding: 4, marginBottom: 4, backgroundColor: '#f9f9f9', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
                <SectionTitle title='판매 금액 (캐시)' />
                <TextField
                    sx={{ width: '100%', maxWidth: 300, marginTop: 2, backgroundColor: '#fff', borderRadius: '4px' }}
                    value={inputPoint}
                    onChange={onChangePoint}
                    placeholder={'예) 300'}
                    inputRef={inputPointRef}
                    error={pointError}
                    helperText={pointError && '캐시는 음수가 될 수 없습니다.'}
                    type='number'
                />
            </Card>

            {/*<Card sx={{ padding: 4, marginBottom: 4, backgroundColor: '#f9f9f9', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>*/}
            {/*    <Link to={'/help'} target={"_blank"} style={{ display: 'flex', alignItems: 'center', color: '#555', textDecoration: 'none', marginBottom: 3 }}>*/}
            {/*        <LinkIcon sx={{ marginRight: 1, color: '#555' }} />*/}
            {/*        <Typography variant="body1">코드룸 판매가 처음이신가요?</Typography>*/}
            {/*    </Link>*/}

            {/*</Card>*/}

            <Card sx={{ padding: 4, marginBottom: 4, backgroundColor: '#f9f9f9', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
              <SectionTitle title='코드 설명' helpText='코드에서 사용되는 기술에 대한 개념, 왜 이러한 기술은 선택했는지 등 코드에 대한 설명을 자유롭게 적어주세요.' />
              <TextField
                value={inputDescription}
                sx={{ width: '100%', maxWidth: 800, marginTop: 2, backgroundColor: '#fff', borderRadius: '4px' }}
                onChange={onChangeDescription}
                type='text'
                inputRef={inputContentRef}
                color={inputDescription ? errorDesc ? 'error' : 'success' : 'info'}
                placeholder='최소 30자 이상 작성'
                error={errorDesc}
                autoComplete='off'
                helperText={errDescMessage}
                fullWidth
                multiline
                rows={10}
              />
              {/*<Typography variant="body2" color="textSecondary" sx={{ textAlign: 'right', marginTop: 1 }}>*/}
              {/*  ({inputDescriptionCount}/3,000)*/}
              {/*</Typography>*/}
            </Card>

            <Box sx={{ marginTop: 6, display: 'flex', justifyContent: 'end' }}>
                <Button variant="contained" sx={{ backgroundColor: '#333', color: '#fff', fontSize: 15, width: 194 }} onClick={onSubmitCodeRequest}>
                    작성완료 및 검토요청
                </Button>
            </Box>
        </MainLayout>
    );
}

export default InputCodeInfoPage;