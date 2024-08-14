import AddIcon from '@mui/icons-material/Add';
import {Box, Button, Card, CardContent, CardHeader} from '@mui/material';
import React, {FC} from 'react';
import {useNavigate} from 'react-router-dom';
import {useQueryUserLogin} from '../../../hooks/fetcher/UserFetcher';
import {UsersCoinHistoryRes} from "../../../data/entity/UsersCoinHistoryRes";
import CoinHistoryList from "./CoinHistoryData/CoinHistoryList";


interface Props {
    coinHistoryData: UsersCoinHistoryRes[];
}

const PipeCoinContentData: FC<Props> = ({ coinHistoryData }) => {
    const navigate = useNavigate();
    const { userLogin, isLoadingUserLogin } = useQueryUserLogin();

    return (
        <div>
            <h3>코인 내역</h3>

            <Card sx={{ marginTop: '16px', marginLeft: '8px', }} raised elevation={1}>
                <CardHeader
                    title={<div style={{ fontSize: 18, fontWeight: 'bold' }}>코인 내역</div>}
                    // action={
                    //     <Button variant={'text'} endIcon={<AddIcon />} onClick={() => {
                    //         navigate(`/profile/my/cashhistory`, { state: { pointHistoryData: pointHistoryData, title: '코인 내역' } });
                    //     }}>
                    //         더보기</Button>
                    // }
                />
                <CardContent>
                    <CoinHistoryList coinHistory={coinHistoryData?.slice(0, 3)} />
                </CardContent>
            </Card>

            <Box height={32}/>
        </div>
    );
}

export default PipeCoinContentData;