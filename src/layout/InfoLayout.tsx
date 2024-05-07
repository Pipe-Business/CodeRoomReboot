import React, { FC, useCallback } from 'react';
import { Card, CardContent, CardHeader, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

interface Props {
	children?: React.ReactNode;
	header: string;
	navigateUrl?:string
}

const InfoLayout: FC<Props> = ({ header,children,navigateUrl }) => {
	const navigate = useNavigate();
	const onClickBackButton = useCallback(() => {
		if(navigateUrl){
			navigate(navigateUrl);
		}else{
			navigate(-1);
		}
	}, [navigateUrl]);
	return (
		<Card>
			<CardHeader
				avatar={<IconButton onClick={onClickBackButton}><ArrowBackIcon /></IconButton>}
				title={header}
				titleTypographyProps={{fontSize:'24px', fontWeight:'bold'}}
			/>
			<CardContent>
				{children}
			</CardContent>
		</Card>
	);
};

export default InfoLayout;