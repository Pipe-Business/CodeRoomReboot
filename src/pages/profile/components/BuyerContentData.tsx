import AddIcon from '@mui/icons-material/Add';
import {Box, Button, Card, CardContent, CardHeader} from '@mui/material';
import React, {FC} from 'react';
import {useNavigate} from 'react-router-dom';
import {CodeModel} from '../../../data/model/CodeModel';
import {useQueryUserLogin} from '../../../hooks/fetcher/UserFetcher';
import PurchaseList from './purchaseData/PurchaseList';
import CashHistoryList from './CashHistoryData/CashHistoryList';
import SaleList from './saleData/SaleList';
import {PurchaseSaleResponseEntity} from "../../../data/entity/PurchaseSaleResponseEntity";
import MyCodeList from "./code/MyCodeList";
import {CashPointHistoryEntity} from "../../../data/model/CashPointHistoryEntity";

interface Props {
    children?: React.ReactNode;
    saleData: PurchaseSaleResponseEntity[];
    purchaseData: PurchaseSaleResponseEntity[];
    codeData: CodeModel[];
    cashPointHistoryData:CashPointHistoryEntity[];
    onWriteReviewClick: (purchaseData: PurchaseSaleResponseEntity) => void;
    onReadReviewClick: (purchaseData: PurchaseSaleResponseEntity) => void;
}

const BuyerContentData: FC<Props> = ({codeData, saleData, purchaseData,cashPointHistoryData, onWriteReviewClick, onReadReviewClick }) => {
    const { userLogin, isLoadingUserLogin } = useQueryUserLogin();
    const navigate = useNavigate();

    return (
        <div>
            <Box height={32} />
            <h3>내가 구매한 코드</h3>
            <Card sx={{ marginTop: '16px', marginLeft: '8px', }} raised elevation={1}>
                <CardHeader
                    title={<div style={{ fontSize: 18, fontWeight: 'bold' }}>구매 목록</div>}
                    action={
                        <Button variant={'text'} endIcon={<AddIcon />} onClick={() => {
                            navigate(`/profile/my/purchase`, { state: { purchaseData: purchaseData, userLogin: userLogin } });
                        }}>
                            더보기</Button>
                    }
                />
                <CardContent>
                    <PurchaseList purchaseData={purchaseData?.slice(0, 3)} onWriteReviewClick={onWriteReviewClick} onReadReviewClick={onReadReviewClick}  />
                </CardContent>
            </Card>

            <Box height={32} />

            <h3>판매</h3>

            <Card sx={{ marginTop: '16px', marginLeft: '8px', }} raised
                elevation={1}>
                <CardHeader
                    title={<div style={{ fontSize: 18, fontWeight: 'bold' }}>판매된 코드 내역</div>}
                    action={
                        <Button variant={'text'} endIcon={<AddIcon />} onClick={() => {
                            navigate(`/profile/my/sale`, { state: { saleData: saleData, userLogin: userLogin } });
                        }}>
                            더보기</Button>
                    }
                />
                <CardContent>
                    <SaleList saleData={saleData?.slice(0, 3)}/>
                </CardContent>
            </Card>

            <Box height={32} />


            <h3>나의 코드</h3>
            <Card sx={{ marginTop: '16px', marginLeft: '8px', }} raised elevation={1}>
                <CardHeader
                    title={<div style={{ fontSize: 18, fontWeight: 'bold' }}>코드 심사 진행 단계</div>}
                    action={
                        <Button variant={'text'} endIcon={<AddIcon />} onClick={() => {
                            navigate(`/profile/my/code-page`, { state: { codeData: codeData, type: 'pending', maxCount: false } });
                        }}>
                            더보기</Button>
                    }
                />
                <CardContent>
                    <MyCodeList maxCount={true} data={codeData?.slice(0, 3)}/>
                </CardContent>
            </Card>
            <Box height={32} />

            <h4>캐시, 포인트</h4>
            <Card sx={{ marginTop: '16px', marginLeft: '8px', }} raised elevation={1}>
                <CardHeader
                    title={<div style={{ fontSize: 18, fontWeight: 'bold' }}>캐시, 포인트 내역</div>}
                    action={
                        <Button variant={'text'} endIcon={<AddIcon />} onClick={() => {
                            navigate(`/profile/my/cashhistory`, { state: { cashPointHistoryData: cashPointHistoryData, title: '캐시,포인트 내역' } });
                        }}>
                            더보기</Button>
                    }
                />
                <CardContent>
                    <CashHistoryList cashPointHistory={cashPointHistoryData?.slice(0, 3)} />
                </CardContent>
            </Card>

            {/*<Card sx={{ marginTop: '16px', marginLeft: '8px', }} raised elevation={1}>*/}
            {/*    <CardHeader*/}
            {/*        title={<div style={{ fontSize: 18, fontWeight: 'bold' }}>포인트 내역</div>}*/}
            {/*        action={*/}
            {/*            <Button variant={'text'} endIcon={<AddIcon />} onClick={() => {*/}
            {/*                navigate(`/profile/my/cashhistory`, { state: { pointHistoryData: pointHistoryData, title: '포인트 내역' } });*/}
            {/*            }}>*/}
            {/*                더보기</Button>*/}
            {/*        }*/}
            {/*    />*/}
            {/*    <CardContent>*/}
            {/*        <CashHistoryList pointHistoryData={pointHistoryData?.slice(0, 3)} />*/}
            {/*    </CardContent>*/}
            {/*</Card>*/}
        </div>
    );
};

export default BuyerContentData;
