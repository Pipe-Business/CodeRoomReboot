import React, {FC} from "react";
import {BuilderMenuListItemButtonContainer} from "../styles";
import {Box} from "@mui/material";

interface Props {
    children?: React.ReactNode;
    title: string;
    content: string;
    onClick:() => void;
    width?: string;
    height?:string;
    key: number;
}

const BuilderMenuListItemButton:FC<Props> = ({key,title,content,onClick, width, height}) => {
    return (
        <BuilderMenuListItemButtonContainer onClick={onClick} width={width} height={height} key={key}>
            <div style={{fontWeight:'bold', fontSize:'24px', textAlign:'start', padding:'12px 8px 12px'}}>{title}</div>
            <Box height={12}/>
            <div style={{color:'grey', fontSize:'16px', textAlign:'start', padding:'4px 8px 4px'}}>{content}</div>
        </BuilderMenuListItemButtonContainer>
    );
}

export default BuilderMenuListItemButton;