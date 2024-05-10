import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import MainLayout from '../../layout/MainLayout';
import { Box } from '@mui/material';
interface Props {
	children?: React.ReactNode;
}

const CoinPage: FC<Props> = () => {
    return (
      <MainLayout>
        <Box height={128}/>
    <h2>
        포인트, 코인페이지 준비중입니다.
    </h2>
    <Box height={128}/>
    </MainLayout>
    );
}
export default CoinPage;