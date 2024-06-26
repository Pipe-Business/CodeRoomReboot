import AddIcon from '@mui/icons-material/Add';
import {Box, Button, Card, CardContent, CardHeader} from '@mui/material';
import React, {FC} from 'react';
import {useNavigate} from 'react-router-dom';
import {useQueryUserLogin} from '../../../hooks/fetcher/UserFetcher';
import CashConfirmList from './cashData/CashConfirmList';
import {PurchaseSaleResponseEntity} from "../../../data/entity/PurchaseSaleResponseEntity";


interface Props {
    children?: React.ReactNode;
    cashConfirmData : PurchaseSaleResponseEntity[],
    cashConfirmPendingData : PurchaseSaleResponseEntity[],
}

const SellerContentData: FC<Props> = ({ cashConfirmData, cashConfirmPendingData}) => {
    const navigate = useNavigate();
    const { userLogin, isLoadingUserLogin } = useQueryUserLogin();


    return (
        <div>

            {/* <h2>수익 통계</h2>  */}

          
            {/* <SectionWrapper> */}

            <Box height={32} />
            <h4>수익</h4>
            <Card sx={{ marginTop: '16px', marginLeft: '8px', }} raised
                elevation={1}>
                <CardHeader
                    title={<div style={{ fontSize: 18, fontWeight: 'bold' }}>캐시 정산 내역</div>}
                    action={
                        <Button variant={'text'} endIcon={<AddIcon />} onClick={() => {
                            navigate(`/profile/my/cashconfirm`, { state: { cashConfirm: cashConfirmData, title: '캐시 정산 내역'} });
                        }}>
                            더보기</Button>
                    }
                />
                <CardContent>
                    <CashConfirmList cashConfirmData={cashConfirmData?.slice(0, 3)}/>
                </CardContent>
            </Card>
            <Card sx={{ marginTop: '16px', marginLeft: '8px', }} raised
                elevation={1}>
                <CardHeader
                    title={<div style={{ fontSize: 18, fontWeight: 'bold' }}>캐시 정산 대기 내역</div>}
                    action={
                        <Button variant={'text'} endIcon={<AddIcon />} onClick={() => {
                            navigate(`/profile/my/cashconfirm`, { state: { cashConfirm: cashConfirmPendingData, title: '캐시 정산 대기 내역' } });
                        }}>
                            더보기</Button>
                    }
                />
                <CardContent>
                <CashConfirmList cashConfirmData={cashConfirmPendingData?.slice(0, 3)}/>
                </CardContent>
            </Card>

            {/* </SectionWrapper> */}


        </div>
    );
}

export default SellerContentData;