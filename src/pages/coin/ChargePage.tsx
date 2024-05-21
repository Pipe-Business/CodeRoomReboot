import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import { Box } from '@mui/material';
import PointData from './component/PointData';
import FullLayout from '../../layout/FullLayout';

interface Props {
	children?: React.ReactNode;
}

const ChargePage: FC<Props> = () => {
    return (
      <FullLayout>
        <div style={{margin: 64}}>
            <Box height={32}/>
             <h1 style={{ marginLeft: '20px' }}>캐시 충전</h1>
			<PointData />
            <Box height={64}></Box>
            </div>
    </FullLayout>
    );
}
export default ChargePage;