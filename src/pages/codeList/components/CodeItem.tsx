import { ListItem, ListItemButton, ListItemText, Typography, Box } from '@mui/material';
import React, { FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainPageCodeListEntity } from '../../../data/entity/MainPageCodeListEntity';
import styles from '../../../global.module.css';
import { calcTimeDiff } from '../../../utils/DayJsHelper';

interface Props {
  children?: React.ReactNode;
  item: MainPageCodeListEntity;
}

const CodeItem: FC<Props> = ({ item }) => {
  const navigate = useNavigate();
  const onClickCode = useCallback(() => {
    navigate(`/code/${item.id}`);
  }, [item.id]);

  return (
    <ListItemButton
      sx={{
        transition: 'background-color 0.3s, transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          backgroundColor: '#e0e0e0',
          transform: 'scale(1.02)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
          borderRadius: '8px',
        },
      }}
      onClick={onClickCode}
    >
      <ListItem style={{ padding: '4px 0', position: 'relative' }}>
  <ListItemText>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        backgroundColor: '#F3F6FD',
        borderRadius: '8px',
        position: 'relative', // 리스트 아이템의 위치를 상대적으로 설정
      }}
    >
      <Typography
        variant="h6"
        sx={{ marginLeft: '8px', fontWeight: 'bold' }}
        className={styles.textOverflow}
      >
        {item.title}
      </Typography>

      {/* 캐시, 닉네임, 시간 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          marginLeft: '8px',
          marginTop: '8px',
        }}
      >
        <Typography variant="body2" sx={{ color: 'grey', fontWeight: 'bold', textAlign: 'center', fontSize: '18px'}}>
          {parseInt(item.price.toString()).toLocaleString()} 💰
        </Typography>
        <Box width={8} />
        <Typography variant="body2" sx={{ color: 'grey', fontWeight: 'bold', textAlign: 'center', fontSize: '18px'}}>
          {parseInt((item.price * 5).toLocaleString())} 🌱
        </Typography>
      </Box>

	  <Box height={16}/>
	  
      {/* 태그, 좋아요 수, popularity */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          marginLeft: '8px',
          marginTop: '8px',
        }}
      >
		  
        <Typography variant="body2" sx={{ color: 'grey', textAlign: 'center' }}>
          👍 {item.likeCount}
        </Typography>
        <Typography variant="body2" sx={{ color: 'grey', textAlign: 'center', marginLeft: '16px' }}>
          🔥 {item.buyerCount * item.price}
        </Typography>
        <Typography variant="body2" sx={{ color: 'grey', textAlign: 'center', marginLeft: '16px' }}>
          💬 {item.reviewCount}
        </Typography>
      </Box>

      <Typography
        variant="body2"
        sx={{ textAlign: 'center', marginLeft: '8px', color: 'grey', marginTop: '8px' }}
        className={styles.textOverflow}
      >
        {/* 기존의 위치 */}
      </Typography>

      {/* item.createdAt을 우측 상단으로 이동 */}
      <Typography
        variant="body2"
        sx={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          color: 'grey',
          textAlign: 'center',
        }}
        className={styles.textOverflow}
      >
        {calcTimeDiff(item.createdAt)}
      </Typography>
    </Box>
  </ListItemText>
</ListItem>
    </ListItemButton>
  );
};

export default CodeItem;