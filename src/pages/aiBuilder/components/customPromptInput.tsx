import {Avatar, Box, IconButton, TextField} from "@mui/material";
import {ArrowCircleUp} from "@mui/icons-material";
import React, {FC, useState} from "react";
import {useRecoilState} from "recoil";
import {aiBuilderStepStatus, suggestPromptState} from "../atom";
import {CustomPromptContainer} from "../styles";
import {apiClient} from "../../../api/ApiClient";

interface Props{
    setCode:(code:string) => void;
    title: string;
    placeHolder: string;
    profileUrl:string;
    setIsLoading:(status:boolean) => void;
}

const CustomPromptInput:FC<Props> = ({setCode, placeHolder, title, profileUrl, setIsLoading})=>{

    const [suggestPrompt, setSuggestPrompt] = useRecoilState(suggestPromptState);
    const [stepStatus, setStepStatus] = useRecoilState(aiBuilderStepStatus);

    const [inputPrompt,setInputPrompt] = useState('');

    const onChangePrompt = (e:any) => {
        setInputPrompt(e.target.value);
    }

    const onSubmit = async () => {
        if(inputPrompt && inputPrompt.length !== 0){
            console.log(inputPrompt);

            setIsLoading(true);
            const refactedCode = await apiClient.riskRefactoringByGpt(inputPrompt);
            console.log("결과: "+refactedCode);
            setCode(refactedCode);
            setStepStatus(2);
            setIsLoading(false);
        }
    }


    return (
        <div style={{display: 'flex', width: '100%', flexDirection: 'column'}}>
            <Box height={128}/>


        <CustomPromptContainer>
            {
                profileUrl &&
                <Avatar src={profileUrl} sx={{width: 45, height: 45, border: '3px solid black'}}/>
            }
            <div style={{padding: '8px'}}>{title}</div>

        </CustomPromptContainer>

            <Box height={32}/>

            <TextField
                InputProps={{
                    sx: {borderRadius: 50, width: '80%', backgroundColor: '#F4F4F4', height: '62px'},
                    endAdornment: <IconButton type={'submit'} onClick={onSubmit}><ArrowCircleUp/></IconButton>
                }}
                value={inputPrompt}
                onChange={onChangePrompt}
                placeholder={placeHolder}
            />
        </div>
    );
}

export default CustomPromptInput;