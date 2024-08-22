import React, {FC} from 'react';
import {Box} from '@mui/material';
import CodeList from "../../../codeList/components/CodeList";
import {useQuery} from "@tanstack/react-query";
import {apiClient} from "../../../../api/ApiClient";
import {useQueryUserLogin} from "../../../../hooks/fetcher/UserFetcher";
import ListLoadingSkeleton from "../ListLoadingSkeleton";
import ListEmptyText from "../ListEmptyText";

interface Props {
	children?: React.ReactNode,
}

const MyFavoriteTabPage: FC<Props> = () => {
	const {userLogin} = useQueryUserLogin();

	const {data: likedData, isLoading: isLikedDataLoading} = useQuery({
		queryKey: ['/liked', userLogin?.user_token!],
		queryFn: () => apiClient.getAllMyLikeData(userLogin!.user_token!),
	});

	if(likedData?.length === 0) {
		return <ListEmptyText/>;
	}

	if(isLikedDataLoading){
		return <ListLoadingSkeleton/>;
	}

	return (
		<div>
			<CodeList type='code' data={likedData} />
		</div>
	);
};

export default MyFavoriteTabPage;