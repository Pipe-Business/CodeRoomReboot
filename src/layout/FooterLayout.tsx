import React, {FC} from 'react';
import {FooterWrapper} from './styles';
import {FooterBox, MarginHorizontal} from '../components/styles';

interface Props {
    children?: React.ReactNode;
}

const FooterLayout: FC<Props> = () => {
    return (
        <FooterWrapper>
            <footer style={{ display: 'flex', alignItems: 'center', flexDirection : 'column'}}>
                <FooterBox style={{flexDirection :'row'}}>
                    <MarginHorizontal size={8}>
                        <span style={{ color: '#000000', fontSize: '12px', }}>상호명 : 파이프빌더 | 대표자 : 김상훈, 이홍철</span>
                    </MarginHorizontal>
                    <MarginHorizontal size={8}>
                        <span style={{ color: '#000000', fontSize: '12px', }}>이메일 : pipebuilders@gmail.com</span>
                    </MarginHorizontal>
                </FooterBox>
                <FooterBox style={{flexDirection :'row'}}>
                    <MarginHorizontal size={8}>
                        <span style={{ color: '#000000', fontSize: '12px', }}>통신판매업신고: 2023-서울은평-1122</span>
                    </MarginHorizontal>
                    <MarginHorizontal size={8}>
                        <span style={{ color: '#000000', fontSize: '12px', }}>사업자 번호 : 197-56-00693</span>
                    </MarginHorizontal>
                </FooterBox>
                <MarginHorizontal size={8}>
                        <span style={{ color: '#000000', fontSize: '12px', }}>주소 : 서울특별시 금천구 독산동 331-28</span>
                    </MarginHorizontal>
                
            </footer>
           
        </FooterWrapper>
    );
};
export default FooterLayout