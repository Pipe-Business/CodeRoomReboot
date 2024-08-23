import React, { FC, useEffect, useState } from 'react';
import BaseLayout from './BaseLayout';
import HeaderLayout from './HeaderLayout';
import { Box } from '@mui/material';
import styled from "@emotion/styled"
import FooterLayout from './FooterLayout';

interface Props {
	children?: React.ReactNode;
}

const MainLayoutWrapper = styled(Box)`
	display: flex;
	justify-content: center;
	padding: 16px;
	width: 100%;
	margin: auto;
	@media (max-width: 600px) {
		padding: 8px;
	}
`

const MainLayout: FC<Props> = ({ children }) => {
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			if (currentScrollY > 50) {
				setIsScrolled(true);
			} else {
				setIsScrolled(false);
			}
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
			<Box sx={{
				position: 'sticky',
				top: 0,
				zIndex: 1000,
				width: '100%'
			}}>
				<HeaderLayout isScrolled={isScrolled} />
			</Box>
			<Box sx={{ flex: 1, width: '100%' }}>
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