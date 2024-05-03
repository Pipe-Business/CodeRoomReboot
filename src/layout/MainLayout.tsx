import React, { FC } from 'react';
import BaseLayout from './BaseLayout.tsx';
import Grid from '@mui/material/Unstable_Grid2';
import HeaderLayout from './HeaderLayout.tsx';
import { Divider, Hidden } from '@mui/material';
import { CenterBox } from '../components/styles.ts';
import styled from "@emotion/styled"
import FooterLayout from './FooterLayout.tsx';

interface Props {
	children?: React.ReactNode;
}

const MainLayoutWrapper = styled.div`
  display: flex;
  justify-content: center;
`


const MainLayout: FC<Props> = ({ children }) => {
	//const { isLoadingUserLogin, userLogin } = useQueryUserLogin();


	// xs -> sm -> md -> lg -> xl
	return (
		<div>
			<div style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 2 }}>
				<BaseLayout>
					<HeaderLayout />
				</BaseLayout>
				{/* <Divider /> */}
			</div>
			<BaseLayout>
				{/* <Grid container columns={24} spacing={4}>
				<Grid xs={24} sm={24} md={18} lg={18} xl={18}> */}
				 <MainLayoutWrapper>
							<div style={{marginTop : 16}}>
							{children}
							</div>
							</MainLayoutWrapper>
					{/* </Grid>
				</Grid> */}
			</BaseLayout>
			<BaseLayout>
			<FooterLayout />
			</BaseLayout>
		</div>
	);
};

export default MainLayout;