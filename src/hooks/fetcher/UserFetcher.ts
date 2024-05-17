import { apiClient } from "../../api/ApiClient";
import { useQuery } from "@tanstack/react-query";

export function useQueryUserById(userToken: string) {
	const { isLoading, data, isFetching, error } = useQuery({
		queryKey: ['users', userToken],
		queryFn: () => apiClient.getTargetUser(userToken)
	});
	return {
		isLoadingUserById: isLoading,
		userById: data,
		isFetchingUserById: isFetching,
		getUserByIdError: error,
	};
}