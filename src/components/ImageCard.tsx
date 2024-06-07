import React, { FC } from "react";
import { Box, IconButton } from "@mui/material";
import { Link } from 'react-router-dom';
import ClearIcon from '@mui/icons-material/Clear';

interface Props {
    children?: React.ReactNode;
    src: string[];
    handleDeleteImage: (index: number) => void;
}

const ImageCard: FC<Props> = ({ src, handleDeleteImage }) => {
    return (
        <Box 
            sx={{
                display: 'flex',
                alignItems: 'center',
                overflowX: 'auto', // 수평 스크롤 가능하도록
                gap: '8px', // 이미지 사이의 간격 조정
                padding: '8px 0', // 상하 패딩 추가
                '&::-webkit-scrollbar': {
                    height: '8px',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: '#bbb',
                    borderRadius: '4px',
                },
                '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                },
            }}
        >
            {src.map((item: string, idx) => (
                <Box
                    key={idx}
                    sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        width: '100px',
                        height: '100px',
                        flexShrink: 0,
                        backgroundColor: '#fff',
                    }}
                >
                    <Link to={item} target="_blank" style={{ display: 'block', width: '100%', height: '100%' }}>
                        <img
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                borderRadius: '4px', // 이미지에도 약간의 border-radius를 추가하여 일관성 제공
                            }}
                            src={item}
                            alt={`uploaded ${idx}`}
                        />
                    </Link>
                    <IconButton
                        onClick={(e) => {
                            e.preventDefault();
                            handleDeleteImage(idx);
                        }}
                        sx={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            padding: '4px',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 1)',
                            }
                        }}
                        size="small"
                    >
                        <ClearIcon fontSize="small" />
                    </IconButton>
                </Box>
            ))}
        </Box>
    );
};

export default ImageCard;
