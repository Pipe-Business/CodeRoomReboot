import React, { FC, useCallback, useState, useEffect } from 'react';
import { Divider, ListItem, ListItemButton, ListItemText, CircularProgress } from '@mui/material';
import { CodeModel } from '../../../data/model/CodeModel';
import styles from '../../../global.module.css';
import { calcTimeDiff } from '../../../utils/DayJsHelper';
import { apiClient, supabase } from '../../../api/ApiClient';
import { User } from '@supabase/supabase-js';
import { useNavigate, useParams } from 'react-router-dom';



interface Props {
	children?: React.ReactNode;
	item: CodeModel;
}
const CodeItem: FC<Props> = ({ item }) => {

	const navigate = useNavigate();
	const [userLogin, setUser] = useState<User | null>(null);

	const onClickCode = useCallback(() => {
		if (!userLogin) { // 로그인 확인 필요
			alert('로그인이 필요한 서비스입니다.');
			//onOpenDialog()
		} else {
			navigate(`/code/${item.id}`);
		}
	}, [userLogin]);

	

    useEffect(() => {
        const getSession = async () => {
            const { data, error } = await supabase.auth.getSession()
            if (error) {
                console.error(error)
            } else {
                const { data: { user } } = await supabase.auth.getUser()
                setUser(user);
            }
        }
        getSession()
    }, []);

    return (
		<ListItemButton sx={{
			'&:hover': {
				backgroundColor: '#999',
			},
		}} onClick={onClickCode}>
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

                            {/* 포인트, 닉네임, 시간*/}
							<div style={{ display: 'flex', alignItems: '', flexDirection : 'row', marginLeft:'8px' , marginTop:'8px'}}>
								<div className={styles.textOverflow} style={{textAlign: 'center',color:'grey', fontWeight :'bold'}}>
									{parseInt(item.price.toString()).toLocaleString()} c
								</div>
                            </div>


                            {/*  태그, 좋아요 수, popularity*/}
                            <div style={{ display: 'flex', alignItems: '', flexDirection : 'row', marginLeft:'8px' , marginTop:'8px'}}>
								<div className={styles.textOverflow} style={{textAlign: 'center',color:'grey'}}>
									{item.hashTag.map((e)=>`#${e} `)}
								</div>
					
							{/* <div className={styles.textOverflow} style={{ textAlign: 'center',marginLeft:'16px', color:'grey'}}>
								{0}
							</div> */}
							<div className={styles.textOverflow} style={{textAlign: 'center', marginLeft:'16px', color:'grey'  }}>
                                popularity : {item.popularity}
							</div>

                            {/* <div className={styles.textOverflow} style={{ textAlign: 'center',marginLeft:'16px', color:'grey'}}>
								 {userById.nickname} 
                                닉네임
							</div> */}
							<div className={styles.textOverflow} style={{textAlign: 'center', marginLeft:'16px', color:'grey'  }}>
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