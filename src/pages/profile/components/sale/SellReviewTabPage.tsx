import React, {FC} from 'react';
import {Table, TableContainer} from '@mui/material';
import {apiClient} from "../../../../api/ApiClient";
import {useQueryUserLogin} from "../../../../hooks/fetcher/UserFetcher";
import {useQuery} from "@tanstack/react-query";
import TableHeader from "../TableHeader";
import SaleList from "./SaleList";
import ListLoadingSkeleton from "../ListLoadingSkeleton";

const MyPurchasedTabPage: FC = () => {
	const {userLogin} = useQueryUserLogin();
	const {data: saleData, isLoading: saleCodeDataLoading, refetch: refetchSaleData} = useQuery({
		queryKey: ['/sale', userLogin?.user_token!],
		queryFn: () => apiClient.getMySaleHistory(userLogin!.user_token!),
	});

	if(saleCodeDataLoading) {
		return <ListLoadingSkeleton/>;
	}
	
	return (
		<TableContainer>
			<Table>
				<TableHeader  headerList={["요청시간","코드제목","심사상태",""]}/>
				<SaleList saleData={saleData}/>
			</Table>
		</TableContainer>
	);
};

export default MyPurchasedTabPage;
