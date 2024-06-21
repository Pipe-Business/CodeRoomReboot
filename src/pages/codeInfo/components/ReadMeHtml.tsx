// src/components/HtmlEmbed.tsx
import React from 'react';

interface HtmlEmbedProps {
    htmlText: string;
}

const ReadMeHtml: React.FC<HtmlEmbedProps> = ({htmlText}) => {
    return (
        <div dangerouslySetInnerHTML={{__html: htmlText}}/>
    );
};

export default ReadMeHtml;
