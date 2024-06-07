import { ListItem, ListItemButton, ListItemText, Typography, Box, Divider } from '@mui/material';
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
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              position: 'relative',
            }}
          >
            <Typography
              variant="h6"
              sx={{ marginLeft: '8px', fontWeight: 'bold', color: '#0275c2' }}
              className={styles.textOverflow}
            >
              {item.title}
            </Typography>

            <Typography variant="body2" sx={{ marginLeft: '8px', color: 'grey', fontSize: '14px' }}>
              {item.description}
            </Typography>

            <Typography variant="body2" sx={{ marginLeft: '8px', color: 'grey', fontSize: '14px' }}>
              {item.hashTag.map((item, index) => (
                <Typography key={index} sx={{ display: 'inline', marginRight: '8px', color: '#0275c2' }}>
                  #{item}
                </Typography>
              ))}
            </Typography>

            {/* 캐시, 닉네임, 시간 */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                marginLeft: '8px',
                marginTop: '8px',
                marginBottom: '8px'                
              }}
            >
              <Typography variant="body2" sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', fontSize: '22px' }}>
                💵 {parseInt(item.price.toString()).toLocaleString()}
              </Typography>
              <Box width={8} />
              <Typography variant="body2" sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', fontSize: '22px' }}>
                🌱 {parseInt((item.price * 5).toLocaleString())}
              </Typography>
            </Box>

            {/* item.createdAt을 좌측 하단으로 이동 */}
            <Typography
              variant="body2"
              sx={{
                position: 'absolute',
                bottom: '24px',
                left: '24px',
                color: 'grey',
                textAlign: 'center',
              }}
              className={styles.textOverflow}
            >
              {calcTimeDiff(item.createdAt)}
            </Typography>

            <Box height={16} />

            {/* 태그, 좋아요 수, 인기도, 리뷰 수를 우측 상단으로 이동 */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center', // 수평 가운데 정렬
                position: 'absolute',
                top: '24px',
                right: '24px',
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#0275c2', fontSize: '24px' }}>
                  {item.likeCount}
                </Typography>
                <Typography variant="body2" sx={{ color: 'grey' }}>
                  좋아요
                </Typography>
              </Box>

              <Box
                sx={{
                  width: '1px',
                  height: '48px',
                  backgroundColor: '#e0e0e0',
                  marginLeft: '16px',
                }}
              />

              <Box sx={{ textAlign: 'center', marginLeft: '16px' }}>
                <Typography variant="body2" sx={{ color: '#0275c2', fontSize: '24px' }}>
                  {item.reviewCount}
                </Typography>
                <Typography variant="body2" sx={{ color: 'grey' }}>
                  리뷰
                </Typography>
              </Box>

              <Box
                sx={{
                  width: '1px',
                  height: '48px',
                  backgroundColor: '#e0e0e0',
                  marginLeft: '16px',
                }}
              />

              <Box sx={{ textAlign: 'center', marginLeft: '16px' }}>
                <Typography variant="body2" sx={{ color: '#0275c2', fontSize: '24px' }}>
                  {item.buyerCount * item.price}
                </Typography>
                <Typography variant="body2" sx={{ color: 'grey' }}>
                  인기도
                </Typography>
              </Box>
            </Box>
          </Box>
        </ListItemText>
      </ListItem>
    </ListItemButton>
  );
};

export default CodeItem;
