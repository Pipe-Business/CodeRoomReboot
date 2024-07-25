import React, {FC} from "react";
import {TitleContainer, TitleSelectAreaContainer, TitleSelectButtonContainer} from "../styles";
import {Box, IconButton, Typography} from "@mui/material";
import {Home, RestartAlt} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';

interface  Props{
    children?: React.ReactNode;
    title: string;
}

const AiBuilderHeader:FC<Props> = ({title}) => {

    const navigate = useNavigate();
    const onClickGoToHome = () => {
        navigate('/');
    }
    const onClickGoToSelectMain = () => {
        navigate('/aibuilder');
    }

    return (
        <TitleContainer>
            <Typography variant="h5" component="div" sx={{fontWeight: 'bold', color: '#333', fontSize:'32px'}} >
                {title}
            </Typography>
            <div>
                <TitleSelectAreaContainer>
                    <TitleSelectButtonContainer onClick={onClickGoToHome}>
                        <LogoutIcon sx={{fontSize: '24px'}}/>
                        <Typography variant="h6" component="div" sx={{fontWeight: 'bold'}}>
                           AI 빌더 종료
                        </Typography>
                    </TitleSelectButtonContainer>

                    <Box width="32px"/>

                    <TitleSelectButtonContainer onClick={onClickGoToSelectMain}>
                        <Home sx={{fontSize: '24px'}}/>
                        <Typography variant="h6" component="div" sx={{fontWeight: 'bold'}}>
                            선택 화면으로 돌아가기
                        </Typography>
                    </TitleSelectButtonContainer>
                </TitleSelectAreaContainer>
            </div>
        </TitleContainer>
    );
}

export default AiBuilderHeader;