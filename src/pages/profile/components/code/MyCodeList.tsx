import React, { FC } from 'react';
import { Divider, List, ListItem, ListItemText } from '@mui/material';
import {CodeModel} from "../../../../data/model/CodeModel";
import CodeItem from "./CodeItem";

interface Props {
	children?: React.ReactNode;
	maxCount: boolean,
	data?: CodeModel[] | null
}

export type RequestColumn = {
	requestAt: string,
	codeTitle: string,
}


const Header: FC = () => {
	return <ListItem>
		<ListItemText>
			<div style={{ display: 'flex', justifyContent: 'space-between'}}>
				<div style={{ width: '25%' ,fontWeight:'bold'}}>요청시간</div>
				<div style={{ width: '40%' ,fontWeight:'bold'}}>코드제목</div>
				<div style={{ width: '10%' ,fontWeight:'bold'}}>상태</div>
				<div style={{width: '25%'}}></div>
			</div>
		</ListItemText>

	</ListItem>;
};

const MyCodeList: FC<Props> = ({ maxCount, data }) => {
	if (!data) {
		return <>데이터가 없습니다.</>;
	}
	return (
		<List>
			<Header />
			<Divider />
			{maxCount ?
				data.slice(0, 3).map(item => {
						return <CodeItem key={item.id} item={item} />;
				}) :
				data.map(item => {
						return <CodeItem key={item.id} item={item} />;
				})
			}

		</List>
	);
};

export default MyCodeList;