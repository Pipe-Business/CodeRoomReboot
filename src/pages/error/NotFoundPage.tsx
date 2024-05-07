import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import { CenterBox } from '../main/styles';
import { Link } from 'react-router-dom';
import { TextButton } from '../main/styles';

interface Props {
    children?: React.ReactNode;
}

const NotFoundPage: FC<Props> = () => {
    return (
        <CenterBox style={{ flexDirection: 'column' }}>
            <h2>
                404 NotFound
            </h2>
            <h2>
                웹 페이지를 표시 할 수 없습니다. 경로가 잘못되었을 수 있습니다.
            </h2>
            <Link to={'/'}>
                <TextButton type={'submit'} sx={{ fontSize: '15', }}>홈으로</TextButton>
            </Link>
        </CenterBox>
    );
}
export default NotFoundPage;