import React, { FC, useCallback, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { LANGUAGE_FILTER } from '../../../constants/define';

interface Props {
	children?: React.ReactNode;
	inputCategory: string;
	setLanguage:React.Dispatch<React.SetStateAction<string>>
}


const SelectCodeLanguage: FC<Props> = ({ inputCategory, setLanguage: setLanguage }) => {
	const [labelMsg,setLabelMsg] = useState('')
	const onChangeSelectCategory = useCallback((e: SelectChangeEvent) => {
		const updateValue = e.target.value as string
		console.log(updateValue);
		if(!updateValue){
			setLabelMsg('사용언어를 선택해주세요')
		}
		else{
			setLabelMsg('')
		}
		setLanguage(updateValue);

	}, [inputCategory]);


	return (
		<FormControl sx={{ minWidth: '20vw' }}>
			<InputLabel id='demo-simple-select-label'>{labelMsg}</InputLabel>
			<Select


				labelId='demo-simple-select-label'
				id='demo-simple-select'
				value={inputCategory}

				onChange={onChangeSelectCategory}
			>
				{LANGUAGE_FILTER.map((value, index) => {
					return (
						<MenuItem key={index} value={value}>
							<div style={{
								display: 'flex',
								alignItems: 'center',
								width: '100%',
								paddingBottom: '4px',
								marginTop: '4px',
							}}>
								{/* <PictogramImage size={30} formType={'code'} category={value} /> */}
								<div style={{ marginLeft: '4px' }}>{value}</div>
							</div>
						</MenuItem>

					);

				})}
			</Select>

		</FormControl>
	);
};

export default SelectCodeLanguage;