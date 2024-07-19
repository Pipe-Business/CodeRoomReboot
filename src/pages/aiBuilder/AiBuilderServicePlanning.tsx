import React, {FC, useState} from "react";
import MainLayout from "../../layout/MainLayout";
import {IconButton, Skeleton} from "@mui/material";
import {useRecoilState} from "recoil";
import {aiBuilderStepStatus} from "./atom";
import BuilderMenuListItemButton from "./components/builderMenuListItemButton";
import AibuilderPageLayout from "./components/aiBuilderPageLayout";
import {CopyAll} from "@mui/icons-material";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {CenterBox, RightEndContainer} from "./styles";
import {toast} from "react-toastify";
import BuilderMenuListItem from "./components/buidlerMenuListItem";
import {apiClient} from "../../api/ApiClient";
import {useLocation} from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Lottie from "lottie-react";
import loadingLottie from "../../assets/aibuilderLoading.json";


interface Props {
    children?: React.ReactNode;
}

interface RouteState {
    state: {
        ideaList: string[];
    }
}

// 서비스 기획 페이지
const AiBuilderServicePlanning: FC<Props> = () => {
    const [prompt, setPrompt] = useState<string[]>();
    const [stepStatus, setStepStatus] = useRecoilState(aiBuilderStepStatus);
    const {state} = useLocation() as RouteState;
    const [ideaDocument, setIdeaDocument] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);

    const handleCopyClipBoard = async () => {
        try{
            await navigator.clipboard.writeText(ideaDocument!);
            toast.success('복사 완료!');
        }catch(error){
            console.error(error);
            toast.error('복사에 실패했습니다.');
        }
    }

    const handleShowPromptList = async() => {
        // 개발에 필요한 프롬프트 리스트 질문
        // set answer
        setIsLoading(true);
        const result = await apiClient.makeServicePlanningDocumentPromptListByGpt(ideaDocument!);
        setPrompt(result);
        setIsLoading(false);
        setStepStatus(3);
    }

    if(isLoading){
        return <MainLayout>
            <CenterBox>
                <div style={{display: 'flex', justifyContent: 'center', width: '256px', height: '256px'}}>
                    <Lottie animationData={loadingLottie}/>
                </div>
            </CenterBox>
        </MainLayout>
    }

    return <MainLayout>
        {
            stepStatus === 1 &&
            <AibuilderPageLayout pageHeaderTitle={"AI 코드 빌더 ROOMY가 추천하는 아이디어✨"} cardHeaderTitle={"기획서로 작성하고 싶으신 아이디어를 선택해주세요"}>
                {state.ideaList!.map((item, index) => {
                    let splitedList = item.split(':');
                    let title: string = splitedList[0];
                    let content: string = splitedList[1];
                    return <BuilderMenuListItemButton title={title} content={content} width={'80%'} onClick={ async() => {
                        setStepStatus(2);
                        // gpt 질문
                        setIsLoading(true);
                         const result = await apiClient.makeServicePlanningDocumentByGpt(title+":"+content);
                        // set answer
                        setIdeaDocument(result!);
                        setIsLoading(false);
                    }}/>
                })}
            </AibuilderPageLayout>
        }

        {stepStatus === 2 && <div>
            <AibuilderPageLayout pageHeaderTitle={"AI 코드 빌더 ROOMY가 작성한 기획서"}>
                <div>
                    <ReactMarkdown>
                        {ideaDocument!}
                    </ReactMarkdown>
                </div>
                <RightEndContainer>
                <IconButton onClick={handleCopyClipBoard}>
                    <CopyAll /> 복사하기
                </IconButton>
                <button
                    onClick={handleShowPromptList}
                    style={{alignItems:'center', fontWeight:'bold', fontSize:'20px',}}>개발에 필요한 AI 프롬프트 리스트 확인 <NavigateNextIcon/></button>
                </RightEndContainer>
            </AibuilderPageLayout>
        </div>}

        {
            stepStatus === 3 &&
            <AibuilderPageLayout pageHeaderTitle={"AI 코드 빌더 ROOMY가 생성한 프롬프트✨"} cardHeaderTitle={"개발에 필요한 AI 프롬프트 리스트 확인"}>
                {prompt!.map((item, index) => {
                    let splitedList = item.split(':');
                    let title: string = splitedList[0];
                    let content: string = splitedList[1];
                    return <BuilderMenuListItem title={title} content={content} width={'80%'}/>
                })}
            </AibuilderPageLayout>
        }

    </MainLayout>;
}
export default AiBuilderServicePlanning;