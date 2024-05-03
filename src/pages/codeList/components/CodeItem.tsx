import React, { FC, useCallback } from 'react';
import { Divider, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { CodeEntity } from '../../../data/CodeEntity';
import styles from '../../../global.module.css';
import { calcTimeDiff } from '../../../utils/DayJsHelper';

interface Props {
	children?: React.ReactNode;
	item: CodeEntity;
}
const CodeItem: FC<Props> = ({ item }) => {
    return (
        <ListItem style={{paddingLeft:'0px',paddingRight:'0px', paddingTop:'4px',paddingBottom:'4px'}}>
					<ListItemText>
						<div style={{ display: 'flex', alignItems: 'start', flexDirection : 'column' , 
                                paddingTop:'24px',
                                paddingBottom:'24px',
                                backgroundColor:'#F3F6FD',
                                }}>

							<div style={{
								display: 'flex',
								alignItems: 'center',
								// width: item.formType === 'code' ? '65%' : '75%',
                               
							}}>
								<div style={{marginLeft:'8px', fontSize:'24px',}} className={styles.textOverflow}>
									{item.title}
								</div>
							</div>

                            {/* 내용 */}
							<div style={{ display: 'flex', alignItems: '', flexDirection : 'row', marginLeft:'8px' , marginTop:'8px'}}>
								<div className={styles.textOverflow} style={{textAlign: 'center',color:'grey'}}>
									{parseInt(item.price.toString()).toLocaleString()}p
								</div>
					
							<div className={styles.textOverflow} style={{ textAlign: 'center',marginLeft:'16px', color:'grey'}}>
								{/* {userById.nickname} */}
                                닉네임
							</div>
							<div className={styles.textOverflow} style={{textAlign: 'center', marginLeft:'16px', color:'grey'  }}>
								{calcTimeDiff(item.createdAt)}
							</div>
                            </div>
						</div>
					</ListItemText>
				</ListItem>
    );
}
export default CodeItem; 