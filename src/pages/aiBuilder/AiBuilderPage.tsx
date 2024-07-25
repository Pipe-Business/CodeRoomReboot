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
import Loading from "./components/loading";

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

    if(isLoading){
        return <Loading />
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
                        AI 빌더
                    </Typography>
                }
            />
            <Box height={32}/>
            <div style={{fontSize: '22px'}}>원하시는 대화 상대를 선택해주세요</div>

            <Box height={32}/>
            <div style={{display: 'flex', flexDirection: 'row', width: '100%'}}>
                <BuilderMenuListItemButton title={'스타트업 기획자 미연'} content={'아이데이션, MVP 기획 전문가\nIT 서비스 개발에 필요한 기획서 작성'}
                                           height={'300px'}
                                           imagePath={'/image/aibuilder-serviceplanning.svg'}
                                           onClick={async() => {
                                               setIsLoading(true);
                                               const ideaList: string[] = await apiClient.servicePlanningByGpt();
                                               setIsLoading(false);
                                               navigate('/aibuilder/serviceplanning', {state: {ideaList:ideaList}});
                                               setStepStatus(1);
                }}/>
                <BuilderMenuListItemButton title={'대기업 IT 사수 Jackson'} content={'현업 개발자 출신의 멘토\n비즈니스 관련 코드 개발 전문'}
                                           height={'300px'}
                                           imagePath={'/image/aibuilder-businesscode.svg'}
                                           onClick={() => {

                }}/>
                <BuilderMenuListItemButton title={'코딩테스트 마스터 민준'} content={'코딩 알고리즘 개발과 관련된 질문\n코딩 테스트 문제 풀이 전문'}
                                           height={'300px'}
                                           imagePath={'/image/aibuilder-codetest.svg'}
                                           onClick={() => {
                                            navigate('/aibuilder/refactoring');
                                            setStepStatus(1);
                }}/>
                <BuilderMenuListItemButton title={'프로젝트 리딩 PM Mia'} content={'프로젝트 분석 피드백 전문가\n디버깅, 리뷰, 리펙토링제안'}
                                           height={'300px'}
                                           imagePath={'/image/aibuilder-pm.svg'}
                                           onClick={() => {
                                               navigate('/aibuilder/refactoring');
                                               setStepStatus(1);
                                           }}/>
                <BuilderMenuListItemButton title={'코딩강사 Amy'} content={'부트캠프 출신 코딩강사\n코딩학습 관련 질문 최적화'}
                                           height={'300px'}
                                           imagePath={'/image/aibuilder-codestudy.svg'}
                                           onClick={() => {
                                               navigate('/aibuilder/refactoring');
                                               setStepStatus(1);
                                           }}/>
            </div>


            <Box height={128}/>
        </Card>
    </MainLayout>
}
export default AiBuilderPage;