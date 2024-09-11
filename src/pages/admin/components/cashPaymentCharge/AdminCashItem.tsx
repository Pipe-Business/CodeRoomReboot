import React, {FC} from 'react';
import {Box, Link, ListItem, ListItemText, Tooltip, Typography, useTheme} from '@mui/material';
import {BootPayPaymentModel} from "../../../../data/entity/BootPayPaymentModel";

interface AdminCashItemProps {
	item: BootPayPaymentModel;
}

const AdminCashItem: FC<AdminCashItemProps> = ({ item }) => {
	const theme = useTheme();

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
		<ListItem divider>
			<ListItemText>
				<Box display="flex" alignItems="center">
					<Typography variant="body2" sx={{ width: '20%', px: 1 }}>
						{formatDate(item.created_at!)}
					</Typography>
					<Tooltip title={item.order_name} arrow>
						<Typography variant="body2" sx={{ width: '35%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', px: 1 }}>
							{item.order_name}
						</Typography>
					</Tooltip>
					<Typography variant="body2" sx={{ width: '15%', textAlign: 'right', px: 1 }}>
						{item.price.toLocaleString()} 원
					</Typography>
					<Typography variant="body2" sx={{ width: '15%', textAlign: 'center', px: 1 }}>
						{item.method_origin}
					</Typography>
					<Box sx={{ width: '15%', textAlign: 'center', px: 1 }}>
						<Link
							href={item.receipt_url}
							target="_blank"
							rel="noopener noreferrer"
							sx={{
								maxWidth: '100%',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
								display: 'inline-block',
								color: theme.palette.primary.main
							}}
						>
							영수증 보기
						</Link>
					</Box>
				</Box>
			</ListItemText>
		</ListItem>
	);
};

export default AdminCashItem;