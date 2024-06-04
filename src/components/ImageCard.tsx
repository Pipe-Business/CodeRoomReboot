import React, { FC } from "react";
import { ImageList, ImageListItem, IconButton } from "@mui/material";
import { Link } from 'react-router-dom';
import ClearIcon from '@mui/icons-material/Clear';


interface Props {
    children?: React.ReactNode
    src: string[]
    handleDeleteImage: (index: number) => void
}

const ImageCard: FC<Props> = ({ src, handleDeleteImage }) => {
    return (
        <ImageList cols={src.length}>
            {Object.values(src).map((item: string, idx) => {
                return (

                    <ImageListItem key={idx} rows={1} style={{ position: 'relative' }}>
                        <Link to={item} target="_blank">
                            <img
                                style={{
                                    width: '250px',
                                    height: '250px',
                                    objectFit: 'contain'
                                }}
                                src={item}
                            />
                        </Link>
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteImage(idx);
                            }}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            }}
                        >
                            <ClearIcon />
                        </IconButton>
                    </ImageListItem>
                )

            })}

        </ImageList>
    );
};

export default ImageCard;