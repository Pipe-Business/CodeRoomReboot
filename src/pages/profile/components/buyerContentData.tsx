import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Card, CardContent, CardHeader } from '@mui/material';
import React, { FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CodeModel } from '../../../data/model/CodeModel';
import { useQueryUserLogin } from '../../../hooks/fetcher/UserFetcher';
import PurchaseList from './purchaseData/PurchaseList';
import CodePendingOrPendingList from './code/MyCodeList';
import CashHistoryList from './CashHistoryData/CashHistoryList';

interface Props {
    children?: React.ReactNode;
    purchaseData: PurchaseSaleResponseEntity[];
    pendingCodeData: CodeModel[];
    approvedCodeData: CodeModel[];
    rejectedCodeData: CodeModel[];
    cashHistoryData: CashHistoryResponseEntity[];
    pointHistoryData: PointHistoryResponseEntity[];
    onWriteReviewClick: (purchaseData: PurchaseSaleResponseEntity) => void;
}

const BuyerContentData: FC<Props> = ({ purchaseData, pendingCodeData, approvedCodeData, rejectedCodeData, cashHistoryData, pointHistoryData, onWriteReviewClick }) => {
    const { userLogin, isLoadingUserLogin } = useQueryUserLogin();
    const navigate = useNavigate();

    return (
        <div>
            <Box height={32} />
            <h4>내가 구매한 코드</h4>
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
                    <PurchaseList purchaseData={purchaseData?.slice(0, 3)} onWriteReviewClick={onWriteReviewClick} />
                </CardContent>
            </Card>

            <Box height={32} />

            <h4>나의 코드</h4>
            <Card sx={{ marginTop: '16px', marginLeft: '8px', }} raised elevation={1}>
                <CardHeader
                    title={<div style={{ fontSize: 18, fontWeight: 'bold' }}>승인 대기 내역</div>}
                    action={
                        <Button variant={'text'} endIcon={<AddIcon />} onClick={() => {
                            navigate(`/profile/my/code-page`, { state: { codeData: pendingCodeData, type: 'pending', maxCount: false } });
                        }}>
                            더보기</Button>
                    }
                />
                <CardContent>
                    <CodePendingOrPendingList maxCount={true} data={pendingCodeData?.slice(0, 3)} type={'pending'} />
                </CardContent>
            </Card>
            <Card sx={{ marginTop: '16px', marginLeft: '8px', }} raised elevation={1}>
                <CardHeader
                    title={<div style={{ fontSize: 18, fontWeight: 'bold' }}>반려 내역</div>}
                    action={
                        <Button variant={'text'} endIcon={<AddIcon />} onClick={() => {
                            navigate(`/profile/my/code-page`, { state: { codeData: rejectedCodeData, type: 'rejected', maxCount: false } });
                        }}>
                            더보기</Button>
                    }
                />
                <CardContent>
                    <CodePendingOrPendingList maxCount={true} data={rejectedCodeData?.slice(0, 3)} type={'rejected'} />
                </CardContent>
            </Card>
            <Card sx={{ marginTop: '16px', marginLeft: '8px', }} raised elevation={1}>
                <CardHeader
                    title={<div style={{ fontSize: 18, fontWeight: 'bold' }}>승인 내역</div>}
                    action={
                        <Button variant={'text'} endIcon={<AddIcon />} onClick={() => {
                            navigate(`/profile/my/code-page`, { state: { codeData: approvedCodeData, type: 'approve', maxCount: false } });
                        }}>
                            더보기</Button>
                    }
                />
                <CardContent>
                    <CodePendingOrPendingList maxCount={true} data={approvedCodeData?.slice(0, 3)} type={'approve'} />
                </CardContent>
            </Card>
            <Box height={32} />

            <h4>캐시, 포인트</h4>
            <Card sx={{ marginTop: '16px', marginLeft: '8px', }} raised elevation={1}>
                <CardHeader
                    title={<div style={{ fontSize: 18, fontWeight: 'bold' }}>캐시 내역</div>}
                    action={
                        <Button variant={'text'} endIcon={<AddIcon />} onClick={() => {
                            navigate(`/profile/my/cashhistory`, { state: { cashHistoryData: cashHistoryData, title: '캐시 내역' } });
                        }}>
                            더보기</Button>
                    }
                />
                <CardContent>
                    <CashHistoryList cashHistoryData={cashHistoryData?.slice(0, 3)} />
                </CardContent>
            </Card>

            <Card sx={{ marginTop: '16px', marginLeft: '8px', }} raised elevation={1}>
                <CardHeader
                    title={<div style={{ fontSize: 18, fontWeight: 'bold' }}>포인트 내역</div>}
                    action={
                        <Button variant={'text'} endIcon={<AddIcon />} onClick={() => {
                            navigate(`/profile/my/cashhistory`, { state: { pointHistoryData: pointHistoryData, title: '포인트 내역' } });
                        }}>
                            더보기</Button>
                    }
                />
                <CardContent>
                    <CashHistoryList pointHistoryData={pointHistoryData?.slice(0, 3)} />
                </CardContent>
            </Card>
        </div>
    );
};

export default BuyerContentData;
