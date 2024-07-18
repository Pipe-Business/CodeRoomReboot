import React, {FC} from "react";
import {BuilderMenuListItemContainer} from "../styles";
import {Box} from "@mui/material";

interface Props {
    title: string;
    content: string;
    width?: string;
    height?:string;
}

const BuilderMenuListItem:FC<Props> = ({title,content, width, height}) => {
    return (
        <BuilderMenuListItemContainer width={width} height={height}>
            <div style={{fontWeight:'bold', fontSize:'24px', textAlign:'start', padding:'12px 8px 12px'}}>{title}</div>
            <Box height={12}/>
            <div style={{color:'grey', fontSize:'16px', textAlign:'start', padding:'4px 8px 4px', userSelect: 'text'}}>{content}</div>
        </BuilderMenuListItemContainer>
    );
}

export default BuilderMenuListItem;