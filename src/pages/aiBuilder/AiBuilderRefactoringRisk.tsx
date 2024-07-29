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
import {apiClient} from "../../api/ApiClient";

interface Props{

}

const AiBuilderRefactoringRisk: FC<Props> = () => {
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
                pageHeaderTitle={"[AI 빌더] ‘시니어 개발자 민준’에게 요청하기 ✨"}
            >
            <CustomPromptInput
                setCode={setCode}
                placeHolder={'위험 진단 또는 안정성 관련 리뷰 받을 코드 여기에 붙여넣기'}
                title={'보유하신 코드의 잠재적인 위험을 진단 받고 싶거나,\n코드의 안정성 관련하여 리뷰 받고 싶으신 코드를 붙여넣어 주세요'}
                profileUrl={'/image/aibuilder-refactoringrisk.svg'}
                setIsLoading = {setIsLoading}
                refactorApiFun={apiClient.riskRefactoringByGpt}
            />
            </AibuilderPageLayout>
        }

        {
            stepStatus === 2 &&
            <AibuilderPageLayout pageHeaderTitle={"[AI 빌더] '시니어 개발자 민준'이 설명하는 코드✨"}>
                <AibuilderContentContainer>
                    <div style={{display: 'flex', flexDirection: 'column', width: '70%'}}>
                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                            {code}
                        </ReactMarkdown>
                    </div>
                    <AibuilderContentImageContainer src={'/image/aibuilder-refactoringrisk.svg'} alt={'페르소나 이미지'}/>
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

export default AiBuilderRefactoringRisk;