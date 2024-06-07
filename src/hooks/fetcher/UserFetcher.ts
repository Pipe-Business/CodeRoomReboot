import { apiClient } from "../../api/ApiClient";
import { useQuery } from "@tanstack/react-query";
import { REACT_QUERY_KEY } from "../../constants/define";
import { loginFetcher } from "../../utils/QueryFetchers";

export function useQueryUserById(userToken: string) {
	const { isLoading, data, isFetching, error } = useQuery({
		queryKey: [REACT_QUERY_KEY.user, userToken],
		queryFn: () => apiClient.getTargetUser(userToken),
		refetchOnMount: "always",
	});
	return {
		isLoadingUserById: isLoading,
		userById: data,
		isFetchingUserById: isFetching,
		getUserByIdError: error,
	};
}

/**
 * 세션을 통한 자동 로그인
 * 세션이 저장된 유저라면 해당 값으로 로그인하여 UserEntity 를 리턴
 */
export function useQueryUserLogin() {
	const { isLoading, data: userLogin, error, isFetching } = useQuery({
		queryKey: [REACT_QUERY_KEY.login],
		queryFn: loginFetcher,
		refetchOnMount: "always",
	});
	return {
		isLoadingUserLogin: isLoading,
		userLogin: userLogin,
		errorUserLogin: error,
		isFetchingUserLogin: isFetching,
	};
}