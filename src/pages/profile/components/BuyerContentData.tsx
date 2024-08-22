import AddIcon from '@mui/icons-material/Add';
import {Box, Button, Card, CardContent, CardHeader} from '@mui/material';
import React, {FC} from 'react';
import {useNavigate} from 'react-router-dom';
import {CodeModel} from '../../../data/model/CodeModel';
import {useQueryUserLogin} from '../../../hooks/fetcher/UserFetcher';
import PurchaseList from './purchased/PurchaseList';
import {PurchaseSaleRes} from "../../../data/entity/PurchaseSaleRes";
import {LikeResponseEntity} from "../../../data/entity/LikeResponseEntity";

interface Props {
    children?: React.ReactNode;
    purchaseData: PurchaseSaleRes[];
    onWriteReviewClick: (purchaseData: PurchaseSaleRes) => void;
    onReadReviewClick: (purchaseData: PurchaseSaleRes) => void;
}

const BuyerContentData: FC<Props> = ({purchaseData , onWriteReviewClick, onReadReviewClick }) => {
    const { userLogin, isLoadingUserLogin } = useQueryUserLogin();
    const navigate = useNavigate();

    return (
        <div>
            <Box height={16}/>
            <Card sx={{marginTop: '16px', marginLeft: '8px',}} raised elevation={1}>
                <CardHeader
                    title={<div style={{fontSize: 18, fontWeight: 'bold', color: '#000000'}}>코드 구매 내역</div>}
                    action={
                        <Button variant={'text'} endIcon={<AddIcon/>} onClick={() => {
                            navigate(`/profile/my/purchase`, {
                                state: {
                                    purchaseData: purchaseData,
                                    userLogin: userLogin
                                }
                            });
                        }}>
                            더보기</Button>
                    }
                />
                {/*<CardContent>*/}
                {/*    <PurchaseList purchaseData={purchaseData?.slice(0, 3)} onWriteReviewClick={onWriteReviewClick}*/}
                {/*                  onReadReviewClick={onReadReviewClick}/>*/}
                {/*</CardContent>*/}
            </Card>

            <Box height={32}/>

            {/*<h4>캐시, 코인</h4>*/}
            {/*<Card sx={{ marginTop: '16px', marginLeft: '8px', }} raised elevation={1}>*/}
            {/*    <CardHeader*/}
            {/*        title={<div style={{ fontSize: 18, fontWeight: 'bold' }}>캐시, 코인 내역</div>}*/}
            {/*        action={*/}
            {/*            <Button variant={'text'} endIcon={<AddIcon />} onClick={() => {*/}
            {/*                navigate(`/profile/my/cashhistory`, { state: { cashPointHistoryData: cashPointHistoryData, title: '캐시,코인 내역' } });*/}
            {/*            }}>*/}
            {/*                더보기</Button>*/}
            {/*        }*/}
            {/*    />*/}
            {/*    <CardContent>*/}
            {/*        <CashHistoryList cashPointHistory={cashPointHistoryData?.slice(0, 3)} />*/}
            {/*    </CardContent>*/}
            {/*</Card>*/}
        </div>
    );
};

export default BuyerContentData;
