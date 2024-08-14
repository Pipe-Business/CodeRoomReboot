import React, {FC, useCallback} from 'react';
import {useQuery} from '@tanstack/react-query';

import {Divider, ListItem, ListItemButton, ListItemText} from '@mui/material';
import {useNavigate, useParams} from 'react-router-dom';
import {apiClient} from '../../../../api/ApiClient';
import {User} from '@supabase/supabase-js';
import dayjs from 'dayjs';
import {LikeResponseEntity} from "../../../../data/entity/LikeResponseEntity";

interface Props {
	children?: React.ReactNode;
	likedData: LikeResponseEntity;
}

const LikedItem: FC<Props> = ({ likedData }) => {
	const navigate = useNavigate();
	const {isLoading, data: postData} = useQuery({
		queryKey: ['/post', likedData.post_id],
		queryFn: () => apiClient.getTargetCode(likedData.post_id),
	});
	// const onClickListItem = useCallback((e: any) => {
	// 	e.stopPropagation();
	// 	if (mentoringData) {
	// 		navigate(`/profile/my/mentoring/${mentoringData?.id}`,
	// 		{state: {
	// 			mentoringItemData : mentoringData,
	// 			mentorInfo : mentorUserData
	// 		}});
	// 	}
	// }, [mentoringData]);

	const onClickListItem = () => {
		navigate(`/code/${likedData.post_id}`);
	}
	
	if (isLoading) {
		return <></>;
	}
	return (
		<>
			<ListItemButton onClick={onClickListItem}>
				<ListItem >
					<ListItemText>
					<div  style={{ display: 'flex'}}> 
					<div style={{ width: '20%',textOverflow:'ellipsis', overflow:'hidden', whiteSpace:'nowrap'}}>
					{postData?.title}
					</div>
						<div style={{ width: '70%', textOverflow:'ellipsis', overflow:'hidden', whiteSpace:'nowrap'}}>
					{postData?.aiSummary}
					</div>
					{/*<div style={{ width: '10%',}}>*/}
					{/*{dayjs(postData?.createdAt).format('YYYY-MM-DD')}*/}
					{/*</div>*/}
					</div>
					
					</ListItemText>
				</ListItem>

			</ListItemButton>
			<Divider />
		</>


	);
};

export default LikedItem;