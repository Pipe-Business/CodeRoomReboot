import { ListItem, ListItemButton, ListItemText } from '@mui/material';
import React, { FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CodeModel } from '../../../data/model/CodeModel';
import styles from '../../../global.module.css';
import { calcTimeDiff } from '../../../utils/DayJsHelper';



interface Props {
	children?: React.ReactNode;
	item: CodeModel;
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

						{/* 포인트, 닉네임, 시간*/}
						<div style={{ display: 'flex', alignItems: '', flexDirection: 'row', marginLeft: '8px', marginTop: '8px' }}>
							<div className={styles.textOverflow} style={{ textAlign: 'center', color: 'grey', fontWeight: 'bold' }}>
								{parseInt(item.price.toString()).toLocaleString()} c
							</div>
						</div>


						{/*  태그, 좋아요 수, popularity*/}
						<div style={{ display: 'flex', alignItems: '', flexDirection: 'row', marginLeft: '8px', marginTop: '8px' }}>
							{/* <div className={styles.textOverflow} style={{textAlign: 'center',color:'grey'}}>
									{item.hashTag.map((e)=>`#${e} `)}
								</div> */}

							{/* <div className={styles.textOverflow} style={{ textAlign: 'center',marginLeft:'16px', color:'grey'}}>
								{0}
							</div> */}
							<div className={styles.textOverflow} style={{ textAlign: 'center', color: 'grey' }}>
								{/* 코드룸 포인트 : {item.popularity} */}
								코드룸 포인트 : {item.buyerCount*item.price}
							</div>

							{/* <div className={styles.textOverflow} style={{ textAlign: 'center',marginLeft:'16px', color:'grey'}}>
								 {userById.nickname} 
                                닉네임
							</div> */}
							<div className={styles.textOverflow} style={{ textAlign: 'center', marginLeft: '16px', color: 'grey' }}>
								{calcTimeDiff(item.createdAt)}
							</div>

						</div>
					</div>
				</ListItemText>
			</ListItem>

		</ListItemButton>
	);
}
export default CodeItem; 