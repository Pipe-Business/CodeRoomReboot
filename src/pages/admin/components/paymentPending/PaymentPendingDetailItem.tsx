import React, { FC } from 'react';
import { Typography, Box, Chip, Avatar } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import TitleIcon from '@mui/icons-material/Title';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { reformatTime } from '../../../../utils/DayJsHelper';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../../api/ApiClient';
import { PurchaseSaleRes } from '../../../../data/entity/PurchaseSaleRes';
import { REACT_QUERY_KEY } from '../../../../constants/define';

interface Props {
	item: PurchaseSaleRes;
}

const PaymentPendingDetailItem: FC<Props> = ({ item }) => {
	const { data: codeData, isLoading: codeDataLoading } = useQuery({
		queryKey: ['codeStore', item.post_id],
		queryFn: () => apiClient.getTargetCode(item.post_id)
	});

	const { data: purchaseUserData, isLoading: purchaseUserLoading } = useQuery({
		queryKey: [REACT_QUERY_KEY.user, item.purchase_user_token!],
		queryFn: async () => await apiClient.getTargetUser(item?.purchase_user_token!)
	});

	if (codeDataLoading || purchaseUserLoading) {
		return <Box p={2}>로딩 중...</Box>;
	}

	return (
		<Box
			display="flex"
			flexDirection="column"
			p={2}
			borderRadius={1}
			bgcolor="background.paper"
			boxShadow={1}
			width="97%"
			maxWidth="100%"
			overflow="hidden"
		>
			<Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
				<Box display="flex" alignItems="center" overflow="hidden">
					<Avatar src={purchaseUserData?.profile_url} alt={purchaseUserData?.nickname}>
						{purchaseUserData?.nickname.charAt(0)}
					</Avatar>
					<Box ml={2} overflow="hidden">
						<Typography variant="subtitle1" noWrap>{codeData?.title}</Typography>
						<Typography variant="body2" color="text.secondary" noWrap>{purchaseUserData?.nickname}</Typography>
					</Box>
				</Box>
				<Chip
					label={item.confirmed_time ? "정산 완료" : "정산 대기중"}
					color={item.confirmed_time ? "success" : "warning"}
					size="small"
				/>
			</Box>

			<Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={2}>
				<Box display="flex" alignItems="center">
					<AccessTimeIcon fontSize="small" color="action" sx={{ mr: 1, flexShrink: 0 }} />
					<Typography variant="body2" noWrap>
						판매 시각: {reformatTime(item.created_at!)}
					</Typography>
				</Box>
				<Box display="flex" alignItems="center">
					<PersonIcon fontSize="small" color="action" sx={{ mr: 1, flexShrink: 0 }} />
					<Typography variant="body2" noWrap>
						구매자: {purchaseUserData?.nickname}
					</Typography>
				</Box>
				<Box display="flex" alignItems="center">
					<TitleIcon fontSize="small" color="action" sx={{ mr: 1, flexShrink: 0 }} />
					<Typography variant="body2" noWrap>
						게시글 제목: {codeData?.title}
					</Typography>
				</Box>
				<Box display="flex" alignItems="center">
					<AttachMoneyIcon fontSize="small" color="action" sx={{ mr: 1, flexShrink: 0 }} />
					<Typography variant="body2" noWrap>
						가격: {codeData?.price?.toLocaleString()} 원
					</Typography>
				</Box>
			</Box>

			{item.confirmed_time && (
				<Box mt={2}>
					<Typography variant="body2" color="text.secondary">
						정산 완료 시각: {reformatTime(item.confirmed_time)}
					</Typography>
				</Box>
			)}
		</Box>
	);
};

export default PaymentPendingDetailItem;