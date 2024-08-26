import React, {FC} from 'react';
import {TableBody} from '@mui/material';
import SaleItem from './SaleItem';
import {CodeModel} from "../../../../data/model/CodeModel";


interface Props {
	children?: React.ReactNode,
    codeData?: CodeModel[] | null,
}

const SaleList: FC<Props> = ({ codeData }) => {
	return (
		<TableBody>
				{codeData && codeData.map((v,i) => {
					return <SaleItem key={i} codeData={v}/>;
				})}
		</TableBody>
	);
};

export default SaleList;