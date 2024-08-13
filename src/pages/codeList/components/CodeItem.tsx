import {Box, ListItem, ListItemButton, ListItemText, Paper, Typography} from '@mui/material';
import React, {FC, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {MainPageCodeListEntity} from '../../../data/entity/MainPageCodeListEntity';
import styles from '../../../global.module.css';
import {calcTimeDiff} from '../../../utils/DayJsHelper';
import ReadMeHtml from "../../codeInfo/components/ReadMeHtml";

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
      <ListItem sx={{ padding: '4px 0', position: 'relative', width: '100%' }}>
        <ListItemText>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              padding: { xs: '16px', sm: '24px', md: '24px' },
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              position: 'relative',
            }}
          >
            <Typography
              variant="h5"
              sx={{
                ml: '8px',
                fontWeight: 'bold',
                color: '#0275c2',
                fontSize: { xs: '18px', sm: '22px', md: '24px' }
              }}
              className={styles.textOverflow}
            >
              {item.title}
            </Typography>

              <Typography
                  variant="h5"
                  sx={{
                      ml: '8px',
                      color: '#b4b4b4',
                      fontSize: { xs: '12px', sm: '12px', md: '16px' },
                      marginTop: '6px',
                  }}
                  className={styles.textOverflow}
              >
                  {
                      item.hashTag &&
                      (item.hashTag.map((tag) => `#${tag} `))
                  }

              </Typography>

                {/* 캐시, 닉네임, 시간 */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'row',
                        ml: '8px',
                        mt: '8px',
                        mb: '8px',
                    }}
                >
                    <Typography variant="body2" sx={{
                        color: 'black',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        fontSize: {xs: '16px', sm: '20px', md: '22px'},
                        marginRight: '16px'
                    }}>
                        💵 {item.code_price.toLocaleString()}
                    </Typography>
                </Box>

            {/* item.createdAt을 좌측 하단으로 이동 */}
            <Typography
              variant="body2"
              sx={{
                position: 'absolute',
                bottom: { xs: '16px', md: '24px' },
                left: { xs: '16px', md: '24px' },
                color: 'grey',
                textAlign: 'center',
                fontSize: { xs: '10px', sm: '12px', md: '14px' },
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
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                position: 'absolute',
                top: { xs: '16px', md: '24px' },
                right: { xs: '16px', md: '24px' },
              }}
            >
              <Box sx={{ textAlign: 'center', mb: { xs: 1, md: 0 } }}>
                <Typography variant="body2" sx={{ color: '#0275c2', fontSize: { xs: '18px', sm: '20px', md: '24px' } }}>
                  {item.likeCount}
                </Typography>
                <Typography variant="body2" sx={{ color: 'grey', fontSize: { xs: '10px', sm: '12px', md: '14px' } }}>
                  좋아요
                </Typography>
              </Box>

              <Box
                sx={{
                  width: { xs: '48px', md: '1px' },
                  height: { xs: '1px', md: '48px' },
                  backgroundColor: '#e0e0e0',
                  mx: { xs: 0, md: '16px' },
                  my: { xs: '8px', md: 0 },
                }}
              />

              <Box sx={{ textAlign: 'center', mb: { xs: 1, md: 0 } }}>
                <Typography variant="body2" sx={{ color: '#0275c2', fontSize: { xs: '18px', sm: '20px', md: '24px' } }}>
                  {item.reviewCount}
                </Typography>
                <Typography variant="body2" sx={{ color: 'grey', fontSize: { xs: '10px', sm: '12px', md: '14px' } }}>
                  리뷰
                </Typography>
              </Box>

              <Box
                sx={{
                  width: { xs: '48px', md: '1px' },
                  height: { xs: '1px', md: '48px' },
                  backgroundColor: '#e0e0e0',
                  mx: { xs: 0, md: '16px' },
                  my: { xs: '8px', md: 0 },
                }}
              />

              <Box sx={{ textAlign: 'center', mb: { xs: 1, md: 0 } }}>
                <Typography variant="body2" sx={{ color: '#0275c2', fontSize: { xs: '18px', sm: '20px', md: '24px' } }}>
                  {(item.buyerCount).toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: 'grey', fontSize: { xs: '10px', sm: '12px', md: '14px' } }}>
                  구매됨
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
