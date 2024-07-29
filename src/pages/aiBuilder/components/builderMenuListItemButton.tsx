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
    key?: number;
    imagePath: string;
}

const BuilderMenuListItemButton:FC<Props> = ({key,title,content,onClick, width, height,imagePath}) => {
    return (
        <BuilderMenuListItemButtonContainer onClick={onClick} width={width} height={height} key={key} image={imagePath}>
            <div style={{fontWeight:'bold', fontSize:'24px', textAlign:'start', padding:'12px 8px 12px', whiteSpace:'pre-wrap'}}>{title}</div>
            <div style={{color:'white', fontSize:'16px', textAlign:'start', paddingLeft:'8px', paddingRight:'8px', whiteSpace:'pre-wrap'}}>{content}</div>
        </BuilderMenuListItemButtonContainer>
    );
}

export default BuilderMenuListItemButton;