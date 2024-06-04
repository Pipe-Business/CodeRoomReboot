import { ListItem, ListItemButton, ListItemText } from '@mui/material';
import React, { FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CodeModel } from '../../../data/model/CodeModel';
import styles from '../../../global.module.css';
import { calcTimeDiff } from '../../../utils/DayJsHelper';
import {Box} from '@mui/material';
import { MainPageCodeListEntity } from '../../../data/entity/MainPageCodeListEntity';

interface Props {
	children?: React.ReactNode;
	item: MainPageCodeListEntity;
}
const CodeItem: FC<Props> = ({item}) => {

	const navigate = useNavigate();
	const onClickCode = useCallback(() => {
		navigate(`/code/${item.id}`);
	}, [item.id]);
	
	return (
		<ListItemButton sx={{
			'&:hover': {
				backgroundColor: '#999',
			},
		}} onClick={onClickCode}>
			<ListItem style={{ paddingLeft: '0px', paddingRight: '0px', paddingTop: '4px', paddingBottom: '4px' }}>
				<ListItemText>
					<div style={{
						display: 'flex', alignItems: 'start', flexDirection: 'column',
						paddingTop: '24px',
						paddingBottom: '24px',
						backgroundColor: '#F3F6FD',
					}}>

						<div style={{
							display: 'flex',
							alignItems: 'center',
							// width: item.formType === 'code' ? '65%' : '75%',

						}}>
							<div style={{ marginLeft: '8px', fontSize: '24px', }} className={styles.textOverflow}>
								{item.title}
							</div>
						</div>

						{/* 캐시, 닉네임, 시간*/}
						<div style={{ display: 'flex', alignItems: '', flexDirection: 'row', marginLeft: '8px', marginTop: '8px' }}>
							<div className={styles.textOverflow} style={{ textAlign: 'center', color: 'grey', fontWeight: 'bold' }}>
								{parseInt(item.price.toString()).toLocaleString()} ©
							</div>
							<Box width={8}/>
							<div className={styles.textOverflow} style={{ textAlign: 'center', color: 'grey', fontWeight: 'bold' }}>
								{parseInt((item.price* 5).toString()).toLocaleString()} 🌱
							</div>
						</div>


						{/*  태그, 좋아요 수, popularity*/}
						<div style={{ display: 'flex', alignItems: '', flexDirection: 'row', marginLeft: '8px', marginTop: '8px' }}>
							{/* <div className={styles.textOverflow} style={{textAlign: 'center',color:'grey'}}>
									{item.hashTag.map((e)=>`#${e} `)}
								</div> */}

							<div className={styles.textOverflow} style={{ textAlign: 'center', color:'grey'}}>
								좋아요 : {item.likeCount} 
							</div>

							<div className={styles.textOverflow} style={{ textAlign: 'center', color: 'grey',marginLeft:'16px' }}>
								{/* 코드룸 포인트 : {item.popularity} */}
								코드룸 포인트 : {item.buyerCount*item.price}
							</div>

							<div className={styles.textOverflow} style={{ textAlign: 'center', color: 'grey',marginLeft:'16px' }}>
								후기 : {item.reviewCount}
							</div>
							
							

						</div>
						<div className={styles.textOverflow} style={{ textAlign: 'center', marginLeft: '8px', color: 'grey' }}>
								{calcTimeDiff(item.createdAt)}
							</div>
					</div>
				</ListItemText>
			</ListItem>

		</ListItemButton>
	);
}
export default CodeItem; 