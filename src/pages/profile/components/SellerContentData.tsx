import AddIcon from '@mui/icons-material/Add';
import {Box, Button, Card, CardContent, CardHeader} from '@mui/material';
import React, {FC} from 'react';
import {useNavigate} from 'react-router-dom';
import {useQueryUserLogin} from '../../../hooks/fetcher/UserFetcher';
import CashConfirmList from './cashData/CashConfirmList';
import {PurchaseSaleRes} from "../../../data/entity/PurchaseSaleRes";
import {CodeModel} from "../../../data/model/CodeModel";
import SaleList from "./saleData/SaleList";
import {PostStateType} from "../../../enums/PostStateType";
import MyCodeList from "./code/MyCodeList";


interface Props {
    saleData: PurchaseSaleRes[];
    codeData: CodeModel[];
    cashConfirmData : PurchaseSaleRes[],
    cashConfirmPendingData : PurchaseSaleRes[],
}

const SellerContentData: FC<Props> = ({codeData, saleData, cashConfirmData, cashConfirmPendingData}) => {
    const navigate = useNavigate();
    const { userLogin, isLoadingUserLogin } = useQueryUserLogin();


    return (
        <div>
            <h3>판매</h3>

            <Card sx={{ marginTop: '16px', marginLeft: '8px', }} raised
                elevation={1}>
                <CardHeader
                    title={<div style={{ fontSize: 18, fontWeight: 'bold', color: '#b4b4b4' }}>판매된 코드 내역</div>}
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

            <Box height={32}/>


            <h3>나의 코드</h3>
            <Card sx={{ marginTop: '16px', marginLeft: '8px', }} raised elevation={1}>
                <CardHeader
                    title={<div style={{ fontSize: 18, fontWeight: 'bold', color: '#b4b4b4' }}>코드 심사 진행 단계</div>}
                    action={
                        <Button variant={'text'} endIcon={<AddIcon />} onClick={() => {
                            navigate(`/profile/my/code-page`, { state: { codeData: codeData, type: PostStateType.pending, maxCount: false } });
                        }}>
                            더보기</Button>
                    }
                />
                <CardContent>
                    <MyCodeList maxCount={true} data={codeData?.slice(0, 3)}/>
                </CardContent>
            </Card>
            <Box height={32}/>

            <Box height={32} />
            <h4>수익</h4>
            <Card sx={{ marginTop: '16px', marginLeft: '8px', }} raised
                elevation={1}>
                <CardHeader
                    title={<div style={{ fontSize: 18, fontWeight: 'bold', color: '#b4b4b4' }}>캐시 정산 내역</div>}
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
                    title={<div style={{ fontSize: 18, fontWeight: 'bold', color: '#b4b4b4' }}>캐시 정산 대기 내역</div>}
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