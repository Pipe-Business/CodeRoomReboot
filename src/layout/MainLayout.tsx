import React, { FC } from 'react';
import BaseLayout from './BaseLayout.tsx';
import Grid from '@mui/material/Unstable_Grid2';
import HeaderLayout from './HeaderLayout.tsx';
import { Box, Divider } from '@mui/material';
import styled from "@emotion/styled"
import FooterLayout from './FooterLayout.tsx';

interface Props {
	children?: React.ReactNode;
}

const MainLayoutWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  padding: 16px;
  width: 100%;
  max-width: 1200px;
  margin: auto;

  @media (max-width: 600px) {
    padding: 8px;
  }
`

const MainLayout: FC<Props> = ({ children }) => {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
			<Box sx={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 2, width: '100%' }}>
				<BaseLayout>
					<HeaderLayout />
				</BaseLayout>
				{/* <Divider /> */}
			</Box>
			<Box sx={{ flex: 1 }}>
				<BaseLayout>
					<MainLayoutWrapper>
						<Box sx={{ mt: 2, width: '100%' }}>
							{children}
						</Box>
					</MainLayoutWrapper>
				</BaseLayout>
			</Box>
			<BaseLayout>
				<FooterLayout />
			</BaseLayout>
		</Box>
	);
};

export default MainLayout;
