import {FC, useState} from "react";
import MainLayout from "../../layout/MainLayout";
import {useRecoilState} from "recoil";
import {aiBuilderStepStatus} from "./atom";
import AibuilderPageLayout from "./components/aiBuilderPageLayout";
import CustomPromptInput from "./components/customPromptInput";
import RefactoringCodeShowAccordion from "./components/refactoringCodeShowAccordion";

interface Props{

}

const AiBuilderRefactoring: FC<Props> = () => {
    const [stepStatus, setStepStatus] = useRecoilState(aiBuilderStepStatus);
    const [code, setCode] = useState<string>('');
    return <MainLayout>
        {
            stepStatus === 1 &&
            <AibuilderPageLayout pageHeaderTitle={"코드 개선"} cardHeaderTitle={"개선하고싶으신 기존의 코드를 복사한 뒤 이곳에 붙여넣기 해주세요"}>
            <CustomPromptInput setCode={setCode}/>
            </AibuilderPageLayout>
            }

        {
            stepStatus === 2 &&
            <AibuilderPageLayout pageHeaderTitle={"AI 코드 빌더 ROOMY가 개선한 내용✨"}>
                <RefactoringCodeShowAccordion code={code}/>
            </AibuilderPageLayout>
        }
    </MainLayout>
}

export default AiBuilderRefactoring;