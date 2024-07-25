import AiBuilderHeader from "./aiBuilderHeader";
import {Avatar, Box, Card, CardHeader} from "@mui/material";
import React from "react";
import {CardHeaderContainer} from "../styles";

interface Props{
    children:React.ReactNode;
    pageHeaderTitle:string;
    cardHeaderTitle?:string;
    profileUrl?:string;
}

const AibuilderPageLayout: React.FC<Props> = ({children, pageHeaderTitle, cardHeaderTitle,profileUrl}) => {
    return (
        <div>
            <AiBuilderHeader title={pageHeaderTitle}/>
            <Card
                elevation={0}
                sx={{
                    width: {xs: '100%', md: '100%'},
                    borderRadius: 2,
                    overflow: 'hidden',
                    mb: {xs: 2, md: 0},
                }}
            >
                <CardHeaderContainer>
                    {
                        profileUrl &&
                        <Avatar src={profileUrl} sx={{width: 45, height: 45, border: '3px solid black'}}/>
                    }
                <CardHeader title={cardHeaderTitle}/>
                </CardHeaderContainer>
                    <Box height={'32px'}/>
                        {children}
            </Card>
        </div>
    );
};

export default AibuilderPageLayout;