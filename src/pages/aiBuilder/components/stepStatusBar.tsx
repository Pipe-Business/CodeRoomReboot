import {ArrowRight} from "@mui/icons-material";
import React, {FC} from "react";
import {useRecoilState} from "recoil";
import {aiBuilderStepStatus, suggestPromptState} from "../atom";

interface Props{
    children?: React.ReactNode;
}

const StepStatusBar:FC<Props> = () => {

    const [suggestPrompt, setSuggestPrompt] = useRecoilState(suggestPromptState);
    const [stepStatus, setStepStatus] = useRecoilState(aiBuilderStepStatus);

    return (
        <div style={{display: 'flex', justifyContent: 'start'}}>
            {suggestPrompt.map((item) => (
                <div style={{display: 'flex', color: 'grey', justifyContent: 'center'}} key={item}>
                    {item}
                    {stepStatus !== 2 && <ArrowRight/>}
                </div>
            ))}
        </div>
    );
};

export default StepStatusBar;

