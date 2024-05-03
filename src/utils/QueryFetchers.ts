// import localApi from "../api/local/LocalApi";
import { supabase } from "../api/ApiClient"
import { QueryFunctionContext, QueryKey } from '@tanstack/react-query';

// export const loginFetcher = async () => {
// 	const userId = localApi.getUserToken();
// 	if (!userId) {
// 		return null;
// 	}
// 	return getUserById(userId);

// };

// export const loginFetcher = async () =>{
//    return await supabase.auth.getSession();
// }

// export async function supabaseGetAllWithQuery<T>(queryFnCtx: QueryKey, ...queryData: QueryConstraint[]): Promise<T[] | null> {
//     try {
// 		const url = getQueryKeyToUrl(queryFnCtx);

// 		const filterQuery = query(ref(db, url), ...queryData);
// 		let li: T[] = [];
// 		const snapshot = await get(filterQuery);
// 		console.log(snapshot.val());
// 		snapshot.forEach(child => {
// 			li.push(child.val() as T);
// 		});

// 		return li.reverse();
// 	} catch (e) {
// 		throw new Error((e as Error).message);
// 	}
// }
