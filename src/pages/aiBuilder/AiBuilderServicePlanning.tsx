import React, {FC, useEffect} from "react";
import MainLayout from "../../layout/MainLayout";
import {IconButton} from "@mui/material";
import {useRecoilState} from "recoil";
import {aiBuilderStepStatus, suggestPromptState} from "./atom";
import BuilderMenuListItemButton from "./components/builderMenuListItemButton";
import AibuilderPageLayout from "./components/aiBuilderPageLayout";
import {CopyAll} from "@mui/icons-material";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {RightEndContainer} from "./styles";
import {toast} from "react-toastify";
import BuilderMenuListItem from "./components/buidlerMenuListItem";


interface Props {
    children?: React.ReactNode;
}
const dummy =[
    "AI 기반 원격 진료 서비스:AI를 활용하여 초기 진단과 치료 계획을 지원하는 원격 진료 플랫폼",
    "사이버 보안 인텔리전스 플랫폼:실시간 위협 탐지와 자동 대응을 제공하는 사이버 보안 솔루션",
    "블록체인 공급망 추적 시스템:생산부터 배송까지 전 과정을 실시간으로 추적하는 블록체인 기반 시스템",
    "스마트 헬스 트래커:사용자의 건강 상태를 측정하고 분석하여 맞춤형 건강 조언을 제공하는 웨어러블 디바이스",
    "AI 기반 금융 사기 탐지 시스템:대규모 금융 데이터를 실시간 분석하여 잠재적 사기를 빠르게 탐지하는 솔루션",
    "원격 교육 플랫폼:화상 수업과 학습 관리 기능을 통합한 원격 교육 솔루션",
    "스마트 홈 에너지 관리 시스템:가정 내 전력 소비를 실시간으로 모니터링하고 최적화하는 스마트 에너지 시스템",
    "AR 기반 쇼핑 앱:사용자가 상품을 가상으로 체험하고 구매할 수 있는 증강 현실 쇼핑 애플리케이션",
    "개인 정보 보호 브라우저:사용자의 웹 활동과 데이터를 안전하게 보호하는 브라우저",
    "물류 최적화 시스템:운송 경로와 재고를 실시간으로 관리하여 물류 비용을 절감하는 시스템",
    "AI 기반 HR 솔루션:이력서 분석부터 면접 일정 관리까지 자동화된 인사 관리 솔루션",
    "화상 상담 서비스:전문 상담사와 즉시 화상 연결이 가능한 상담 서비스",
    "스마트 마케팅 플랫폼:고객 데이터를 분석해 최적의 마케팅 전략을 제안하는 플랫폼",
    "드론 기반 물류 시스템:드론을 이용해 물류와 배송 과정을 자동화하는 시스템",
    "에너지 소비 분석 앱:가정이나 기업의 에너지 소비를 모니터링하고 효율화를 제안하는 앱",
    "버추얼 이벤트 플랫폼:온라인으로 대규모 이벤트를 개최하고 관리할 수 있는 플랫폼",
    "블록체인 투표 시스템:안전하고 투명하게 온라인 투표를 진행할 수 있는 블록체인 기반 시스템",
    "VR 기반 교육 플랫폼:가상현실을 통해 실감 나는 학습 경험을 제공하는 교육 플랫폼",
    "AI 음성 비서:사용자의 음성을 인식하고 다양한 정보를 제공하며 작업을 수행하는 AI 음성 비서",
    "맞춤형 콘텐츠 추천 시스템:사용자의 관심사를 분석해 개인 맞춤형 미디어 콘텐츠를 추천하는 시스템"
];

const dummyAnswer= "음식 나눔 및 음식물 쓰레기 감소 앱 기획서 (PRD 및 기능정의서)\n" +
    "1. 개요\n" +
    "음식 나눔 및 음식물 쓰레기 감소 앱은 잉여 음식을 가진 사용자와 이를 필요로 하는 지역 쉼터, 푸드뱅크, 개인을 연결하여 음식물 쓰레기를 줄이는 것을 목표로 합니다. 또한, 음식을 낭비하지 않도록 돕는 레시피와 팁을 제공하고, 가정 내 음식물 쓰레기 감소 추적 기능을 갖추고 있습니다.\n" +
    "\n" +
    "2. 목표\n" +
    "주요 목표: 잉여 음식을 공유함으로써 음식물 쓰레기를 줄입니다.\n" +
    "부차적 목표: 사용자에게 음식물 쓰레기 감소 기술을 교육하고 개인의 음식물 쓰레기 감소 노력을 추적합니다.\n" +
    "3. 주요 기능\n" +
    "사용자 등록 및 프로필 관리\n" +
    "\n" +
    "이메일, 소셜 미디어 또는 전화번호로 회원가입 가능.\n" +
    "사용자 유형(기부자, 수령자, 양쪽 모두), 위치 및 선호도를 포함한 프로필 관리.\n" +
    "음식 나눔 플랫폼";

const promptDummy:string[]= [
    "회원가입 및 로그인 기능:이메일, 소셜 미디어, 전화번호를 통한 회원가입과 기존 사용자 로그인을 어떻게 구현하나요?",
    "홈 화면:홈 화면의 내비게이션 메뉴와 빠른 링크를 구성하는 방법은 무엇인가요?",
    "목록 화면:음식 목록을 종류, 위치, 사용 가능 여부로 필터링하고 검색할 수 있는 기능을 어떻게 구현하나요?",
    "쓰레기 기록 화면:버려진 음식 항목을 기록하는 양식과 시각적 보고서를 생성하는 기능을 어떻게 구현하나요?",
    "교육 화면:레시피, 팁, 기사를 제공하고 특정 주제를 검색할 수 있는 기능을 어떻게 구현하나요?",
    "프로필 화면:사용자 정보 및 선호도 관리, 목록 및 상호작용 기록, 음식물 쓰레기 감소 분석 및 업적 표시 기능을 어떻게 구현하나요?",
    "사용자 관리:인증 및 권한 부여와 프로필 생성 및 관리 기능을 백엔드에서 어떻게 구현하나요?",
    "목록 관리:음식 목록의 CRUD 작업과 목록 상태 업데이트 기능을 백엔드에서 어떻게 구현하나요?",
    "메시징 서비스:사용자 간 인앱 메시징과 새 메시지 알림 기능을 어떻게 구현하나요?",
    "알림 시스템:푸시 알림과 중요 업데이트에 대한 이메일 알림 기능을 어떻게 구현하나요?"
]

// 서비스 기획 페이지
const AiBuilderServicePlanning: FC<Props> = ({children}) => {
    const [suggestPrompt, setSuggestPrompt] = useRecoilState(suggestPromptState);
    const [stepStatus, setStepStatus] = useRecoilState(aiBuilderStepStatus);
    const answer:string = dummyAnswer;

    const handleCopyClipBoard = async () => {
        try{
            await navigator.clipboard.writeText(answer);
            toast.success('복사 완료!');
        }catch(error){
            console.error(error);
            toast.error('복사에 실패했습니다.');
        }
    }

    const handleShowPromptList = () => {
        //todo gpt 개발에 필요한 프롬프트 리스트 질문
        //todo set answer
        setStepStatus(3);
    }

    useEffect(() => {
        //todo api 요청
    }, []);


    return <MainLayout>
        {
            stepStatus === 1 &&
            <AibuilderPageLayout pageHeaderTitle={"AI 코드 빌더 ROOMY가 추천하는 아이디어✨"} cardHeaderTitle={"기획서로 작성하고 싶으신 아이디어를 선택해주세요"}>
                {dummy.map((item, index) => {
                    let splitedList = item.split(':');
                    let title: string = splitedList[0];
                    let content: string = splitedList[1];
                    return <BuilderMenuListItemButton title={title} content={content} width={'80%'} onClick={() => {
                        setStepStatus(2);
                        //todo gpt 질문
                        //todo set answer
                    }}/>
                })}
            </AibuilderPageLayout>
        }

        {stepStatus === 2 && <div>
            <AibuilderPageLayout pageHeaderTitle={"AI 코드 빌더 ROOMY가 작성한 기획서"}>
                <div>
                {answer}
                </div>
                <RightEndContainer>
                <IconButton onClick={handleCopyClipBoard}>
                    <CopyAll /> 복사하기
                </IconButton>
                <button
                    onClick={handleShowPromptList}
                    style={{alignItems:'center', fontWeight:'bold', fontSize:'20px',}}>개발에 필요한 AI 프롬프트 리스트 확인 <NavigateNextIcon/></button>
                </RightEndContainer>
            </AibuilderPageLayout>
        </div>}

        {
            stepStatus === 3 &&
            <AibuilderPageLayout pageHeaderTitle={"AI 코드 빌더 ROOMY가 생성한 프롬프트✨"} cardHeaderTitle={"개발에 필요한 AI 프롬프트 리스트 확인"}>
                {promptDummy.map((item, index) => {
                    let splitedList = item.split(':');
                    let title: string = splitedList[0];
                    let content: string = splitedList[1];
                    return <BuilderMenuListItem title={title} content={content} width={'80%'}/>
                })}
            </AibuilderPageLayout>
        }

    </MainLayout>;
}
export default AiBuilderServicePlanning;