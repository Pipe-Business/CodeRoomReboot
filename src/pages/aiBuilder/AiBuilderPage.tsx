import React, {FC, useCallback, useState} from "react";
import MainLayout from "../../layout/MainLayout";
import {Box, Card, CardHeader, IconButton, Typography} from "@mui/material";
import {ArrowBack} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import BuilderMenuListItemButton from "./components/builderMenuListItemButton";
import {CenterBox, GoToCustomBtnContainer} from "./styles";
import {useRecoilState} from "recoil";
import {aiBuilderStepStatus, suggestPromptState} from "./atom";
import {apiClient} from "../../api/ApiClient";
import Lottie from "lottie-react";
import loadingLottie from "../../assets/aibuilderLoading.json";

interface Props {
    children?: React.ReactNode;
}

const AiBuilderPage: FC<Props> = ({children}) => {

    const navigate = useNavigate();
    const onClickBackButton = useCallback(() => {
        navigate(-1);
    }, []);

    const [stepStatus, setStepStatus] = useRecoilState(aiBuilderStepStatus);
    const [isLoading, setIsLoading] = useState(false);

    if(isLoading){ // tood 생성중입니다 로딩
        return  <MainLayout>
            <CenterBox>
                <div style={{display: 'flex', justifyContent: 'center', width: '256px', height: '256px'}}>
                    <Lottie animationData={loadingLottie}/>
                </div>
            </CenterBox>
        </MainLayout>
    }


    return <MainLayout>
        <Card
            elevation={0}
            sx={{
                width: {xs: '100%', md: '100%'},
                borderRadius: 2,
                overflow: 'hidden',
                mb: {xs: 2, md: 0},
            }}
        >
            <CardHeader
                avatar={
                    <IconButton onClick={onClickBackButton}>
                        <ArrowBack sx={{fontSize: '32px'}}/>
                    </IconButton>
                }
                title={
                    <Typography variant="h5" component="div" sx={{fontWeight: 'bold', color: '#333', fontSize:'32px'}} >
                        AI 코드 빌더 ROOMY
                    </Typography>
                }
            />
            <Box height={32}/>
            <div style={{fontSize: '22px'}}>추천 카테고리</div>

            <Box height={64}/>
            <div style={{display: 'flex', flexDirection: 'row', width: '100%'}}>
                <BuilderMenuListItemButton title={'서비스 기획'} content={'기능정의서, PRD 제작과\n개발에 필요한 AI 개발 프롬프트 서비스 제공'}
                                           height={'300px'}
                                           onClick={async() => {
                                               setIsLoading(true);
                                               const ideaList: string[] = await apiClient.servicePlanningByGpt();
                                               setIsLoading(false);
                                               navigate('/aibuilder/serviceplanning', {state: {ideaList:ideaList}});
                    setStepStatus(1);
                }}/>
                <BuilderMenuListItemButton title={'서비스 개발'} content={'원하시는 기능의 모듈코드를 생성하는\n서비스 제공'} onClick={() => {

                }}/>
                <BuilderMenuListItemButton title={'코드 개선'} content={'보유 코드에 대한 코드 리뷰, 코드 최적화 서비스 제공'} onClick={() => {
                    navigate('/aibuilder/refactoring');
                    setStepStatus(1);
                }}/>
            </div>


            <Box height={128}/>

            <GoToCustomBtnContainer onClick={() => {
            }}>
                <div style={{fontSize: '24px',fontWeight:'bold', textAlign:'start'}}>
                    사용자 정의 방식 (Custom)으로 코드 제작하기 ▶️
                </div>

                <Box height={8}/>

                <div style={{fontSize: '18px', color: 'grey'}}>
                    클릭 시 직접 입력 화면으로 이동
                </div>

            </GoToCustomBtnContainer>
        </Card>
    </MainLayout>
}
export default AiBuilderPage;