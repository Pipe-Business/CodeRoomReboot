import React, {FC} from "react";
import { ImageList, ImageListItem,} from "@mui/material";
import { Link } from 'react-router-dom';

interface Props {
    children?: React.ReactNode
    src:Object
}

const ImageCard: FC<Props> = ({src}) => {
    return (
        <ImageList>
            {Object.values(src).map((item:string,idx)=>{
                return (
                    <Link to={item} key={idx} target="_blank">
                        <ImageListItem >
                            <img
                                style={{
                                    width:'500px',
                                    height:'500px',
                                    objectFit:'contain'
                                }}
                                src={item}
                            />
                        </ImageListItem>

                    </Link>
                )

            })}

        </ImageList>
    );
};

export default ImageCard;