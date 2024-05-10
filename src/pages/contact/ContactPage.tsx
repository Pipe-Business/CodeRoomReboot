import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import MainLayout from '../../layout/MainLayout';
import { Box } from '@mui/material';
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

const ContactPage: FC<Props> = () => {
  return (
    <MainLayout>
      <Box height={128}/>
  <h2>
      문의하기 페이지 준비중입니다.
  </h2>
  <Box height={128}/>
  </MainLayout>
  );
}
export default ContactPage;