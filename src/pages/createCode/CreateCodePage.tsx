import React, { ChangeEvent, FC, useCallback, useRef, useState, } from 'react';
import MainLayout from '../../layout/MainLayout.tsx';
import { Box, Button, Card, TextField, Tooltip, IconButton } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CenterBox, MarginVertical } from '../main/styles.ts';
import { MarginHorizontal } from '../main/styles.ts';
import { useInputValidate } from '../../hooks/common/useInputValidate.ts';
import { TextFieldWrapper } from './styles.ts';
import SelectCodeCategory from './components/SelectCodeCategory.tsx';
import SectionTitle from './components/SectionTitle.tsx';
import SelectCodeLanguage from './components/SelectCodeLanguage.tsx';
import useInput from '../../hooks/useInput.ts';
import LinkIcon from '@mui/icons-material/Link';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ImageCard from '../../components/ImageCard.tsx';
import { toast } from 'react-toastify';
import { ColorButton } from './styles.ts';

interface Props {
    children?: React.ReactNode;
}

const CreateCodePage: FC<Props> = () => {
    const inputTitleRef = useRef<HTMLInputElement | null>(null);
    const inputPointRef = useRef<HTMLInputElement | null>(null);
    const inputContentRef = useRef<HTMLInputElement | null>(null);
    const inputUrlRef = useRef<HTMLInputElement | null>(null);
    const inputGuideRef = useRef<HTMLInputElement | null>(null);

    // const { isLoading, data: codeReq } = useQuery({
	// 	queryKey: ['codeRequest', id],
	// 	queryFn: firebaseGetOneFetcher<CodeRequestEntity>,
	// });

    const [inputCategory, setCategory] = useState('');
    const [inputLanguage, setLanguage] = useState('');
    const [inputPoint, , setPoint] = useInput<number | ''>('');
    const [inputGithubUrl, setGithubUrl] = useState('');


    const [src, setSrc] = useState<string[] | null>(null);
    const [files, setFiles] = useState<File[] | null>(null);

    const [pointError, setPointError] = useState(false);

    const [inputTitle, onChangeTitle, errorTitle, errorMessage, setTitle] =
        useInputValidate({ minLen: 10, maxLen: 30 });
        const [inputDescription, onChangeDescription, errorDesc, errDescMessage, setDescription, , , ,
            , , , inputDescriptionCount] =
            useInputValidate({ minLen: 30, maxLen: 3000 });
            const [inputGuide, onChangeGuide, errorGuide, errGuideMessage, setGuideMessage, , , ,
                , , , inputGuideCount] =
                useInputValidate({ minLen: 30, maxLen: 3000 });

    const onChangePoint = useCallback((e: any) => {
        setPoint(e.target.value);
        if (e.target.value < 0) {
            setPointError(true);
        } else {
            setPointError(false);
        }
        console.log(inputPoint);


    }, [inputPoint]);


    const onChangeGithubUrl = useCallback((e: any) => {

        setGithubUrl(e.target.value);
    }, [inputGithubUrl]);

    const handleChangeImage = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const urlList: string[] = [];
        const fileList = Array.from(e.target.files ?? []);
        fileList.forEach(file => {
            urlList.push(URL.createObjectURL(file));
        });
        setFiles([...fileList]);
        console.log(fileList);
        console.log(urlList);
        setSrc([...urlList]);

    }, []);

    const onSubmitCodeRequest = useCallback(async () => {
		if(!inputCategory ||inputCategory.trim()===""){
			toast.error("카테고리를 선택해주세요")
			return
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
			inputUrlRef.current?.focus()
			return;
		}
		// TODO : github nickname 넘겨주는 로직 관리자가 포크떠오는 로직 검토
		const urlParser = inputGithubUrl.split('/');
		console.log(urlParser);
		if (urlParser.length < 5 || !inputGithubUrl.startsWith('https://') || inputGithubUrl.endsWith('.git')) {
			toast.error('url 이 올바르지 않습니다.');
			inputUrlRef.current?.focus()
			return;
		}
		if (!inputTitle || errorTitle) {
			toast.error('제목 양식에맞게 입력해주세요');
			inputTitleRef.current?.focus()
			return;
		}
		if (!inputDescription || errorDesc || inputDescription.trim() === '') {
			toast.error('설명 양식에 맞게 입력해주세요');
			inputContentRef.current?.focus()
			return;
		}
		if(!inputGuide || errorGuide || inputGuide.trim()===''){
			toast.error('구매자 가이드 양식에 맞게 입력해주세요.')
			inputGuideRef.current?.focus()
			return;
		}

		// const reqEntity: CodeRequestEntity = {
		// 	formType: 'code',
		// 	url: inputGithubUrl,
		// 	description: inputDescription,
		// 	price: inputPoint,
		// 	title: inputTitle,
		// 	codeCategory:inputCategory,
		// 	userId: userLogin?.id!,
		// 	guide:inputGuide,
		// 	category: inputLanguage,
		// 	sellerGithubName: userLogin?.githubNickname ? userLogin.githubNickname : urlParser[urlParser.length - 2],
		// 	createdAt: createTodayDate(),
		// 	type: 'pending',

		// };
		// if (codeReq && userLogin && codeReq && codeReq.id) {
		// 	reqEntity.id = codeReq.id;
		// 	reqEntity.type = 'pending';
		// 	await firebaseSetFetcher(['codeRequest', codeReq.id], reqEntity);
		// 	await apiClient.updateTypeForCodeRequestByUser(userLogin.id, codeReq.id, 'pending');
		// 	setSrc(null);
		// 	setFiles(null);
		// 	toast.success('관리자에게 코드 요청이 전달되었습니다.');
		// 	navigate('/');
		// 	return;
		// }
		if (!pointError) {
		//	mutate(reqEntity);
			setTitle('');
			setDescription('');
			setLanguage('');
			setPoint('');
			setGithubUrl('');
		}
	// }, [inputCategory,inputTitle, inputDescription, inputLanguage, inputPoint, inputGithubUrl,inputGuide, files, codeReq, userLogin]);
	}, [inputCategory,inputTitle, inputDescription, inputLanguage, inputPoint, inputGithubUrl,inputGuide, files,]);


    return (<MainLayout>

        <Card style={{ marginTop: 64, padding: 32 }}>

        <div style={{ marginTop: 24, marginBottom: 24, }}>
                <span style={{ color: '#000000', fontSize: '32px', fontWeight: 'bold' }}>코드 올리기 </span>
            </div>
            <div style={{ marginTop: 16, marginBottom: 16, }}>
                <span style={{ color: 'grey', fontSize: '24px', fontWeight: 'bold' }}>코드에 대한 설명을 작성해주세요 </span>
            </div>

            <Box height={16} />
            
            <SectionTitle title='코드제목' helpText='코드 제목은 기능과 사용한 기술에 대한 정보를 포함하여 직관적으로 설명해주시면 좋습니다' />
            <TextField value={inputTitle}
                sx={{
                    width: { sm: 600, md: 700, lg: 800 },
                }}
                onChange={onChangeTitle}
                type={'text'}
                aria-required
                inputRef={inputTitleRef}
                color={inputTitle ? errorTitle ? 'error' : 'success' : 'info'}
                fullWidth
                placeholder='10자 이상 작성'
                error={errorTitle}
                autoComplete='off'
                required
                helperText={errorMessage}
            />

            <Box height={16} />

            <div style={{ display: 'flex', flexDirection: 'row', }}>

                <div>
                    <SectionTitle title='카테고리' />
                    <SelectCodeCategory value={inputCategory} setValue={setCategory} />
                </div>

                <Box width={64} />

                <div>
                    <SectionTitle title='개발언어' />
                    <SelectCodeLanguage inputCategory={inputLanguage} setCategory={setLanguage} />
                </div>

            </div>

            <Box height={16} />

            <div>
                <SectionTitle title='캐시' />
                <TextField
                    sx={{
                        width: { lg: 294 },
                    }}
                    value={inputPoint} onChange={onChangePoint}
                    placeholder={'예) 300'}
                    inputRef={inputPointRef}
                    error={pointError}
                    helperText={pointError && '캐시는 음수가 될수 없습니다.'}
                    type='number' />
            </div>

            <Box height={16} />


            <div>
                <div style={{ display: 'flex', alignItems: 'start', flexDirection:'column' }}>
                    <SectionTitle title='완성본, 참고할 이미지를 업로드 (선택)' helpText='결과물의 사진 업로드를 하면 구매자들에게 도움이 됩니다.' />
                    <IconButton component='label'>
                        <>
                            <AddPhotoAlternateIcon sx={{ fontSize: '40px' }} />
                            <input
                                onChange={handleChangeImage}
                                type='file'
                                multiple
                                hidden
                            />

                        </>
                    </IconButton>
                    {src && <ImageCard src={src} />}
                </div>

            </div>

            <Box height={64} />

            <div>
                <Link to={'/help'} target={"_blank"}>
                    <div style={{ fontSize: '20ppx', color: '#1976d2', display: 'flex' }}>
                        <LinkIcon />
                        <div>
                            코드룸 판매가 처음이신가요?
                        </div>
                    </div>
                </Link>

                <Box height={32} />

                <SectionTitle title='업로드할 깃허브 레포지토리 url (꼭 private으로 만들어 주세요)' helpText='올리려는 코드에 깃허브 레포지토리 URL 을 입력하시면됩니다. 반드시 private 레포지토리로 설정해야합니다.' />
                <TextField value={inputGithubUrl}
                    sx={{
                        width: { sm: 600, md: 700, lg: 800 },
                    }}
                    inputRef={inputUrlRef}
                    onChange={onChangeGithubUrl}
                    placeholder={'예) https://github.com/your_nickname/your_repository'}
                    fullWidth
                    helperText={'본인이 공유할 private 레포지토리 에 관리자를 추가해주세요 관리자 닉네임: uqlipt 자세한 사항은 상단 가이드를 참고해주세요'}
                    type={'url'} />
            </div>

            <Box height={32} />


            <div>
            <SectionTitle title='구매자 가이드' 
            helpText={`구매자가 코드를 구매 후 실행 시 원할한 작동을 위해 개발환경을 알려주세요\n
            e.g.)
            사용언어:Node.js
            버전:20.1.0LTS
            프레임워크 및 라이브러리
            -React (v18)
            운영체제:Windows10Home
            개발일시:2022년 5월 9일
            `}/>
            <Box height={8} />
						
					</div>
					<TextField value={inputGuide}
                                sx={{
                                    width: { sm: 600, md: 700, lg: 800 },
                                }}
							   onChange={onChangeGuide}
							   type={'text'}
							   color={inputGuide ? errorGuide ? 'error' : 'success' : 'info'}
							   placeholder={`예시)\n사용언어:Node.js\n버전:20.1.0LTS\n프레임워크 및 라이브러리\n-React (v18)\n운영체제:Windows10Home\n개발일시:2022년 5월 9일`}
							   inputRef={inputGuideRef}
							   error={errorGuide}
							   autoComplete={'off'}
							   helperText={errGuideMessage}
							   fullWidth
							   multiline
							   rows={10}
					/>
					<div style={{ display: 'flex', justifyContent: 'end' }}>
						({inputGuideCount}/3,000)
					
				</div>
				

                <Box height={32} />
            <SectionTitle title='코드 설명' helpText='코드에서 사용되는 기술에 대한 개념, 왜 이러한 기술은 선택했는지 등 코드에 대한 설명을 자유롭게 적어주세요.' />
            <TextField value={inputDescription}
                                  sx={{
                                    width: { sm: 600, md: 700, lg: 800 },
                                }}
							   onChange={onChangeDescription}
							   type={'text'}
							   inputRef={inputContentRef}
							   color={inputDescription ? errorDesc ? 'error' : 'success' : 'info'}
							   placeholder='최소 30자 이상 작성'
							   error={errorDesc}
							   autoComplete={'off'}
							   helperText={errDescMessage}
							   fullWidth
							   multiline
							   rows={10}
					/>
					<div style={{ display: 'flex', justifyContent: 'end' }}>
						({inputDescriptionCount}/3,000)
					</div>

                    <Box height={32} />
                    
                     <div style={{display:'flex', width : '100%', justifyContent:'end' }}>
                    <ColorButton type={'submit'} sx={{fontSize:'15', width: '194px' }} onClick={onSubmitCodeRequest}>작성완료 및 검토요청</ColorButton>
                    </div>               
        </Card>
    </MainLayout>);
}

export default CreateCodePage;