import {UsersCoinHistoryRes} from "../../../../data/entity/UsersCoinHistoryRes";
import React, {FC} from "react";
import {ListItem, ListItemText} from '@mui/material';
import {reformatTime} from "../../../../utils/DayJsHelper";
import {CoinHistoryType} from "../../../../enums/CoinHistoryType";
import {useQuery} from "@tanstack/react-query";
import {REACT_QUERY_KEY} from "../../../../constants/define";
import {apiClient} from "../../../../api/ApiClient";
import UserProfileImage from "../../../../components/profile/UserProfileImage";
import {useQueryUserLogin} from "../../../../hooks/fetcher/UserFetcher";

interface Props {
    coinHistoryData: UsersCoinHistoryRes;
}

const CoinHistoryItem: FC<Props> = ({coinHistoryData}) => {
    const { data: salesUserData, isLoading: salesUserLoading } = useQuery({
        queryKey: [REACT_QUERY_KEY.user, coinHistoryData.user_token!],
        queryFn: async() => await apiClient.getTargetUser(coinHistoryData.user_token)
    })
    const { userLogin } = useQueryUserLogin();

    return (
        <>
            {
                coinHistoryData &&
                (
                    <ListItem>
                        <ListItemText>
                            <div style={{display: 'flex'}}>
                                <div style={{width: '15%'}}>
                                    {reformatTime(coinHistoryData?.created_at!)}
                                </div>

                                {/*TODO: 마이페이지 - 나의 파이프 코인, admin 에서 이 컴포넌트를 같이쓰고있음. 간격이 다른것 처리 필요*/}
                                { userLogin!.user_token !== salesUserData!.user_token &&
                                    <div style={{width: '20%'}}>
                                    <div style={{display: 'flex'}}>
                                        <UserProfileImage userId={salesUserData?.user_token!}/>
                                        <div>
                                            <div>{salesUserData?.nickname}</div>
                                            <div>{salesUserData?.email}</div>
                                        </div>
                                    </div>
                                </div>}

                                <div style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    width: '40%'
                                }}>
                                    {coinHistoryData?.description!}
                                </div>
                                <div style={{width: '15%'}}>
                                    {
                                        `${coinHistoryData!.coin_history_type === CoinHistoryType.earn_coin ? '+' : '-'}
                                        ${coinHistoryData!.coin}
                                        코인
                                        `
                                    }
                                </div>
                                <div style={{width: '10%'}}>
                                    {`${coinHistoryData!.amount.toLocaleString()} 코인`}
                                </div>
                            </div>
                        </ListItemText>
                    </ListItem>
                )
            }
        </>
    );
}

export default CoinHistoryItem;