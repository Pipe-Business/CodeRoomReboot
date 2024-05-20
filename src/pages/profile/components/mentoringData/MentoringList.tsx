import React, { FC } from 'react';
import MentoringItem from './MentoringItem.tsx';
import { User } from '@supabase/supabase-js';
import { Divider, List, ListItem, ListItemText } from '@mui/material';

interface Props {
	children?: React.ReactNode,
	mentoringData?: MentoringResponseEntity[] | null,
	userLogin:User
}

const MentoringList: FC<Props> = ({ mentoringData, userLogin }) => {
	console.log("mentoring",mentoringData);

	const Header: FC = () => {
		return <ListItem>
			<ListItemText>
				<div style={{ display: 'flex', justifyContent: 'space-between', marginLeft:'10px' }}>
					<div style={{ width: '20%' ,fontWeight:'bold'}}>제목</div>
					<div style={{ width: '20%' ,fontWeight:'bold'}}>멘토</div>
					<div style={{ width: '50%' ,fontWeight:'bold'}}>내용</div>
					<div style={{ width: '10%' ,fontWeight:'bold'}}>신청날짜</div>
				</div>
			</ListItemText>
	
		</ListItem>;
	};

	return (
		<>
			<List>
				<Header/>
				{mentoringData && mentoringData.map((v,i) => {
					return <MentoringItem key={i} mentoringData={v} userLogin={userLogin}/>;
				})}
			</List>
		</>
	);
};

export default MentoringList;