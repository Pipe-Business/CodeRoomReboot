import AiBuilderHeader from "./aiBuilderHeader";
import {Box, Card, CardHeader} from "@mui/material";
import React from "react";

interface Props{
    children:React.ReactNode;
    pageHeaderTitle:string;
    cardHeaderTitle?:string;
}

const AibuilderPageLayout: React.FC<Props> = ({children, pageHeaderTitle, cardHeaderTitle}) => {
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
                <CardHeader title={cardHeaderTitle}/>
                <Box height={'32px'}/>
                {children}
            </Card>
        </div>
    );
};

export default AibuilderPageLayout;