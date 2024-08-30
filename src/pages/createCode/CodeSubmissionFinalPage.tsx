import {Box, Button, Card, CircularProgress, Grid, TextField, Typography} from '@mui/material';
import {useMutation} from '@tanstack/react-query';
import React, {ChangeEvent, FC, useCallback, useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {apiClient} from '../../api/ApiClient';
import {useInputValidate} from '../../hooks/common/UseInputValidate';
import {useQueryUserLogin} from '../../hooks/fetcher/UserFetcher';
import useInput from '../../hooks/UseInput';
import MainLayout from '../../layout/MainLayout';
import SectionTitle from './components/SectionTitle';
import SelectCodeCategory from './components/SelectCodeCategory';
import SelectCodeLanguage from './components/SelectCodeLanguage';
import {PostRequestEntity} from "../../data/entity/PostRequestEntity";
import {CodeRequestEntity} from "../../data/entity/CodeRequestEntity";
import {CodeModel} from "../../data/model/CodeModel";
import {PostStateType} from "../../enums/PostStateType";
import {useRecoilState} from "recoil";
import {codeInfo, gptGeneratedCodeInfo} from "./createCodeAtom";
import {ArrowBack} from "@mui/icons-material";
import {CodeEditRequestEntity} from "../../data/entity/CodeEditRequestEntity";

interface Props {
    children?: React.ReactNode;
}

/**
 * 파이프(|) 문자로 구분된 문자열을 문자열 배열로 분할합니다.
 * @param {string} input - 파이프로 구분된 입력 문자열
 * @returns {string[]} - 분할된 문자열 배열
 */


const CodeSubmissionFinalPage: FC<Props> = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const {isEdit, isReexamination} = location.state || {};
    const editTargetModel: CodeModel = location.state?.item;
    const [gptCodeInfo] = useRecoilState(gptGeneratedCodeInfo);
    const [codeModel] = useRecoilState(codeInfo);

    const {userLogin} = useQueryUserLogin();
    const inputTitleRef = useRef<HTMLInputElement | null>(null);
    const inputPointRef = useRef<HTMLInputElement | null>(null);
    const inputContentRef = useRef<HTMLInputElement | null>(null);
    //const inputUrlRef = useRef<HTMLInputElement | null>(null);
    const inputAiSummaryRef = useRef<HTMLInputElement | null>(null);


    const [inputCategory, setCategory] = useState(gptCodeInfo?.category ?? codeModel?.category ?? '');
    const [inputLanguage, setLanguage] = useState(gptCodeInfo?.language ?? codeModel?.language ?? '');
    const [inputPoint, , setPoint] = useInput<number | ''>(codeModel?.price ?? '');
    //const [inputGithubUrl, setGithubUrl] = useState(l);
    let postId: number;

    const [isLoading, setLoading] = useState<boolean>(false);

    //const [src, setSrc] = useState<string[] | null>(null);
    //const [files, setFiles] = useState<File[] | null>(null);

    const [pointError, setPointError] = useState(false);

    const [inputTitle, onChangeTitle, errorTitle, errorMessage, setTitle] =
        useInputValidate({
            defaultValue: gptCodeInfo?.title ?? codeModel?.title ?? '',
            minLen: 10, maxLen: 30
        });
    const [inputDescription, onChangeDescription, errorDesc, errDescMessage, setDescription, , , ,
        , , , inputDescriptionCount] =
        useInputValidate({
            defaultValue: gptCodeInfo?.readMe ?? codeModel?.description ?? '',
            minLen: 30, maxLen: 3000
        });

    const [inputAiSummary, onChangeAiSummary, errorAiSummary
        , errAiSummaryMessage, setAiSummaryMessage, , , ,
        , , , inputAiSummaryCount] =
        useInputValidate({
            defaultValue: gptCodeInfo?.aiSummary ?? codeModel?.aiSummary ?? '',
            minLen: 30, maxLen: 100,
        });

    function splitStringByPipe(input: string): string[] {
        console.log(`test ${input.toString()}`);
        return input.toString().split(',');
    }


    useEffect(() => {
        if (editTargetModel) {
            setTitle(editTargetModel.title);
            //setDescription(editTargetModel.description);
            setLanguage(editTargetModel.language);
            setCategory(editTargetModel.category);
            setPoint(editTargetModel.price);
            //setGuideMessage(editTargetModel.buyerGuide);
            // if(editTargetModel.images){
            //   setSrc(editTargetModel.images);
            // }
            //setGithubUrl(editTargetModel.githubRepoUrl);
        }
    }, [editTargetModel]);

    const onChangePoint = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPoint(Number(value));
        setPointError(Number(value) < 0);
    }, [setPoint]);

    // const handleDeleteImage = (index: number) => {
    //   const newImages = src!.filter((_, i) => i !== index);
    //   setSrc(newImages);
    // };

    // const onChangeGithubUrl = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    //   setGithubUrl(e.target.value);
    // }, []);

    const goToAIBuilderPage = useCallback(() => {
        navigate('/aibuilder');
    }, []);

    // const handleChangeImage = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    //   const urlList: string[] = [];
    //   const fileList = Array.from(e.target.files ?? []);
    //   fileList.forEach(file => {
    //     urlList.push(URL.createObjectURL(file));
    //   });
    //   setFiles(fileList);
    //   setSrc(urlList);
    // }, []);

    const onSubmitCodeRequest = useCallback(async () => {
        setLoading(true);

        if (!inputCategory || inputCategory.trim() === "") {
            toast.error("카테고리를 선택해주세요");
            setLoading(false);
            return;
        }
        if (!inputLanguage || inputLanguage.trim() === '') {
            toast.error('개발 언어를 선택해주세요');
            setLoading(false);
            return;
        }
        if (!inputPoint) {
            toast.error('판매 금액을 입력해주세요');
            inputPointRef.current?.focus();
            setLoading(false);
            return;
        }
        if (inputPoint < 0) {
            toast.error('판매금액은 음수가 될수 없습니다.');
            inputPointRef.current?.focus();
            setLoading(false);
            return;
        }
        // if (!inputGithubUrl) {
        //   toast.error('깃허브 레포지토리 url 을 입력해주세요');
        //   inputUrlRef.current?.focus();
        //   return;
        // }
        //const urlParser = inputGithubUrl.split('/');
        // if (urlParser.length < 5 || !inputGithubUrl.startsWith('https://') || inputGithubUrl.endsWith('.git')) {
        //   toast.error('url 이 올바르지 않습니다.');
        //   inputUrlRef.current?.focus();
        //   return;
        // }
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
        try {
            const postReqEntity: PostRequestEntity = {
                title: inputTitle,
                description: inputDescription,
                user_token: userLogin?.user_token!,
                category: inputCategory,
                state: PostStateType.pending,
                post_type: 'code',
                hash_tag: gptCodeInfo?.hashTag ?? codeModel?.hashTag == null ? [] : splitStringByPipe(codeModel?.hashTag!),
                view_count: 0,
            };
            if (!pointError) {
                mutate(postReqEntity);
            }

        } catch (error) {
            setLoading(false);
            console.log(error);
        }

        //}, [inputCategory, inputTitle, inputLanguage, inputPoint, inputGithubUrl, userLogin, errorTitle, pointError]);
    }, [inputCategory, inputTitle, inputLanguage, inputPoint, userLogin, errorTitle, pointError]);

    const {mutate} = useMutation({
        mutationFn: async (postRequest: PostRequestEntity) => {
            //setUpload(true);

            // 최초 게시 신청인지 체크 (코드 올리기를 통해서 들어온 경우)
            if (gptCodeInfo != null) {
                console.log('최초 게시 신청');
                postId = await apiClient.insertPostData(postRequest);
                // if (files) {
                //   const urls = await apiClient.uploadImages(userLogin?.user_token!, postId, files);
                //   await apiClient.insertImgUrl(postId, urls);
                // }
                const urlParser = gptCodeInfo?.githubRepoUrl?.split('/') ?? [];
                const codeRequest: CodeRequestEntity = {
                    post_id: postId,
                    github_repo_url: gptCodeInfo?.githubRepoUrl ?? '',
                    code_price: Number(inputPoint),
                    language: inputLanguage,
                    seller_github_name: urlParser[urlParser.length - 2],
                    popularity: 0,
                    ai_summary: inputAiSummary,
                    buyer_count: 0,
                };
                await apiClient.insertCodeData(codeRequest);
            } else {
                // 단순 게시글 수정 or 반려로 인한 재심사 요청으로 인한 경우
                console.log('단순 게시글 수정 or 재심사 요청');
                let state = PostStateType.approve
                if (isEdit) {
                    state = PostStateType.approve
                } else if (isReexamination) {
                    state = PostStateType.pending
                }

                const codeEditRequest: CodeEditRequestEntity = {
                    post_id: codeModel!.id,
                    title: inputTitle,
                    category: inputCategory,
                    price: Number(inputPoint),
                    language: inputLanguage,
                    ai_summary: inputAiSummary,
                    description: inputDescription,
                    state: state,
                };
                await apiClient.updatePostData(codeEditRequest);
            }

        },
        onSuccess: () => {
            //setFiles(null);
            //setSrc(null);
            //setGithubUrl('');
            let resultMsg = '';
            if (isEdit) {
                resultMsg = '게시글 수정이 완료 되었습니다';
            } else if (isReexamination) {
                resultMsg = '재심사 요청이 완료 되었습니다';
            } else {
                resultMsg = '코드 심사 요청이 완료 되었습니다';
            }

            setTitle('');
            //setDescription('');
            setLanguage('');
            setPoint('');
            setLoading(false);
            toast.success(resultMsg);
            navigate('/');
        },
        onError: (error) => {
            console.log(error);
        },
    });

    if (isLoading) {
        return <MainLayout>
            <CircularProgress style={{color: '#000000'}} size={100}/>
        </MainLayout>

    }

    return (
        <MainLayout>
            <Box sx={{marginTop: 4, marginBottom: 4}}>
                <Button
                    startIcon={<ArrowBack/>}
                    onClick={() => navigate(-1)}
                    sx={{mb: 3}}
                >
                    뒤로가기
                </Button>
                <Typography variant="h4" fontWeight="bold" sx={{color: '#333'}}>코드 올리기</Typography>
            </Box>


            {/*todo 제거예정*/}
            {/*<Button*/}
            {/*onClick={goToAIBuilderPage}*/}
            {/*    style={{*/}
            {/*  padding: 16,*/}
            {/*  backgroundColor: '#26282D',*/}
            {/*  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',*/}
            {/*  borderRadius: '8px',*/}
            {/*  color: '#56A8F5',*/}
            {/*  fontWeight:'bold',*/}
            {/*  marginBottom:32*/}
            {/*}}>AI 빌더 이용하기 ✨</Button>*/}

            <Typography variant="h6" color="textSecondary" fontWeight="bold" sx={{marginBottom: 2}}>Roomy가 작성한 코드 설명이에요.
                추가적인 설명을 해주셔도 좋아요.</Typography>

            <Box height={'16px'}/>

            {editTargetModel &&
                <Card sx={{
                    padding: 4,
                    marginBottom: 4,
                    backgroundColor: '#f9f9f9',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                    width: {sm: 400, md: 800, lg: 1000,},
                }}>
                    <Box>
                        <Typography variant="h4" fontWeight="bold" sx={{color: 'red'}}>반려사유 보기</Typography>
                        <Box height={16}></Box>
                        {/*<div style={{fontSize: 18, fontWeight: 'bold'}}>{editTargetModel.reviewResultMsg}</div>*/}
                    </Box>
                </Card>}

            <Card sx={{
                padding: 4,
                marginBottom: 4,
                backgroundColor: '#f9f9f9',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px'
            }}
            >
                <SectionTitle title='코드 제목' helpText='코드 제목은 기능과 사용한 기술에 대한 정보를 포함하여 직관적으로 설명해주시면 좋습니다'/>
                <TextField
                    value={inputTitle}
                    sx={{width: '100%', maxWidth: 1200, marginTop: 2, backgroundColor: '#fff', borderRadius: '4px'}}
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

            <Card sx={{
                padding: 4,
                marginBottom: 4,
                backgroundColor: '#f9f9f9',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px'
            }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <SectionTitle title='카테고리'/>
                        <SelectCodeCategory value={inputCategory} setValue={setCategory}/>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <SectionTitle title='개발 언어'/>
                        <SelectCodeLanguage inputCategory={inputLanguage} setCategory={setLanguage}/>
                    </Grid>
                </Grid>
            </Card>

            <Card sx={{
                padding: 4,
                marginBottom: 4,
                backgroundColor: '#f9f9f9',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px'
            }}>
                <SectionTitle title='판매 금액'/>
                <TextField
                    sx={{width: '100%', maxWidth: 300, marginTop: 2, backgroundColor: '#fff', borderRadius: '4px'}}
                    value={inputPoint}
                    onChange={onChangePoint}
                    placeholder={'예) 300'}
                    inputRef={inputPointRef}
                    error={pointError}
                    helperText={pointError && '판매금액은 음수가 될 수 없습니다.'}
                    type='number'
                />
            </Card>

            {/*<Card sx={{ padding: 4, marginBottom: 4, backgroundColor: '#f9f9f9', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>*/}
            {/*  <SectionTitle title='완성본, 참고할 이미지를 업로드 (선택)' helpText='결과물의 사진 업로드를 하면 구매자들에게 도움이 됩니다.' />                */}
            {/*  {src && <ImageCard src={src} handleDeleteImage={handleDeleteImage} />}*/}
            {/*  <IconButton component='label'>*/}
            {/*    <AddPhotoAlternateIcon sx={{ fontSize: '40px', color: '#555' }} />*/}
            {/*    <input*/}
            {/*      onChange={handleChangeImage}*/}
            {/*      type='file'*/}
            {/*      multiple*/}
            {/*      hidden*/}
            {/*    />*/}
            {/*  </IconButton>*/}
            {/*</Card>*/}


            {/*<Card sx={{ padding: 4, marginBottom: 4, backgroundColor: '#f9f9f9', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>*/}

            {/*  <SectionTitle title='업로드할 깃허브 레포지토리 url (꼭 private으로 만들어 주세요)' helpText='올리려는 코드에 깃허브 레포지토리 URL 을 입력하시면됩니다. 반드시 private 레포지토리로 설정해야합니다.' />*/}
            {/*  <TextField*/}
            {/*    value={inputGithubUrl}*/}
            {/*    sx={{ width: '100%', maxWidth: 800, marginTop: 2, backgroundColor: '#fff', borderRadius: '4px' }}*/}
            {/*    inputRef={inputUrlRef}*/}
            {/*    onChange={onChangeGithubUrl}*/}
            {/*    placeholder='예) https://github.com/your_nickname/your_repository'*/}
            {/*    fullWidth*/}
            {/*    helperText='본인이 공유할 private 레포지토리 에 관리자를 추가해주세요 관리자 닉네임: team-code-room 자세한 사항은 상단 가이드를 참고해주세요'*/}
            {/*    type='url'*/}
            {/*  />*/}
            {/*</Card>*/}

            <Card sx={{
                padding: 4,
                marginBottom: 4,
                backgroundColor: '#f9f9f9',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px'
            }}>
                <SectionTitle title='이 코드의 key point' helpText='코드가 더 잘 팔릴 수 있도록 코드의 강점을 소개해주세요'/>
                <TextField
                    value={inputAiSummary}
                    sx={{width: '100%', maxWidth: 800, marginTop: 2, backgroundColor: '#fff', borderRadius: '4px'}}
                    onChange={onChangeAiSummary}
                    type='text'
                    inputRef={inputAiSummaryRef}
                    color={inputAiSummary ? errorAiSummary ? 'error' : 'success' : 'info'}
                    placeholder='최소 30자 이상 작성'
                    error={errorAiSummary}
                    autoComplete='off'
                    helperText={errAiSummaryMessage}
                    fullWidth
                    multiline
                    rows={2}
                />
                <Typography variant="body2" color="textSecondary" sx={{textAlign: 'right', marginTop: 1}}>
                    ({inputAiSummaryCount}/100)
                </Typography>
            </Card>

            <Card sx={{
                padding: 4,
                marginBottom: 4,
                backgroundColor: '#f9f9f9',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px'
            }}>
                <SectionTitle title='코드 설명'
                              helpText={'코드에서 사용되는 기술에 대한 개념, 왜 이러한 기술은 선택했는지 등 코드에 대한 설명을 자유롭게 적어주세요.\n아래 내용은 .md 파일 형식으로 작성됩니다.'}/>
                <TextField
                    value={inputDescription}
                    sx={{width: '100%', maxWidth: 800, marginTop: 2, backgroundColor: '#fff', borderRadius: '4px'}}
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
                <Typography variant="body2" color="textSecondary" sx={{textAlign: 'right', marginTop: 1}}>
                    ({inputDescriptionCount}/3,000)
                </Typography>
            </Card>

            <Box sx={{marginTop: 6, display: 'flex', justifyContent: 'end'}}>
                <Button variant="contained" sx={{backgroundColor: '#333', color: '#fff', fontSize: 15, width: 194}}
                        onClick={onSubmitCodeRequest}>
                    완료
                </Button>
            </Box>
        </MainLayout>
    );
};

export default CodeSubmissionFinalPage;
