import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {FC} from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "./an-old-hope.css"

interface Props {
    code:string,
}
const RefactoringCodeShowAccordion:FC<Props> = ({code}) => {
    return (
        <div>
            <Accordion defaultExpanded sx={{border: '1px solid #D7D7D7'}}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <Typography>기존 코드 펼치기</Typography>
                </AccordionSummary>
                <AccordionDetails>
                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                            {code}
                        </ReactMarkdown>
                </AccordionDetails>
            </Accordion>
        </div>
    );
};

export default RefactoringCodeShowAccordion;