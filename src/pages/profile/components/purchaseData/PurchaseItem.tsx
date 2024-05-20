import React, { FC, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Divider, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../../../../api/ApiClient';
import CodeDownloadButton from '../../../codeInfo/components/CodeDownloadButton';
import { User } from '@supabase/supabase-js';

interface Props {
	children?: React.ReactNode;
	purchaseData: PurchaseSaleResponseEntity;
	userLogin: User;
}

const PurchaseItem: FC<Props> = ({ purchaseData, userLogin }) => {
	const { userId } = useParams();
	const { data: codeData } = useQuery({ queryKey: ['codeStore', purchaseData.post_id], queryFn: () => apiClient.getTargetCode(purchaseData.post_id) });
	const navigate = useNavigate();
	const { data: postedUser } = useQuery({

		queryKey: ['users', purchaseData?.sales_user_token, 'nickname'],
		queryFn: () => apiClient.getTargetUser(purchaseData.sales_user_token),
	});
	const onClickListItem = useCallback((e: any) => {
		e.stopPropagation();
		if (purchaseData) {
			// navigate(`/code/${codeData?.id}`);
			navigate(`/code/${codeData?.id}`,{state: {userLogin : userLogin}});

		}
	}, [codeData]);
	if (!codeData) {
		return <></>;
	}
	return (
		<>
			<ListItemButton onClick={onClickListItem}>
				<ListItem
					secondaryAction={!userId && codeData.postType === 'code' &&
						<CodeDownloadButton repoURL={codeData.githubRepoUrl} />}
				>

					<ListItemText
						primary={codeData?.title}
						secondary={postedUser?.nickname}
					/>

				</ListItem>

			</ListItemButton>
			<Divider />
		</>


	);
};

export default PurchaseItem;