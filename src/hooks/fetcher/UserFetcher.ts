//import { useQuery } from '@tanstack/react-query';
//import {
	//firebaseGetAllFetcher,
	//firebaseGetAllWithQuery,
	//firebaseGetOneFetcher,
	//loginFetcher,
//} from '../../utils/QueryFetcher.ts';
//import { UserEntity } from '../../data/entity/firebase/realtime/user/UserEntity.ts';
//import { notificationMapper, userMapper } from '../../api/apiMapper.ts';
//import { REACT_QUERY_KEY } from '../../utils/Constant.ts';
//import { UserNotificationEntity } from '../../data/entity/firebase/realtime/user/UserNotificationEntity.ts';
//import { orderByChild } from 'firebase/database';

/**
 * 세션을 통한 자동 로그인
 * 세션이 저장된 유저라면 해당 값으로 로그인하여 UserEntity 를 리턴
 */
// export function useQueryUserLogin() {
// 	const { isLoading, data: userLogin, error, isFetching } = useQuery({
// 		queryKey: [REACT_QUERY_KEY.login],
// 		queryFn: loginFetcher,
// 	});
// 	return {
// 		isLoadingUserLogin: isLoading,
// 		userLogin: userLogin,
// 		errorUserLogin: error,
// 		isFetchingUserLogin: isFetching,
// 	};
// }