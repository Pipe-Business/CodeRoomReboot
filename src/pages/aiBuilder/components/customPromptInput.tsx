import {Box, IconButton, TextField} from "@mui/material";
import {ArrowCircleUp} from "@mui/icons-material";
import React, {FC, useState} from "react";
import {useRecoilState} from "recoil";
import {aiBuilderStepStatus, suggestPromptState} from "../atom";

interface Props{
    setCode:(code:string) => void;
}

const CustomPromptInput:FC<Props> = ({setCode})=>{

    const [suggestPrompt, setSuggestPrompt] = useRecoilState(suggestPromptState);
    const [stepStatus, setStepStatus] = useRecoilState(aiBuilderStepStatus);

    const [inputPrompt,setInputPrompt] = useState('');
    const onChangePrompt = (e:any) => {
        setInputPrompt(e.target.value);
    }
    const onSubmit = () => { // todo 제출
        if(inputPrompt && inputPrompt.length !== 0){
            console.log(inputPrompt);

            setCode(inputPrompt);
            console.log(stepStatus);
            setStepStatus(2);
        }

    }

    return (
        <div style={{display: 'flex', width: '100%', flexDirection: 'column'}}>
            <Box height={128}/>

            {/*<div>"{suggestPrompt[1]}" 에 대한 추가 요청사항을 작성해주세요</div>*/}

            <Box height={32}/>

            <TextField
                InputProps={{
                    sx: {borderRadius: 50, width: '80%', backgroundColor: '#F4F4F4', height: '62px'},
                    endAdornment: <IconButton type={'submit'} onClick={onSubmit}><ArrowCircleUp/></IconButton>
                }}
                value={inputPrompt}
                onChange={onChangePrompt}
                placeholder={'개선할 코드를 여기에 붙여넣기'}
            />
        </div>
    );
}

export default CustomPromptInput;