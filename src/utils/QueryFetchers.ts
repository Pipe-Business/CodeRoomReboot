 import localApi from "../api/local/LocalApi";
import { apiClient } from "../api/ApiClient"

export const loginFetcher = async () => {
	const userToken = localApi.getUserToken();
	if (!userToken) {
		return null;
	}
	return apiClient.getTargetUser(userToken);

};