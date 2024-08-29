import React, { FC, useCallback, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface Props {
	children?: React.ReactNode;
	value:string;
	setValue:React.Dispatch<React.SetStateAction<string>>;
}

const SelectCodeCategory: FC<Props> = ({value,setValue}) => {
	const [labelMsg, setLabelMsg] = useState('');
	const onChangeSelectCategory = useCallback((e: SelectChangeEvent) => {
		const updateValue = e.target.value as string;
		console.log(updateValue);
		if (!updateValue) {
			setLabelMsg('카테고리를 선택해주세요');
		} else {
			setLabelMsg('');
		}
		setValue(updateValue);

	}, [value]);
	return (
		<FormControl sx={{ minWidth: '20vw' }}>
			<InputLabel id='demo-simple-select-label'>{labelMsg}</InputLabel>
			<Select
				labelId='demo-simple-select-label'
				id='demo-simple-select'
				value={value}
				onChange={onChangeSelectCategory}>
				<MenuItem value={'frontend'}>프론트엔드</MenuItem>
				<MenuItem value={'webPublishing'}>웹 퍼블리싱</MenuItem>
				<MenuItem value={'app'}>앱개발</MenuItem>
				<MenuItem value={'desktop'}>데스크탑 개발</MenuItem>
				<MenuItem value={'backendServer'}>백엔드/서버</MenuItem>
				<MenuItem value={'gameDevelop'}>게임개발</MenuItem>
				<MenuItem value={'blockChain'}>블록체인</MenuItem>
				<MenuItem value={'AI'}>AI</MenuItem>
				<MenuItem value={'dataAnalysis'}>데이터분석</MenuItem>
				<MenuItem value={'other'}>기타</MenuItem>
			</Select>
		</FormControl>
	);
};

export default SelectCodeCategory;