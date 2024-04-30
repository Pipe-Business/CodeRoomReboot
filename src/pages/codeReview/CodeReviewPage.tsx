import React, { FC, useState } from 'react';
import styled from '@emotion/styled';

interface Props {
	children?: React.ReactNode;
}
const CardSection = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;
const CenterWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CodeReviewPage: FC<Props> = () => {
    return (
    <h2>
        코드리뷰 페이지 준비중입니다.
    </h2>);
}
export default CodeReviewPage;