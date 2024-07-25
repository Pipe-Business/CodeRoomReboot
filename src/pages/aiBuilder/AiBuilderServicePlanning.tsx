import React, {FC, useState} from "react";
import MainLayout from "../../layout/MainLayout";
import {IconButton} from "@mui/material";
import {useRecoilState} from "recoil";
import {aiBuilderStepStatus} from "./atom";
import AibuilderPageLayout from "./components/aiBuilderPageLayout";
import {CopyAll} from "@mui/icons-material";
import {RightEndContainer} from "./styles";
import {toast} from "react-toastify";
import {useLocation} from "react-router-dom";
import ReactMarkdown from "react-markdown";
import IdeaListItemButton from "./components/ideaListItemButton";

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
    const [isLoading, setIsLoading] = useState(false);

    const handleCopyClipBoard = async () => {
        try {
            await navigator.clipboard.writeText(ideaDocument!);
            toast.success('복사 완료!');
        } catch (error) {
            console.error(error);
            toast.error('복사에 실패했습니다.');
        }
    }

    const builderMenuListItemOnClicked = async (title: string, content: string) => {
        setIsLoading(true);
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

            setIsLoading(false);
        } catch (e: any) {
            console.log(e);
        }
    }

    return <MainLayout>
        {
            stepStatus === 1 &&
            <AibuilderPageLayout pageHeaderTitle={"[AI 빌더] '스타트업 기획자 미연'이 추천하는 아이디어✨"}
                                 cardHeaderTitle={"기획서로 작성하고 싶으신 아이디어를 선택해주세요"}>
                {state.ideaList!.map((item, index) => {
                    let splitedList = item.split(':');
                    let title: string = splitedList[0];
                    let content: string = splitedList[1];
                    return <IdeaListItemButton key={index} title={title} content={content} width={'80%'}
                                                      onClick={() => builderMenuListItemOnClicked(title, content)}/>
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
                    {
                        !isLoading &&
                        <IconButton onClick={handleCopyClipBoard}>
                            <CopyAll/> 복사하기
                        </IconButton>
                    }
                </RightEndContainer>
            </AibuilderPageLayout>
        </div>}

    </MainLayout>;
}
export default AiBuilderServicePlanning;