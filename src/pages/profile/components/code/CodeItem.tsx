import React, {FC, useCallback} from 'react';

import {Button, ListItem, ListItemText} from '@mui/material';
import {CodeModel} from '../../../../data/model/CodeModel';
import {useNavigate} from 'react-router-dom';
import {reformatTime} from '../../../../utils/DayJsHelper';
import {PostStateType} from "../../../../enums/PostStateType";
import {useRecoilState} from "recoil";
import {codeInfo} from "../../../createCode/createCodeAtom";

interface Props {
	children?: React.ReactNode;
	item: CodeModel;
}

const CodeItem: FC<Props> = ({ item }) => {
	const [codeModel, setCodeInfo] = useRecoilState(codeInfo);

	const navigate = useNavigate();
	const onClickNavigateRejectForm = useCallback(() => {
		setCodeInfo(item);
		navigate('/create/code/codesubmission');
	},[]);

	return (
		<ListItem divider sx={{ height: '5vh' }}>
			<ListItemText>
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<div style={{ width: '25%' }}>
						{reformatTime(item.createdAt)}
					</div>

					<div style={{ width: '40%' }}>
						<div style={{
							display: 'flex',
						}}>
							{/* <PictogramImage size={30} formType={data.formType} category={data.category} /> */}
							<div style={{
								whiteSpace: 'nowrap',
								overflow: 'hidden',
								textOverflow: 'ellipsis',

							}}>{item.title}</div>
						</div>
					</div>
					<div
						style={{ width: '10%'}}>{item.state === PostStateType.pending ? '심사중' : item.state ===PostStateType.approve ? '승인' : '반려'}</div>
					<div style={{ width: '25%' }}>
						{(item.state === PostStateType.rejected || item.state === PostStateType.approve) &&
							<Button onClick={() => onClickNavigateRejectForm()}>
								수정 및 재심사
							</Button>}
					</div>
				</div>
			</ListItemText>
		</ListItem>
	);
};

export default CodeItem;