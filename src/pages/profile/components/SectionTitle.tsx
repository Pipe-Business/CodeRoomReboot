import React, {FC} from 'react';

interface Props {
    children?: React.ReactNode;
    title: string;
    helpText?: string;
}


const SectionTitle: FC<Props> = ({ title, helpText }) => {
    return (<div style={{ display: 'flex', alignItems: 'start', flexDirection: 'column' }}>
        <div style={{ fontSize: 20, paddingBottom: '8px', fontWeight: 'bold' }}> {title}</div>
       {helpText && 
       <div style={{ fontSize: 14, fontWeight: 'bold', color: 'grey' , whiteSpace : 'pre-line'}}>{helpText}</div>}
    </div>);
};
export default SectionTitle;