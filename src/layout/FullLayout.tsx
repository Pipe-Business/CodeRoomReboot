import React, {FC} from "react";
import styled from "@emotion/styled"
import HeaderLayout from "./HeaderLayout";
import BaseLayout from "./BaseLayout";
import { Divider } from '@mui/material';
import FooterLayout from "./FooterLayout";

interface Props {
    children?: React.ReactNode
}

const FullLayoutWrapper = styled.div`
  display: flex;
`

const FullLayout: FC<Props> = ({children}) => {
    return (
        <>
            <div style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 2 }}>
                <BaseLayout>
                    <HeaderLayout />
                </BaseLayout>
                <Divider />
            </div>
            <BaseLayout>
                <FullLayoutWrapper>
                    <div style={{width:"100%"}}>{children}</div>
                </FullLayoutWrapper>
            </BaseLayout>
            <BaseLayout>
                    <FooterLayout />
                </BaseLayout>
        </>
    );
};

export default FullLayout;
