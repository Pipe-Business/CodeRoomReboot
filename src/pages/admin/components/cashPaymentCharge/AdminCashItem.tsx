import React, {FC} from 'react';
import {Divider, ListItem, ListItemText} from '@mui/material';
import {BootPayPaymentModel} from "../../../../data/entity/BootPayPaymentModel";

interface Props {
	children?: React.ReactNode;
	item: BootPayPaymentModel;
}

const AdminCashItem: FC<Props> = ({item}) => {
	return <>
		<ListItem>
			<ListItemText>
				<div style={{display: 'flex'}}>
					<div style={{width: '20%'}}>{item?.created_at!.toString()}</div>
					<div style={{width: '25%'}}>{item.order_name}</div>
					<div style={{width: '10%'}}>{item.price} 원</div>
					<div style={{width: '10%'}}>{item.method_origin}</div>
					<div style={{width: '30%'}}>{item.receipt_url}</div>
				</div>
			</ListItemText>					{/*	TODO 영수증 링크를 다음줄로 넘기기 구현 필요 */}
		</ListItem>
		<Divider/>
	</>;
};

export default AdminCashItem;