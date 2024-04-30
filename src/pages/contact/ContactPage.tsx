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

const ContactPage: FC<Props> = () => {
    return (
    <h2>
        문의하기
    </h2>);
}
export default ContactPage;