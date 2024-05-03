import React, { FC, useCallback } from 'react';
import { Divider, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { CodeEntity } from '../../../data/CodeEntity';
import styles from '../../../global.module.css';

interface Props {
	children?: React.ReactNode;
	item: CodeEntity;
}
const CodeItem: FC<Props> = ({ item }) => {
    return (
        <ListItem>
					<ListItemText>
						<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
							<div style={{
								display: 'flex',
								alignItems: 'center',
								// width: item.formType === 'code' ? '65%' : '75%',
							}}>
							{/* {	<PictogramImage size={40} formType={item.formType} category={item.category} />} */}
								<div style={{marginLeft:'8px'}} className={styles.textOverflow}>
									{item.title}
								</div>
							</div>
							{/* {item.formType === 'code' && */}
								<div className={styles.textOverflow} style={{ width: '10%', textAlign: 'center' }}>
									{parseInt(item.price.toString()).toLocaleString()}p
								</div>
							{/* } */}
							<div className={styles.textOverflow} style={{ width: '15%', textAlign: 'center' }}>
								{/* {userById.nickname} */}
                                닉네임
							</div>
							<div className={styles.textOverflow} style={{ width: '10%', textAlign: 'center' }}>
								{item.createdAt}
							</div>
						</div>
					</ListItemText>
				</ListItem>
    );
}
export default CodeItem; 