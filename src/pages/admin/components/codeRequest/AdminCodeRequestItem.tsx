import React, { FC, useCallback } from 'react';
//import { useQueryUserById } from '../../../../hooks/fetcher/UserFetcher.ts';
import { ListItem, ListItemButton, ListItemText } from '@mui/material';
import { reformatTime } from '../../../../utils/DayJsHelper.ts';
//import PictogramImage from '../../../../components/PictogramImage.tsx';
//import UserProfileImage from '../../../../components/UserProfileImage.tsx';
import { useNavigate } from 'react-router-dom';
import { CodeModel } from '../../../../data/model/CodeModel.ts';
import { useQueryUserById } from '../../../../hooks/fetcher/UserFetcher.ts';

interface Props {
	children?: React.ReactNode;
	item: CodeModel;
}

const AdminCodeRequestItem: FC<Props> = ({ item }) => {
	const { userById } = useQueryUserById(item.userToken);
	const navigator = useNavigate()
	const onClickNavigator = useCallback(()=>{
		navigator(`/admin/codeRequest/${item.userToken}/${item.id}`)

	},[])
	return (
		<ListItemButton onClick={onClickNavigator}>
			<ListItem>
				<ListItemText>
					<div style={{ display: 'flex' }}>
						<div style={{ width: '15%' }}>{reformatTime(item.createdAt)}</div>
						<div style={{ width: '5%' }}>
							{/* {item.formType === 'article' ? '글' : '코드'} */}
							코드
							</div>
						<div style={{ width: '30%' }}>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								{/* 이미지 추가 예정 */}
								{/* <UserProfileImage size={35} userId={item.userId} /> */}
								<div style={{ marginLeft: '4px' }}>
									<div>{userById?.nickname}</div>
									<div>{userById?.email}</div>
								</div>
							</div>
						</div>
						 <div style={{ width: '30%' }}>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								{/* <PictogramImage size={35} formType={item.formType} category={item.category} /> */}
								<div style={{ marginLeft: '4px' }}>
									<div>{item.title}</div>
									<div>{userById?.nickname}</div>
								</div>
							</div>
						</div> 
						<div style={{ width: '15%' }}>{item.price.toLocaleString()}p</div>
						<div
							style={{ width: '5%' }}>{item.state === 'pending' ? '요청' : item.state === 'reject' ? '반려' : '승인'}</div>
					</div>
				</ListItemText>
			</ListItem>

		</ListItemButton>
	);
};

export default AdminCodeRequestItem;