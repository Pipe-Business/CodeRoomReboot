import React, {FC} from "react";
import {BuilderMenuListItemContainer} from "../styles";
import {Box} from "@mui/material";

interface Props {
    title: string;
    content: string;
    width?: string;
    height?:string;
}
// TODO : 로직 확인 후 불필요 하면 제거
const BuilderMenuListItem:FC<Props> = ({title,content, width, height}) => {
    return (
        <>
        </>
        // <BuilderMenuListItemContainer width={width} height={height}>
        //     <div style={{fontWeight:'bold', fontSize:'24px', textAlign:'start', padding:'12px 8px 12px', userSelect:'text'}}>{title}</div>
        //     <Box height={12}/>
        //     <div style={{color:'grey', fontSize:'16px', textAlign:'start', padding:'4px 8px 4px', userSelect: 'text'}}>{content}</div>
        // </BuilderMenuListItemContainer>
    );
}

export default BuilderMenuListItem;