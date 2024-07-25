import React, {FC, useState} from "react";
import MainLayout from "../../layout/MainLayout";
import {Box, IconButton} from "@mui/material";
import {useRecoilState} from "recoil";
import {aiBuilderStepStatus} from "./atom";
import AibuilderPageLayout from "./components/aiBuilderPageLayout";
import {CopyAll, RestartAlt} from "@mui/icons-material";
import {
    AibuilderContentContainer,
    AibuilderContentImageContainer,
    RestartButtonContainer,
    RightEndContainer
} from "./styles";
import {toast} from "react-toastify";
import {useLocation} from "react-router-dom";
import ReactMarkdown from "react-markdown";
import IdeaListItemButton from "./components/ideaListItemButton";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import {apiClient} from "../../api/ApiClient";
import Loading from "./components/loading";

interface Delta {
    role: string,
    content: string;
}

interface Choice {
    index: number;
    delta: Delta;
    logprobs: any; // logprobs의 타입을 명확히 알 수 없으므로 any로 정의
    finish_reason: any; // finish_reason의 타입을 명확히 알 수 없으므로 any로 정의
}

interface ChatCompletionChunk {
    id: string;
    object: string;
    created: number;
    model: string;
    system_fingerprint: string;
    choices: Choice[];
}


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
    const [ideaDocument, setIdeaDocument] = useState<string>('');
    const [isLoadingDocument, setIsLoadingDocumentDocument] = useState(false);
    const [ideaList,setIdeaList] = useState(state.ideaList);
    const [isLoadingIdeaList, setIsLoadingIdeaList] = useState(false);


    const handleCopyClipBoard = async () => {
        try {
            await navigator.clipboard.writeText(ideaDocument!);
            toast.success('복사 완료!');
        } catch (error) {
            console.error(error);
            toast.error('복사에 실패했습니다.');
        }
    }
    const handleClickresetIdeaList = async () => {
        setIsLoadingIdeaList(true);
        const ideaList: string[] = await apiClient.servicePlanningByGpt();
        setIdeaList(ideaList);
        setIsLoadingIdeaList(false);
    }
    const builderMenuListItemOnClicked = async (title: string, content: string) => {
        setIsLoadingDocumentDocument(true);
        setStepStatus(2);
        // gpt 질문

        const ideaData: string = title + " : " + content;
        const prompt = `라는 아이디어가 맘에 드는데 해당 아이디어에 대하여 IT 서비스로 외주 개발을 맡길 수 있게 기능정의서를 한국어로 정리해서 2048 토큰 이내로 작성해줘`;

        try {
            const gptApiEndpoint: string = process.env.REACT_APP_GPT_ENDPOINT!;

            await fetch(gptApiEndpoint, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.REACT_APP_GPT_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [{role: 'user', content: ideaData + prompt}],
                    max_tokens: 2048,
                    top_p: 1,
                    temperature: 0,
                    frequency_penalty: 0,
                    presence_penalty: 1,
                    stream: true,
                })
            }).then(async (response) => {

                const reader = response.body!.getReader();
                const decoder = new TextDecoder();
                let buffer = '';

                while (true) {
                    const {value, done} = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, {stream: true});
                    let lines = buffer.split('\n');

                    for (let i = 0; i < lines.length - 1; i++) {
                        let line = lines[i].trim();
                        if (line.startsWith('data: ')) {
                            line = line.substring(6); // Remove 'data: ' prefix
                            if (line !== '[DONE]') {
                                try {
                                    const parsedData: ChatCompletionChunk = JSON.parse(line);
                                    const content = parsedData.choices[0].delta.content;

                                    if (content) {
                                        //console.log(content);
                                        setIdeaDocument(prev => prev + content);
                                    }

                                } catch (error) {
                                    console.error('Failed to parse JSON:', error);
                                }
                            }
                        }
                    }

                    buffer = lines[lines.length - 1];
                }
            });

            setIsLoadingDocumentDocument(false);
        } catch (e: any) {
            console.log(e);
        }
    }

    if(isLoadingIdeaList){
        return <Loading />
    }

    return <MainLayout>
        {
            stepStatus === 1 &&
            <AibuilderPageLayout
                                pageHeaderTitle={"[AI 빌더] '스타트업 기획자 미연'이 추천하는 아이디어✨"}
                                cardHeaderTitle={"기획서로 작성하고 싶으신 아이디어를 선택해주세요"}
                                profileUrl={'/image/aibuilder-serviceplanning.svg'}
            >
                <div style={{display: "flex", justifyContent: "end"}}>
                <RestartButtonContainer onClick={handleClickresetIdeaList}>
                    <RestartAltIcon />
                    <Box height={'8px'}/>
                    <div>아이디어 다시 생성하기</div>
                </RestartButtonContainer>
                    </div>
                {ideaList.map((item, index) => {
                    let splitedList = item.split(':');
                    let title: string = splitedList[0];
                    let content: string = splitedList[1];
                    return <IdeaListItemButton key={index} title={title} content={content} width={'80%'}
                                                      onClick={() => builderMenuListItemOnClicked(title, content)}/>
                })}
            </AibuilderPageLayout>
        }

        {stepStatus === 2 && <div>
            <AibuilderPageLayout pageHeaderTitle={"[AI 빌더] '스타트업 기획자 미연'이 작성한 기획서"}>
                <AibuilderContentContainer>
                    <div style={{display:'flex', flexDirection:'column', width:'70%'}}>
                    <ReactMarkdown>
                        {ideaDocument!}
                    </ReactMarkdown>
                    </div>
                    <AibuilderContentImageContainer src={'/image/aibuilder-serviceplanning.svg'} alt={'이미지'}/>
                </AibuilderContentContainer>

                    {
                        !isLoadingDocument &&
                        <RightEndContainer onClick={handleCopyClipBoard}>
                            <CopyAll/> 설명 복사하기
                        </RightEndContainer>
                    }

            </AibuilderPageLayout>
        </div>}

    </MainLayout>;
}
export default AiBuilderServicePlanning;