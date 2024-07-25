import React, {FC} from "react";
import {IdeaListItemButtonContainer} from "../styles";

interface Props {
    children?: React.ReactNode;
    title: string;
    content: string;
    onClick:() => void;
    width?: string;
    height?:string;
    key?: number;
}

const IdeaListItemButton:FC<Props> = ({key,title,content,onClick, width, height}) => {
    return (
        <IdeaListItemButtonContainer onClick={onClick} width={width} height={height} key={key}>
            <div style={{fontWeight:'bold', fontSize:'24px', textAlign:'start', padding:'12px 8px 12px', whiteSpace:'pre-wrap'}}>{title}</div>
            <div style={{color:'black', fontSize:'16px', textAlign:'start', paddingLeft:'8px', paddingRight:'8px', whiteSpace:'pre-wrap'}}>{content}</div>
        </IdeaListItemButtonContainer>
    );
}

export default IdeaListItemButton;