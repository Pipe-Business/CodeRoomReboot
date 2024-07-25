import React, {FC} from "react";
import MainLayout from "../../../layout/MainLayout";
import {CenterBox} from "../styles";
import Lottie from "lottie-react";
import loadingLottie from "../../../assets/aibuilderLoading.json";

interface Props {

}

const Loading:FC<Props> = () => {
    return (
        <MainLayout>
            <CenterBox style={{justifyContent: 'center'}}>
                <div style={{fontSize: '24px', fontWeight:'bold'}}>요청사항을 처리 중입니다.. 잠시만 기다려주세요</div>
                <Lottie animationData={loadingLottie}/>
            </CenterBox>
        </MainLayout>
    );
}

export default Loading;