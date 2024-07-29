import React, {FC, useState} from "react";
import MainLayout from "../../layout/MainLayout";
import {useRecoilState} from "recoil";
import {aiBuilderStepStatus} from "./atom";
import AibuilderPageLayout from "./components/aiBuilderPageLayout";
import CustomPromptInput from "./components/customPromptInput";
import Loading from "./components/loading";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/an-old-hope.css";

import {AibuilderContentContainer, AibuilderContentImageContainer, RightEndContainer} from "./styles";

import {CopyAll} from "@mui/icons-material";
import {toast} from "react-toastify";

interface Props{

}

const AiBuilderRefactoring: FC<Props> = () => {
    const [stepStatus, setStepStatus] = useRecoilState(aiBuilderStepStatus);
    const [code, setCode] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);


    const handleCopyClipBoard = async () => {
        try {
            await navigator.clipboard.writeText(code);
            toast.success('복사 완료!');
        } catch (error) {
            console.error(error);
            toast.error('복사에 실패했습니다.');
        }
    }


    if(isLoading){
        return <Loading />
    }

    return <MainLayout>
        {
            stepStatus === 1 &&
            <AibuilderPageLayout
                pageHeaderTitle={"코드 개선"}
            >
            <CustomPromptInput
                setCode={setCode}
                placeHolder={'개선 또는 성능 관련 리뷰 받을 코드 여기에 붙여넣기'}
                title={'개선하고싶으신 기존의 코드를 복사한 뒤 이곳에 붙여넣기 해주세요'}
                profileUrl={'/image/aibuilder-pm.svg'}
                setIsLoading = {setIsLoading}
            />
            </AibuilderPageLayout>
        }

        {
            stepStatus === 2 &&
            <AibuilderPageLayout pageHeaderTitle={"[AI 빌더] 프로젝트 리딩 PM Mia가 개선한 내용✨"}>
                <AibuilderContentContainer>
                    <div style={{display: 'flex', flexDirection: 'column', width: '70%'}}>
                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                            {code}
                        </ReactMarkdown>
                    </div>
                    <AibuilderContentImageContainer src={'/image/aibuilder-pm.svg'} alt={'페르소나 이미지'}/>
                    {
                        !isLoading &&
                        <RightEndContainer onClick={handleCopyClipBoard}>
                            <CopyAll/> 설명 복사하기
                        </RightEndContainer>
                    }
                </AibuilderContentContainer>
            </AibuilderPageLayout>
        }
    </MainLayout>
}

export default AiBuilderRefactoring;