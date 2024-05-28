import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Card, CardContent, CardHeader } from '@mui/material';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { CodeModel } from '../../../data/model/CodeModel';
import { useQueryUserLogin } from '../../../hooks/fetcher/UserFetcher';
import { SectionWrapper } from '../styles';


interface Props {
    children?: React.ReactNode;
    purchaseData: PurchaseSaleResponseEntity[],  
}

const SellerContentData: FC<Props> = ({ purchaseData}) => {
    const navigate = useNavigate();
    const { userLogin, isLoadingUserLogin } = useQueryUserLogin();


    return (
        <div>

            {/* <h2>수익 통계</h2>  */}

          
            {/* <SectionWrapper> */}

            <h4>판매</h4>

            <Card sx={{ marginTop: '16px', marginLeft: '8px', }} raised
                elevation={1}>
                <CardHeader
                    title={<div style={{ fontSize: 18, fontWeight: 'bold' }}>판매된 코드 내역</div>}
                    action={
                        <Button variant={'text'} endIcon={<AddIcon />} onClick={() => {
                            navigate(`/profile/my/purchase`, { state: { purchaseData: purchaseData, userLogin: userLogin } });
                        }}>
                            더보기</Button>
                    }
                />
                <CardContent>
                    {/* <PurchaseList purchaseData={purchaseData?.slice(0, 3)} userLogin={userLogin} /> */}
                </CardContent>
            </Card>
           

            <Card sx={{ marginTop: '16px', marginLeft: '8px', }} raised
                elevation={1}>
                <CardHeader
                    title={<div style={{ fontSize: 18, fontWeight: 'bold' }}>캐시 정산 내역</div>}
                    action={
                        <Button variant={'text'} endIcon={<AddIcon />} onClick={() => {
                            navigate(`/profile/my/purchase`, { state: { purchaseData: purchaseData, userLogin: userLogin } });
                        }}>
                            더보기</Button>
                    }
                />
                <CardContent>
                    {/* <PurchaseList purchaseData={purchaseData?.slice(0, 3)} userLogin={userLogin} /> */}
                </CardContent>
            </Card>
            <Box height={32} />
            <h4>수익</h4>
            <Card sx={{ marginTop: '16px', marginLeft: '8px', }} raised
                elevation={1}>
                <CardHeader
                    title={<div style={{ fontSize: 18, fontWeight: 'bold' }}>캐시 정산 대기 내역</div>}
                    action={
                        <Button variant={'text'} endIcon={<AddIcon />} onClick={() => {
                            navigate(`/profile/my/purchase`, { state: { purchaseData: purchaseData, userLogin: userLogin } });
                        }}>
                            더보기</Button>
                    }
                />
                <CardContent>
                    {/* <PurchaseList purchaseData={purchaseData?.slice(0, 3)} userLogin={userLogin} /> */}
                </CardContent>
            </Card>

            {/* </SectionWrapper> */}


        </div>
    );
}

export default SellerContentData;