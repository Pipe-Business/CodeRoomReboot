import React, { FC } from 'react';
import BaseLayout from './BaseLayout.tsx';
import Grid from '@mui/material/Unstable_Grid2';
import HeaderLayout from './HeaderLayout.tsx';
import { Divider, Hidden } from '@mui/material';

interface Props {
	children?: React.ReactNode;
}

const MainLayout: FC<Props> = ({ children }) => {
	//const { isLoadingUserLogin, userLogin } = useQueryUserLogin();


	// xs -> sm -> md -> lg -> xl
	return (
		<div>
			<div style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 2 }}>
				<BaseLayout>
					<HeaderLayout />
				</BaseLayout>
				<Divider />
			</div>
			<BaseLayout>
				<Grid container columns={24} spacing={4}>
					<Hidden only={['xs', 'sm']}>
						<Grid xs={false} sm={false} md={6} lg={6} xl={6}>
							<div style={{ marginTop: 16 }}>
								{/*isLoadingUserLogin ? <ProfileCardSkeleton /> : userLogin ? <UserProfile /> : <Login />*/}
							</div>
						</Grid>

					</Hidden>
					<Grid xs={24} sm={24} md={18} lg={18} xl={18}>
						<div>

							{children}
						</div>
					</Grid>
				</Grid>

			</BaseLayout>
		</div>
	);
};

export default MainLayout;