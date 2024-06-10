import React, {FC, useCallback} from 'react';
import {useQuery} from '@tanstack/react-query';

import {Divider, ListItem, ListItemButton, ListItemText} from '@mui/material';
import {useNavigate, useParams} from 'react-router-dom';
import {apiClient} from '../../../../api/ApiClient';
import {User} from '@supabase/supabase-js';
import dayjs from 'dayjs';
import {MentoringResponseEntity} from "../../../../data/entity/MentoringResponseEntity";

interface Props {
	children?: React.ReactNode;
	mentoringData: MentoringResponseEntity;
	userLogin: User;
}

const MentoringItem: FC<Props> = ({ mentoringData, userLogin }) => {
	const { userId } = useParams();
	const navigate = useNavigate();
	const { data: mentorUserData} = useQuery({
		queryKey: ['users', mentoringData?.to_user_token, 'nickname'],
		queryFn: () => apiClient.getTargetUser(mentoringData.from_user_token),
	});
	const onClickListItem = useCallback((e: any) => {
		e.stopPropagation();
		if (mentoringData) {
			navigate(`/profile/my/mentoring/${mentoringData?.id}`,
			{state: {
				mentoringItemData : mentoringData,
				mentorInfo : mentorUserData
			}});
		}
	}, [mentoringData]);
	
	if (!mentorUserData) {
		return <></>;
	}
	return (
		<>
			<ListItemButton onClick={onClickListItem}>
				<ListItem >
					<ListItemText>
					<div  style={{ display: 'flex'}}> 
					<div style={{ width: '20%',textOverflow:'ellipsis', overflow:'hidden', whiteSpace:'nowrap'}}>
					{mentoringData?.title}
					</div>
					{/* <div style={{ width: '20%', textOverflow:'ellipsis', overflow:'hidden', whiteSpace:'nowrap'}}>
					{mentorUserData?.nickname}
						</div> */}
						<div style={{ width: '70%', textOverflow:'ellipsis', overflow:'hidden', whiteSpace:'nowrap'}}>
					{mentoringData?.content}	
					</div>
					<div style={{ width: '10%',}}>
					{dayjs(mentoringData.request_date).format('YYYY-MM-DD')}
					</div>
					</div>
					
					</ListItemText>
				</ListItem>

			</ListItemButton>
			<Divider />
		</>


	);
};

export default MentoringItem;