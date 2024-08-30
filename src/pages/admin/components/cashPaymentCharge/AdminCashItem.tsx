import React, { FC } from 'react';
import { TableCell, TableRow, Link } from '@mui/material';
import { BootPayPaymentModel } from "../../../../data/entity/BootPayPaymentModel";

interface Props {
	item: BootPayPaymentModel;
}

const AdminCashItem: FC<Props> = ({ item }) => {
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleString('ko-KR', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	return (
		<TableRow>
			<TableCell>{formatDate(item.created_at!)}</TableCell>
			<TableCell>{item.order_name}</TableCell>
			<TableCell align="right">{item.price.toLocaleString()} 원</TableCell>
			<TableCell>{item.method_origin}</TableCell>
			<TableCell>
				<Link
					href={item.receipt_url}
					target="_blank"
					rel="noopener noreferrer"
					style={{
						maxWidth: '200px',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',
						display: 'inline-block'
					}}
				>
					영수증 보기
				</Link>
			</TableCell>
		</TableRow>
	);
};

export default AdminCashItem;