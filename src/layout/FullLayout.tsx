import React, {FC} from "react";
import styled from "@emotion/styled"
import HeaderLayout from "./HeaderLayout.tsx";
import BaseLayout from "./BaseLayout.tsx";
import { Divider } from '@mui/material';
import FooterLayout from "./FooterLayout.tsx";

interface Props {
    children?: React.ReactNode
}

const MainLayoutWrapper = styled.div`
  display: flex;
`

const MainLayout: FC<Props> = ({children}) => {
    return (
        <>
            <div style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 2 }}>
                <BaseLayout>
                    <HeaderLayout />
                </BaseLayout>
                <Divider />
            </div>
            <BaseLayout>
                <MainLayoutWrapper>
                    <div style={{width:"100%"}}>{children}</div>
                </MainLayoutWrapper>
            </BaseLayout>
            <BaseLayout>
                    <FooterLayout />
                </BaseLayout>
        </>
    );
};

export default MainLayout;
