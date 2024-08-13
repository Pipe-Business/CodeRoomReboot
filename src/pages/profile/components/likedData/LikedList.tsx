import React, {FC} from 'react';
import LikedItem from './LikedItem.tsx';
import {User} from '@supabase/supabase-js';
import {List, ListItem, ListItemText} from '@mui/material';

interface Props {
	children?: React.ReactNode,
	likedData?: [] | null,
}

const LikedList: FC<Props> = ({ likedData }) => {

	const Header: FC = () => {
		return <ListItem>
			<ListItemText>
				<div style={{ display: 'flex', justifyContent: 'space-between', marginLeft:'10px' }}>
					<div style={{ width: '20%' ,fontWeight:'bold'}}>제목</div>
					{/* <div style={{ width: '20%' ,fontWeight:'bold'}}>멘토</div> */}
					<div style={{ width: '70%' ,fontWeight:'bold'}}>내용</div>
					{/*<div style={{ width: '10%' ,fontWeight:'bold'}}>게시일</div>*/}
				</div>
			</ListItemText>
	
		</ListItem>;
	};

	return (
		<>
			<List>
				<Header/>
				{likedData && likedData.map((v,i) => {
					return <LikedItem key={i} likedData={v} />;
				})}
			</List>
		</>
	);
};

export default LikedList;